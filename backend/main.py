# backend/main.py
import sqlite3
import re
import sys 
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Literal

# --- AÑADIDO: Importaciones para Monitorización ---
from prometheus_fastapi_instrumentator import Instrumentator
from loguru import logger

# LangChain
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from langchain_ollama.llms import OllamaLLM
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma
from langchain.chains import RetrievalQA
from langchain_core.runnables import RunnableBranch, RunnableLambda, RunnablePassthrough

# --- AÑADIDO: CONFIGURACIÓN DE LOGGING ESTRUCTURADO ---
logger.remove()
logger.add(sys.stdout, serialize=True, enqueue=True)

class InterceptHandler(logging.Handler):
    def emit(self, record):
        try:
            level = logger.level(record.levelname).name
        except ValueError:
            level = record.levelno
        logger.log(level, record.getMessage())

logging.basicConfig(handlers=[InterceptHandler()], level=0, force=True)
logging.getLogger("uvicorn").handlers = [InterceptHandler()]
logging.getLogger("uvicorn.access").handlers = [InterceptHandler()]


# --- CONFIGURACIÓN Y MODELOS ---
VECTOR_STORE_DIR = "vector_store"
DB_PATH = "tickets.db"
app = FastAPI(title="Corporate EPIS Pilot API - Advanced Flow")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"],
)

# --- AÑADIDO: INSTRUMENTACIÓN DE PROMETHEUS ---
Instrumentator().instrument(app).expose(app)


llm = OllamaLLM(model="smollm:360m", temperature=0, base_url="http://host.docker.internal:11434")
embeddings = HuggingFaceEmbeddings(model_name="intfloat/multilingual-e5-large")
vector_store = Chroma(persist_directory=VECTOR_STORE_DIR, embedding_function=embeddings)
retriever = vector_store.as_retriever(search_kwargs={"k": 2})

# --- LÓGICA DE LANGCHAIN (MODIFICADA PARA SMOLLM) ---
rag_prompt_template = """Answer in Spanish. Use only the context below. Be brief (1-2 sentences max). Do not repeat the question.
Context: {context}
Question: {question}
Answer:"""
rag_prompt = PromptTemplate.from_template(rag_prompt_template)
rag_chain = RetrievalQA.from_chain_type(llm=llm, chain_type="stuff", retriever=retriever, chain_type_kwargs={"prompt": rag_prompt})

