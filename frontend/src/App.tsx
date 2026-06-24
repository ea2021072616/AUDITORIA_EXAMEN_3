import { useState, type FormEvent } from 'react';
import ChatLayout from './components/ChatLayout';

export interface Message {
  id: number;
  content: string;
  sender: 'user' | 'bot';
}

// Mensaje inicial mejorado
const initialMessage: Message = {
  id: 0,
  content: "¡Hola! 👋 Soy **EPIS Pilot**, tu asistente virtual corporativo de **EPIS Corp**. Puedo ayudarte con:\n\n• 📋 **Consultas generales** sobre políticas y procedimientos\n• 🔧 **Reportar problemas técnicos**\n• 🎫 **Crear tickets de soporte**\n\n¿En qué puedo ayudarte hoy?",
  sender: 'bot',
};

export interface Ticket {
  id: number;
  description: string;
  status: string;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showFeedbackButtons, setShowFeedbackButtons] = useState(false);
  const [showFollowUpOptions, setShowFollowUpOptions] = useState(false);
  const [isWaitingForTicketDescription, setIsWaitingForTicketDescription] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'tickets'>('chat');
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [ticketsLoading, setTicketsLoading] = useState(false);

  const loadTickets = async () => {
    setTicketsLoading(true);
    try {
      const response = await fetch('/api/tickets');
      if (response.ok) {
        const data = await response.json();
        setTickets(data.tickets || []);
      }
    } catch (error) {
      console.error("Error al cargar tickets:", error);
    } finally {
      setTicketsLoading(false);
    }
  };

  const handleTabChange = (tab: 'chat' | 'tickets') => {
    setActiveTab(tab);
    if (tab === 'tickets') {
      loadTickets();
    }
  };

  const sendMessage = async (messageToSend: string, isInternalAction = false) => {
    setShowFeedbackButtons(false);
    setShowFollowUpOptions(false);

    let finalMessage = messageToSend;

    if (isWaitingForTicketDescription && !isInternalAction) {
      finalMessage = `ACTION_CREATE_TICKET:${messageToSend}`;
      setIsWaitingForTicketDescription(false);
      isInternalAction = true;
    }
    
    if (!isInternalAction) {
      const userMessage: Message = { id: Date.now(), sender: 'user', content: messageToSend };
      setMessages((prev) => [...prev, userMessage]);
    }
    
    setIsLoading(true);
    setInput('');

    try {
      const response = await fetch(`/api/ask?question=${encodeURIComponent(finalMessage)}`);
      if (!response.ok) throw new Error('Error en la respuesta de la red');

      const data = await response.json();
      const botMessage: Message = { id: Date.now() + 1, sender: 'bot', content: data.answer };
      setMessages((prev) => [...prev, botMessage]);

      if (data.follow_up_required) {
        setShowFeedbackButtons(true);
      }
    } catch (error) {
      console.error("Error al contactar la API:", error);
      const errorMessage: Message = { id: Date.now() + 1, sender: 'bot', content: "⚠️ Error: No se pudo obtener respuesta del servidor. Verifica tu conexión." };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input);
  };

  const handleFeedback = (response: 'yes' | 'no') => {
    setShowFeedbackButtons(false);
    if (response === 'yes') {
      const confirmationMessage: Message = { id: Date.now(), sender: 'bot', content: "¡Genial! 🎉 Me alegro de haberte ayudado. Si necesitas algo más, no dudes en preguntar." };
      setMessages((prev) => [...prev, confirmationMessage]);
    } else {
      const followUpMessage: Message = { id: Date.now(), sender: 'bot', content: "Entendido. ¿Cómo deseas proceder?" };
      setMessages((prev) => [...prev, followUpMessage]);
      setShowFollowUpOptions(true);
    }
  };

  const handleFollowUpChoice = (choice: 'create_ticket' | 'explain_more') => {
    setShowFollowUpOptions(false);
    
    if (choice === 'create_ticket') {
      const askForDescriptionMessage: Message = { id: Date.now(), sender: 'bot', content: "📝 De acuerdo. Por favor, **describe tu problema con detalle** para que un experto pueda atenderte. Lo que escribas a continuación se registrará en el ticket de soporte." };
      setMessages((prev) => [...prev, askForDescriptionMessage]);
      setIsWaitingForTicketDescription(true);
    } else {
      const explainMoreMessage: Message = { id: Date.now(), sender: 'bot', content: "Por favor, describe tu problema con más detalle y trataré de ayudarte." };
      setMessages((prev) => [...prev, explainMoreMessage]);
    }
  };

  return (
    <ChatLayout
      messages={messages}
      input={input}
      setInput={setInput}
      handleSubmit={handleSubmit}
      isLoading={isLoading}
      showFeedbackButtons={showFeedbackButtons}
      onFeedback={handleFeedback}
      showFollowUpOptions={showFollowUpOptions}
      onFollowUpChoice={handleFollowUpChoice}
      activeTab={activeTab}
      onTabChange={handleTabChange}
      tickets={tickets}
      ticketsLoading={ticketsLoading}
    />
  );
}

export default App;