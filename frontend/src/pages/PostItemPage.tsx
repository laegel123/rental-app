import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Button from '../components/Button';
import itemService from '../services/itemService';
import { Package, DollarSign, FileText, PlusCircle, ShieldCheck } from 'lucide-react';

const PostItemPage = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [deposit, setDeposit] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await itemService.createItem({
        name,
        description,
        price,
        deposit,
        categoryId: 1 // Default category for now
      });
      alert('Item posted successfully!');
      navigate('/');
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to post item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8 flex justify-center items-center">
        <div className="w-full max-w-lg">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
              <PlusCircle className="w-8 h-8 mr-2 text-teal-600" />
              Post New Item
            </h1>

            {error && (
              <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg text-sm font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center">
                  <Package className="w-4 h-4 mr-2" /> Item Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                  placeholder="e.g. Electric Lawn Mower"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center">
                  <FileText className="w-4 h-4 mr-2" /> Description
                </label>
                <textarea
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition-all h-32"
                  placeholder="Tell us about your item..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center">
                    <DollarSign className="w-4 h-4 mr-2" /> Price/Day
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(parseFloat(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center">
                    <ShieldCheck className="w-4 h-4 mr-2" /> Deposit
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={deposit}
                    onChange={(e) => setDeposit(parseFloat(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full py-4 text-lg" disabled={loading}>
                {loading ? 'Posting Item...' : 'Post Item'}
              </Button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PostItemPage;
