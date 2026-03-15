import axios from 'axios';

const API_URL = '/api/items';

export interface ItemResponse {
  id: number;
  name: string;
  description: string;
  price: number;
  deposit: number;
  ownerId: number;
  ownerUsername: string;
  categoryName?: string;
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    Authorization: `Bearer ${token}`
  };
};

export interface CreateItemRequest {
  name: string;
  description: string;
  price: number;
  deposit: number;
  categoryId: number;
}

const itemService = {
  getAllItems: async (): Promise<ItemResponse[]> => {
    const response = await axios.get(API_URL, { headers: getAuthHeaders() });
    return response.data;
  },

  getItemById: async (id: number): Promise<ItemResponse> => {
    const response = await axios.get(`${API_URL}/${id}`, { headers: getAuthHeaders() });
    return response.data;
  },

  createItem: async (request: CreateItemRequest): Promise<ItemResponse> => {
    const response = await axios.post(API_URL, request, { headers: getAuthHeaders() });
    return response.data;
  },

  updateItem: async (id: number, request: CreateItemRequest): Promise<ItemResponse> => {
    const response = await axios.put(`${API_URL}/${id}`, request, { headers: getAuthHeaders() });
    return response.data;
  },

  searchItems: async (lat: number, lon: number, radius: number): Promise<ItemResponse[]> => {
    const response = await axios.get(`${API_URL}/search`, {
      params: { lat, lon, radius },
      headers: getAuthHeaders()
    });
    return response.data;
  }
};

export default itemService;
