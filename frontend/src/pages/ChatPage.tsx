import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, User, Package, Clock } from 'lucide-react';
import Header from '../components/Header';
import chatService from '../services/chatService';
import type { ChatMessageDto } from '../services/chatService';
import rentalService from '../services/rentalService';
import type { RentalResponse } from '../services/rentalService';
import { useAuth } from '../contexts/AuthContext';
import type { Client } from 'stompjs';

const ChatPage = () => {
  const { id } = useParams<{ id: string }>();
  const { userId } = useAuth();
  const navigate = useNavigate();
  const [rental, setRental] = useState<RentalResponse | null>(null);
  const [messages, setMessages] = useState<ChatMessageDto[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const stompClientRef = useRef<Client | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id) {
      const rentalId = parseInt(id);
      fetchRentalAndHistory(rentalId);
      connectWebSocket(rentalId);
    }

    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.disconnect(() => {});
      }
    };
  }, [id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchRentalAndHistory = async (rentalId: number) => {
    try {
      const [rentalData, history] = await Promise.all([
        rentalService.getRentalById(rentalId),
        chatService.getChatHistory(rentalId)
      ]);
      setRental(rentalData);
      setMessages(history);
    } catch (err) {
      console.error(err);
      alert('Failed to load chat data');
    } finally {
      setLoading(false);
    }
  };

  const connectWebSocket = (rentalId: number) => {
    const client = chatService.createStompClient();
    stompClientRef.current = client;

    client.connect({}, () => {
      client.subscribe(`/topic/rental/${rentalId}`, (message) => {
        const receivedMessage: ChatMessageDto = JSON.parse(message.body);
        setMessages((prev) => [...prev, receivedMessage]);
      });
    }, (error) => {
      console.error('STOMP error:', error);
    });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !stompClientRef.current || !rental || !userId) return;

    const messagePayload: ChatMessageDto = {
      rentalId: rental.id,
      senderId: userId,
      message: newMessage.trim()
    };

    stompClientRef.current.send(`/app/chat/${rental.id}`, {}, JSON.stringify(messagePayload));
    setNewMessage('');
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading Chat...</div>;
  if (!rental) return <div className="text-center mt-10">Rental not found</div>;

  const isBorrower = rental.borrowerId === userId;

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Header />
      
      {/* Chat Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center shadow-sm">
        <button onClick={() => navigate(-1)} className="mr-4 text-gray-500 hover:text-teal-600 transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center mr-3 text-teal-600">
          <Package className="w-5 h-5" />
        </div>
        <div>
          <h2 className="font-bold text-gray-800 leading-tight">{rental.itemName}</h2>
          <p className="text-xs text-gray-500 flex items-center mt-1">
            <User className="w-3 h-3 mr-1" />
            {isBorrower ? 'Owner' : rental.borrowerUsername}
          </p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 opacity-60">
            <Clock className="w-12 h-12 mb-2" />
            <p>Start a conversation about the rental.</p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isMe = msg.senderId === userId;
            return (
              <div key={msg.id || index} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] rounded-2xl px-4 py-2 shadow-sm ${
                  isMe ? 'bg-teal-600 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none'
                }`}>
                  {!isMe && (
                    <p className="text-[10px] font-bold mb-1 text-teal-600 uppercase tracking-wider">
                      {msg.senderUsername}
                    </p>
                  )}
                  <p className="text-sm leading-relaxed">{msg.message}</p>
                  <p className={`text-[9px] mt-1 text-right ${isMe ? 'text-teal-100' : 'text-gray-400'}`}>
                    {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-gray-100 border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all outline-none"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="bg-teal-600 text-white rounded-full p-2 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatPage;