def create_support_ticket(description: str) -> str:
    """Crea un ticket de soporte y devuelve un mensaje de confirmación."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    problem_description = description.replace("ACTION_CREATE_TICKET:", "").strip()
    if not problem_description:
        problem_description = "Problema no especificado por el usuario."

    cursor.execute("INSERT INTO tickets (description, status) VALUES (?, ?)", (problem_description, "Abierto"))
    ticket_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return f"✅ He creado el **ticket de soporte #{ticket_id}** con tu problema: *'{problem_description}'*. El equipo técnico se pondrá en contacto contigo pronto."

# El router ahora es más simple
# CAMBIO 1: Añadimos la nueva intención 'despedida'
class RouteQuery(BaseModel):
    intent: Literal["pregunta_general", "reporte_de_problema", "despedida"] = Field(description="La intención del usuario.")

output_parser = JsonOutputParser(pydantic_object=RouteQuery)
# CAMBIO 2: Actualizamos el prompt para que el LLM sepa qué es una 'despedida'
router_prompt = PromptTemplate(
    template="""
    Clasifica la pregunta del usuario en 'pregunta_general', 'reporte_de_problema' o 'despedida'. Responde solo con JSON.
    'pregunta_general': El usuario pide información (¿qué es?, ¿cuántos?, ¿cómo?).
    'reporte_de_problema': El usuario describe un problema, algo está roto o no funciona.
    'despedida': El usuario expresa gratitud o se despide (gracias, adiós, perfecto, vale).
    Pregunta: {question}
    Formato: {format_instructions}
    """,
    input_variables=["question"],
    partial_variables={"format_instructions": output_parser.get_format_instructions()},
)

def extract_intent(text: str) -> dict:
    """Extrae la intención del texto generado por smollm de forma robusta."""
    text_lower = text.lower()
    # Buscar palabras clave en la respuesta del LLM
    if "reporte_de_problema" in text_lower or "problema" in text_lower:
        return {"intent": "reporte_de_problema"}
    elif "despedida" in text_lower or "adios" in text_lower or "gracias" in text_lower:
        return {"intent": "despedida"}
    elif "pregunta_general" in text_lower:
        return {"intent": "pregunta_general"}
    return {"intent": "pregunta_general"}

def classify_intent_by_keywords(question: str) -> str:
    """Clasificación rápida basada en palabras clave del usuario (sin LLM)."""
    q = question.lower().strip()
    # Saludos
    greetings = ["hola", "buenos dias", "buenas tardes", "buenas noches", "saludos", "hey", "que tal"]
    if q in greetings:
        return "saludo"
    # Despedidas
    farewells = ["gracias", "adios", "adiós", "chao", "bye", "hasta luego", "perfecto", "vale", "ok gracias"]
    if q in farewells or any(q.startswith(f) for f in farewells):
        return "despedida"
    # Problemas
    problem_keywords = ["no funciona", "error", "problema", "falla", "no puedo", "no me deja", 
                        "se cae", "lento", "roto", "no carga", "no abre", "no conecta",
                        "no sirve", "ayuda", "urgente", "caido", "caído"]
    if any(kw in q for kw in problem_keywords):
        return "reporte_de_problema"
    return None  # No se pudo clasificar por keywords, usar LLM

router_chain = router_prompt | llm | RunnableLambda(extract_intent)

chain_with_preserved_input = RunnablePassthrough.assign(decision=router_chain)

problem_chain = RunnableLambda(lambda x: {"query": x["question"]}) | rag_chain


def clean_llm_output(text: str) -> str:
    """Limpia la salida del LLM para evitar alucinaciones y repeticiones."""
    if not text:
        return "No encontré información específica sobre este tema en mis documentos."
    # Cortar el bucle infinito si el modelo empieza a alucinar
    for delimiter in ["Pregunta:", "Contexto:", "Context:", "Question:", "Answer:", "Respuesta:"]:
        if delimiter in text:
            text = text.split(delimiter)[0]
    # Eliminar repeticiones de líneas
    lines = text.strip().split("\n")
    seen = set()
    unique_lines = []
    for line in lines:
        stripped = line.strip()
        if stripped and stripped not in seen:
            seen.add(stripped)
            unique_lines.append(stripped)
    text = " ".join(unique_lines)
    text = text.strip()
    # Limitar longitud
    if len(text) > 250:
        text = text[:247] + "..."
    return text if text else "No encontré información específica sobre este tema en mis documentos."


# --- ENDPOINT DE LA API (MODIFICADO) ---
@app.get("/ask")
def ask_question(question: str):
    try:
        # Paso 1: Clasificación rápida por keywords (sin usar LLM)
        quick_intent = classify_intent_by_keywords(question)
        
        if quick_intent == "saludo":
            return {"answer": "¡Hola! 👋 Soy **EPIS Pilot**, tu asistente virtual. ¿En qué puedo ayudarte hoy?", "follow_up_required": False}
        
        if quick_intent == "despedida":
            return {"answer": "¡De nada! 😊 Si necesitas algo más, aquí estaré. ¡Que tengas un excelente día!", "follow_up_required": False}

        # Crear ticket directamente
        if question.startswith("ACTION_CREATE_TICKET:"):
            description = question.split(":", 1)[1]
            return {"answer": create_support_ticket(description), "follow_up_required": False}

        # Paso 2: Si es un reporte de problema por keywords, ir directo al RAG
        if quick_intent == "reporte_de_problema":
            intent = "reporte_de_problema"
        else:
            # Paso 3: Usar el LLM para clasificar solo si no se pudo por keywords
            try:
                decision_result = chain_with_preserved_input.invoke({"question": question})
                decision = decision_result.get("decision", {})
                if isinstance(decision, dict):
                    intent = decision.get("intent", "pregunta_general")
                else:
                    intent = "pregunta_general"
            except Exception as e:
                logger.warning(f"Error en clasificación LLM, usando pregunta_general: {e}")
                intent = "pregunta_general"
                decision_result = {"question": question}
        
        # Si vino de keyword, necesitamos construir decision_result
        if quick_intent == "reporte_de_problema":
            decision_result = {"question": question, "decision": {"intent": "reporte_de_problema"}}

        answer = ""
        follow_up = False

        if intent == "pregunta_general":
            result = problem_chain.invoke(decision_result)
            raw_solution = result.get("result", "No se encontró respuesta.")
            answer = clean_llm_output(raw_solution)
        elif intent == "reporte_de_problema":
            result = problem_chain.invoke(decision_result)
            raw_solution = result.get("result", "No he encontrado una solución específica en mis documentos.")
            solution = clean_llm_output(raw_solution)
            answer = f"{solution}\n\n**¿Esta información soluciona tu problema?**"
            follow_up = True
        elif intent == "despedida":
            answer = "¡De nada! 😊 Si necesitas algo más, aquí estaré. ¡Que tengas un excelente día!"
            follow_up = False
            
        return {"answer": answer, "follow_up_required": follow_up}

    except Exception as e:
        logger.error(f"Error en el endpoint /ask: {e}")
        return {"answer": "Lo siento, ha ocurrido un error procesando tu consulta. Por favor, intenta de nuevo.", "follow_up_required": False}


# --- NUEVO: ENDPOINT PARA LISTAR TICKETS ---
@app.get("/tickets")
def get_tickets():
    """Retorna todos los tickets de soporte registrados."""
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("SELECT id, description, status FROM tickets ORDER BY id DESC")
        rows = cursor.fetchall()
        conn.close()
        tickets = [{"id": row[0], "description": row[1], "status": row[2]} for row in rows]
        return {"tickets": tickets, "total": len(tickets)}
    except Exception as e:
        logger.error(f"Error al obtener tickets: {e}")
        return {"tickets": [], "total": 0}