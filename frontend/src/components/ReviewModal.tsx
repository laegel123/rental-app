import React, { useState } from 'react';
import { Star, X, Send, AlertCircle } from 'lucide-react';
import Button from './Button';
import reviewService from '../services/reviewService';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemId: number;
  itemName: string;
  revieweeId: number;
  revieweeName: string;
  onSuccess: () => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ 
  isOpen, 
  onClose, 
  itemId, 
  itemName, 
  revieweeId, 
  revieweeName,
  onSuccess 
}) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await reviewService.createReview({
        itemId,
        revieweeId,
        rating,
        comment
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data || 'Failed to submit review. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all">
        <div className="bg-teal-600 px-6 py-4 flex justify-between items-center text-white">
          <h3 className="text-xl font-bold">Write a Review</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-teal-700 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="text-center">
            <p className="text-gray-500 mb-1">How was your experience with</p>
            <p className="font-bold text-gray-800 text-lg leading-tight mb-2">
              {itemName}
            </p>
            <p className="text-sm text-teal-600 bg-teal-50 inline-block px-3 py-1 rounded-full font-medium">
              Reviewing: {revieweeName}
            </p>
          </div>

          <div className="flex justify-center space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="focus:outline-none transform transition-transform hover:scale-110 active:scale-95"
              >
                <Star
                  className={`w-10 h-10 ${
                    star <= rating 
                      ? 'fill-yellow-400 text-yellow-400 drop-shadow-sm' 
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Share your thoughts
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full border-gray-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-teal-500 transition-all outline-none bg-gray-50 h-32 resize-none"
              placeholder="Tell us about the transaction..."
              required
            />
          </div>

          {error && (
            <div className="flex items-center text-red-600 bg-red-50 p-3 rounded-lg text-sm border border-red-100">
              <AlertCircle className="w-5 h-5 mr-2 shrink-0" />
              {error}
            </div>
          )}

          <div className="flex space-x-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transition-all"
              disabled={loading}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
