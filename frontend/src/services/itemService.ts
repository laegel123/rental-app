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

const itemService = {
  getAllItems: async (): Promise<ItemResponse[]> => {
    const response = await axios.get(API_URL, { headers: getAuthHeaders() });
    return response.data;
  },

  getItemById: async (id: number): Promise<ItemResponse> => {
    const response = await axios.get(`${API_URL}/${id}`, { headers: getAuthHeaders() });
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
