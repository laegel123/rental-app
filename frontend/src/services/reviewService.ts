import axios from 'axios';

const API_URL = '/api/reviews';

export interface CreateReviewRequest {
  itemId: number;
  revieweeId: number;
  rating: number;
  comment: string;
}

export interface ReviewResponse {
  id: number;
  itemId: number;
  itemName: string;
  reviewerId: number;
  reviewerUsername: string;
  revieweeId: number;
  revieweeUsername: string;
  rating: number;
  comment: string;
  createdAt: string;
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    Authorization: `Bearer ${token}`
  };
};

export const reviewService = {
  createReview: async (request: CreateReviewRequest): Promise<ReviewResponse> => {
    const response = await axios.post(API_URL, request, { headers: getAuthHeaders() });
    return response.data;
  },

  getUserReviews: async (userId: number): Promise<ReviewResponse[]> => {
    const response = await axios.get(`/api/users/${userId}/reviews`, { headers: getAuthHeaders() });
    return response.data;
  }
};

export default reviewService;
