import axios from 'axios';

const API_URL = '/rentals';

export interface CreateRentalRequest {
  itemId: number;
  startDate: string; // ISO format (YYYY-MM-DD)
  endDate: string;   // ISO format (YYYY-MM-DD)
}

export const RENTAL_STATUS = {
  REQUESTED: 'REQUESTED',
  ACCEPTED: 'ACCEPTED',
  DECLINED: 'DECLINED',
  IN_PROGRESS: 'IN_PROGRESS',
  RETURNED: 'RETURNED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED'
} as const;

export type RentalStatus = typeof RENTAL_STATUS[keyof typeof RENTAL_STATUS];

export interface RentalResponse {
  id: number;
  itemId: number;
  itemName: string;
  borrowerId: number;
  borrowerUsername: string;
  startDate: string;
  endDate: string;
  status: RentalStatus;
  createdAt: string;
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    Authorization: `Bearer ${token}`
  };
};

const rentalService = {
  requestRental: async (request: CreateRentalRequest): Promise<RentalResponse> => {
    const response = await axios.post(API_URL, request, { headers: getAuthHeaders() });
    return response.data;
  },

  getMyRequests: async (): Promise<RentalResponse[]> => {
    const response = await axios.get(`${API_URL}/my-requests`, { headers: getAuthHeaders() });
    return response.data;
  },

  getMyItems: async (): Promise<RentalResponse[]> => {
    const response = await axios.get(`${API_URL}/my-items`, { headers: getAuthHeaders() });
    return response.data;
  },

  acceptRental: async (id: number): Promise<RentalResponse> => {
    const response = await axios.post(`${API_URL}/${id}/accept`, {}, { headers: getAuthHeaders() });
    return response.data;
  },

  declineRental: async (id: number): Promise<RentalResponse> => {
    const response = await axios.post(`${API_URL}/${id}/decline`, {}, { headers: getAuthHeaders() });
    return response.data;
  },

  startRental: async (id: number): Promise<RentalResponse> => {
    const response = await axios.post(`${API_URL}/${id}/start`, {}, { headers: getAuthHeaders() });
    return response.data;
  },

  returnRental: async (id: number): Promise<RentalResponse> => {
    const response = await axios.post(`${API_URL}/${id}/return`, {}, { headers: getAuthHeaders() });
    return response.data;
  }
};

export default rentalService;
