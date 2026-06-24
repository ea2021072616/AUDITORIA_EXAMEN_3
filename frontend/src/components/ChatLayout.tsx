import { type FormEvent, useRef, useEffect } from 'react';
import { 
  Box, Paper, Typography, TextField, IconButton, CircularProgress, 
  Button, Stack, Avatar, Chip, Badge
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import BusinessIcon from '@mui/icons-material/Business';
import ChatIcon from '@mui/icons-material/Chat';
import ReactMarkdown from 'react-markdown';
import { type Message, type Ticket } from '../App';

interface ChatLayoutProps {
  messages: Message[];
  input: string;
  setInput: (value: string) => void;
  handleSubmit: (e: FormEvent) => void;
  isLoading: boolean;
  showFeedbackButtons: boolean;
  onFeedback: (response: 'yes' | 'no') => void;
  showFollowUpOptions: boolean;
  onFollowUpChoice: (choice: 'create_ticket' | 'explain_more') => void;
  activeTab: 'chat' | 'tickets';
  onTabChange: (tab: 'chat' | 'tickets') => void;
  tickets: Ticket[];
  ticketsLoading: boolean;
}

const BRAND_PRIMARY = '#1a237e';
const BRAND_SECONDARY = '#283593';
const BRAND_ACCENT = '#3f51b5';
const BRAND_GRADIENT = 'linear-gradient(135deg, #1a237e 0%, #283593 50%, #3949ab 100%)';
const BRAND_LIGHT = '#e8eaf6';

export default function ChatLayout({ 
  messages, input, setInput, handleSubmit, isLoading, 
  showFeedbackButtons, onFeedback,
  showFollowUpOptions, onFollowUpChoice,
  activeTab, onTabChange,
  tickets, ticketsLoading
}: ChatLayoutProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, showFeedbackButtons, showFollowUpOptions]);

  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: '#f0f2f5', fontFamily: "'Segoe UI', 'Roboto', sans-serif" }}>
      {/* Sidebar */}
      <Box sx={{ 
        width: 280, 
        background: BRAND_GRADIENT,
        display: { xs: 'none', md: 'flex' }, 
        flexDirection: 'column',
        color: 'white',
        boxShadow: '4px 0 20px rgba(0,0,0,0.15)'
      }}>
        {/* Logo Section */}
        <Box sx={{ p: 3, borderBottom: '1px solid rgba(255,255,255,0.15)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
            <BusinessIcon sx={{ fontSize: 32 }} />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: 1, lineHeight: 1.2 }}>EPIS Corp</Typography>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>Mesa de Ayuda con IA</Typography>
            </Box>
          </Box>
        </Box>

        {/* Navigation */}
        <Box sx={{ p: 2, flex: 1 }}>
          <Button 
            fullWidth 
            startIcon={<ChatIcon />}
            onClick={() => onTabChange('chat')}
            sx={{ 
              justifyContent: 'flex-start', 
              color: 'white', 
              mb: 1,
              py: 1.5,
              px: 2,
              borderRadius: 2,
              bgcolor: activeTab === 'chat' ? 'rgba(255,255,255,0.2)' : 'transparent',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.15)' },
              textTransform: 'none',
              fontSize: '0.95rem'
            }}
          >
            Chat de Soporte
          </Button>
          <Button 
            fullWidth 
            startIcon={<ConfirmationNumberIcon />}
            onClick={() => onTabChange('tickets')}
            sx={{ 
              justifyContent: 'flex-start', 
              color: 'white',
              py: 1.5,
              px: 2,
              borderRadius: 2,
              bgcolor: activeTab === 'tickets' ? 'rgba(255,255,255,0.2)' : 'transparent',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.15)' },
              textTransform: 'none',
              fontSize: '0.95rem'
            }}
          >
            Historial de Tickets
            {tickets.length > 0 && (
              <Badge badgeContent={tickets.length} color="error" sx={{ ml: 'auto' }} />
            )}
          </Button>
        </Box>

        {/* Footer */}
        <Box sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.15)' }}>
          <Typography variant="caption" sx={{ opacity: 0.6, display: 'block', textAlign: 'center' }}>
            Powered by SmolLM AI 🤖
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.4, display: 'block', textAlign: 'center', mt: 0.5 }}>
            v2.0 • EPIS Corp © 2026
          </Typography>
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', maxHeight: '100vh' }}>
        {/* Top Header Bar */}
        <Box sx={{ 
          px: 3, py: 1.5, 
          background: 'white',
          borderBottom: '1px solid #e0e0e0',
          display: 'flex', 
          alignItems: 'center', 
          gap: 2,
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
        }}>
          <Avatar sx={{ bgcolor: BRAND_PRIMARY, width: 40, height: 40 }}>
            <SupportAgentIcon />
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: BRAND_PRIMARY, lineHeight: 1.2 }}>
              {activeTab === 'chat' ? 'EPIS Pilot' : 'Historial de Tickets'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {activeTab === 'chat' ? '🟢 En línea • Asistente Virtual' : `${tickets.length} ticket(s) registrado(s)`}
            </Typography>
          </Box>
        </Box>

        {activeTab === 'chat' ? (
          /* Chat Area */
          <>
            <Box sx={{ flex: 1, overflowY: 'auto', p: 2, bgcolor: '#f8f9fa' }}>
              {messages.map((msg) => (
                <Box key={msg.id} sx={{ 
                  mb: 2, display: 'flex', 
                  justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  alignItems: 'flex-end',
                  gap: 1
                }}>
                  {msg.sender === 'bot' && (
                    <Avatar sx={{ bgcolor: BRAND_ACCENT, width: 32, height: 32, mb: 0.5 }}>
                      <SmartToyIcon sx={{ fontSize: 18 }} />
                    </Avatar>
                  )}
                  <Paper elevation={0} sx={{ 
                    p: 2, 
                    maxWidth: '70%', 
                    bgcolor: msg.sender === 'user' ? BRAND_PRIMARY : 'white', 
                    color: msg.sender === 'user' ? 'white' : '#333', 
                    borderRadius: msg.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    boxShadow: msg.sender === 'user' 
                      ? '0 2px 8px rgba(26,35,126,0.3)' 
                      : '0 1px 4px rgba(0,0,0,0.1)',
                    border: msg.sender === 'bot' ? '1px solid #e8eaf6' : 'none',
                    '& p': { margin: 0 },
                    '& ul, & ol': { margin: '4px 0', paddingLeft: '20px' },
                    '& strong': { color: msg.sender === 'user' ? 'white' : BRAND_PRIMARY }
                  }}>
                    <Typography variant="body2" component="div" sx={{ lineHeight: 1.6 }}>
                      <ReactMarkdown>{msg.content || '...'}</ReactMarkdown>
                    </Typography>
                  </Paper>
                  {msg.sender === 'user' && (
                    <Avatar sx={{ bgcolor: '#546e7a', width: 32, height: 32, mb: 0.5 }}>
                      <PersonIcon sx={{ fontSize: 18 }} />
                    </Avatar>
                  )}
                </Box>
              ))}
              {isLoading && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 5 }}>
                  <CircularProgress size={20} sx={{ color: BRAND_ACCENT }} />
                  <Typography variant="caption" color="text.secondary">EPIS Pilot está pensando...</Typography>
                </Box>
              )}
              
              {/* Botones de Feedback */}
              {showFeedbackButtons && (
                <Box sx={{ display: 'flex', justifyContent: 'flex-start', ml: 5, mt: 1 }}>
                  <Stack direction="row" spacing={1}>
                    <Button 
                      variant="outlined" size="small" onClick={() => onFeedback('yes')}
                      sx={{ 
                        borderColor: '#4caf50', color: '#4caf50', borderRadius: 3,
                        '&:hover': { bgcolor: '#e8f5e9', borderColor: '#4caf50' }
                      }}
                    >
                      ✅ Sí, solucionado
                    </Button>
                    <Button 
                      variant="contained" size="small" onClick={() => onFeedback('no')}
                      sx={{ 
                        bgcolor: '#ef5350', borderRadius: 3,
                        '&:hover': { bgcolor: '#e53935' }
                      }}
                    >
                      ❌ No, necesito más ayuda
                    </Button>
                  </Stack>
                </Box>
              )}

              {/* Botones de Siguientes Pasos */}
              {showFollowUpOptions && (
                <Box sx={{ display: 'flex', justifyContent: 'flex-start', ml: 5, mt: 1 }}>
                  <Stack direction="row" spacing={1}>
                    <Button 
                      variant="contained" size="small" onClick={() => onFollowUpChoice('create_ticket')}
                      sx={{ 
                        bgcolor: BRAND_PRIMARY, borderRadius: 3,
                        '&:hover': { bgcolor: BRAND_SECONDARY }
                      }}
                    >
                      🎫 Abrir un Ticket
                    </Button>
                    <Button 
                      variant="outlined" size="small" onClick={() => onFollowUpChoice('explain_more')}
                      sx={{ 
                        borderColor: BRAND_ACCENT, color: BRAND_ACCENT, borderRadius: 3,
                        '&:hover': { bgcolor: BRAND_LIGHT }
                      }}
                    >
                      💬 Explicar mejor mi problema
                    </Button>
                  </Stack>
                </Box>
              )}

              <div ref={messagesEndRef} />
            </Box>

            {/* Input Area */}
            <Box sx={{ 
              p: 2, 
              borderTop: '1px solid #e0e0e0', 
              bgcolor: 'white',
              boxShadow: '0 -1px 3px rgba(0,0,0,0.05)'
            }}>
              <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8 }}>
                <TextField 
                  fullWidth 
                  variant="outlined" 
                  placeholder="Escribe tu mensaje..." 
                  value={input} 
                  onChange={(e) => setInput(e.target.value)} 
                  disabled={isLoading || showFeedbackButtons || showFollowUpOptions} 
                  autoFocus 
                  onKeyPress={(e) => {if (e.key === 'Enter' && !e.shiftKey) { handleSubmit(e);}}}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      bgcolor: '#f5f5f5',
                      '&.Mui-focused': {
                        bgcolor: 'white',
                        '& fieldset': { borderColor: BRAND_ACCENT }
                      }
                    }
                  }}
                />
                <IconButton 
                  color="primary" 
                  type="submit" 
                  disabled={isLoading || showFeedbackButtons || showFollowUpOptions || !input.trim()} 
                  sx={{ 
                    bgcolor: BRAND_PRIMARY, 
                    color: 'white',
                    width: 48, height: 48,
                    borderRadius: 3,
                    '&:hover': { bgcolor: BRAND_SECONDARY },
                    '&.Mui-disabled': { bgcolor: '#e0e0e0', color: '#999' }
                  }}
                >
                  <SendIcon />
                </IconButton>
              </form>
            </Box>
          </>
        ) : (
          /* Tickets Tab */
          <Box sx={{ flex: 1, overflowY: 'auto', p: 3, bgcolor: '#f8f9fa' }}>
            {ticketsLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                <CircularProgress sx={{ color: BRAND_ACCENT }} />
              </Box>
            ) : tickets.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <ConfirmationNumberIcon sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">No hay tickets registrados</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Los tickets se crean cuando no se puede resolver un problema en el chat.
                </Typography>
              </Box>
            ) : (
              <Stack spacing={2}>
                {tickets.map((ticket) => (
                  <Paper key={ticket.id} elevation={0} sx={{ 
                    p: 2.5, 
                    borderRadius: 3, 
                    border: '1px solid #e0e0e0',
                    bgcolor: 'white',
                    transition: 'box-shadow 0.2s',
                    '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }
                  }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: BRAND_PRIMARY }}>
                        🎫 Ticket #{ticket.id}
                      </Typography>
                      <Chip 
                        label={ticket.status} 
                        size="small"
                        sx={{ 
                          bgcolor: ticket.status === 'Abierto' ? '#fff3e0' : '#e8f5e9',
                          color: ticket.status === 'Abierto' ? '#e65100' : '#2e7d32',
                          fontWeight: 600
                        }} 
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {ticket.description}
                    </Typography>
                  </Paper>
                ))}
              </Stack>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
}