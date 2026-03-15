import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Star, MessageSquare, Calendar } from 'lucide-react';
import Header from '../components/Header';
import reviewService from '../services/reviewService';
import type { ReviewResponse } from '../services/reviewService';

const ProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<ReviewResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetchUserReviews(parseInt(id));
    }
  }, [id]);

  const fetchUserReviews = async (userId: number) => {
    try {
      const data = await reviewService.getUserReviews(userId);
      setReviews(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length).toFixed(1)
    : 'N/A';

  if (loading) return <div className="flex justify-center items-center h-screen">Loading Profile...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-teal-600 hover:text-teal-700 font-semibold mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          Back
        </button>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="bg-teal-600 h-32 relative">
            <div className="absolute -bottom-12 left-8 border-4 border-white rounded-2xl bg-white shadow-lg p-4">
              <User className="w-16 h-16 text-teal-600" />
            </div>
          </div>
          
          <div className="pt-16 pb-8 px-8 flex flex-col md:flex-row md:justify-between md:items-end gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                {reviews.length > 0 ? reviews[0].revieweeUsername : 'User Profile'}
              </h1>
              <p className="text-gray-500 mt-1 flex items-center">
                Member since {reviews.length > 0 ? new Date(reviews[0].createdAt).getFullYear() : '2026'}
              </p>
            </div>

            <div className="flex space-x-4">
              <div className="bg-teal-50 border border-teal-100 rounded-xl px-6 py-3 text-center">
                <p className="text-teal-600 text-xs font-bold uppercase tracking-wider mb-1">Reviews</p>
                <div className="flex items-center justify-center font-bold text-2xl text-teal-800">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  {reviews.length}
                </div>
              </div>
              <div className="bg-yellow-50 border border-yellow-100 rounded-xl px-6 py-3 text-center">
                <p className="text-yellow-600 text-xs font-bold uppercase tracking-wider mb-1">Avg Rating</p>
                <div className="flex items-center justify-center font-bold text-2xl text-yellow-800">
                  <Star className="w-5 h-5 mr-2 fill-yellow-400 text-yellow-400" />
                  {averageRating}
                </div>
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <Star className="w-6 h-6 mr-2 text-yellow-500 fill-yellow-500" />
          What people are saying
        </h2>

        {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6">{error}</div>}

        <div className="space-y-6">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 transition-all hover:shadow-md">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                      <User className="w-5 h-5 text-gray-500" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">{review.reviewerUsername}</p>
                      <p className="text-xs text-gray-500 flex items-center mt-0.5">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-lg">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star 
                        key={s} 
                        className={`w-3.5 h-3.5 ${s <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                </div>
                
                <p className="text-gray-700 leading-relaxed italic border-l-4 border-teal-500 pl-4 py-1">
                  "{review.comment}"
                </p>
                
                <div className="mt-4 pt-4 border-t border-gray-50 flex items-center text-xs text-gray-400 italic">
                  <span>Regarding: </span>
                  <span className="font-semibold text-teal-600 ml-1 hover:underline cursor-pointer">
                    {review.itemName}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-dashed border-gray-300">
              <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No reviews yet for this user.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
