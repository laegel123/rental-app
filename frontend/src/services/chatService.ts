import axios from 'axios';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

const API_URL = '/api/chat';

export interface ChatMessageDto {
  id?: number;
  rentalId: number;
  senderId: number;
  senderUsername?: string;
  message: string;
  createdAt?: string;
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    Authorization: `Bearer ${token}`
  };
};

export const chatService = {
  getChatHistory: async (rentalId: number): Promise<ChatMessageDto[]> => {
    const response = await axios.get(`${API_URL}/${rentalId}/messages`, { headers: getAuthHeaders() });
    return response.data;
  },

  createStompClient: () => {
    // In a production environment, the URL might need to be absolute
    const socket = new SockJS('/ws');
    return Stomp.over(socket);
  }
};

export default chatService;
