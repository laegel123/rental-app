import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { ArrowLeft, Calendar, DollarSign, User, ShieldCheck } from 'lucide-react';
import Header from '../components/Header';
import Button from '../components/Button';
import itemService from '../services/itemService';
import type { ItemResponse } from '../services/itemService';
import rentalService from '../services/rentalService';

const ItemDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<ItemResponse | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date(new Date().getTime() + 24 * 60 * 60 * 1000));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [requesting, setRequesting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchItemDetails(parseInt(id));
    }
  }, [id]);

  const fetchItemDetails = async (itemId: number) => {
    try {
      const data = await itemService.getItemById(itemId);
      setItem(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load item details');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestRental = async () => {
    if (!startDate || !endDate || !item) return;

    if (startDate >= endDate) {
      alert('End date must be after start date');
      return;
    }

    setRequesting(true);
    try {
      await rentalService.requestRental({
        itemId: item.id,
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0]
      });
      alert('Rental request submitted successfully!');
      navigate('/reservations');
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to submit rental request');
    } finally {
      setRequesting(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error || !item) return <div className="text-red-500 text-center mt-10">{error || 'Item not found'}</div>;

  const totalDays = Math.ceil((endDate!.getTime() - startDate!.getTime()) / (1000 * 60 * 60 * 24));
  const estimatedPrice = totalDays * item.price;

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-teal-600 hover:text-teal-700 font-semibold mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          Back
        </button>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
          {/* Image Section */}
          <div className="bg-gray-200">
            <img 
              src={`https://placehold.co/800x600?text=${encodeURIComponent(item.name)}`} 
              alt={item.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details Section */}
          <div className="p-8">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-3xl font-bold text-gray-800">{item.name}</h1>
              <span className="bg-teal-100 text-teal-800 text-xs font-semibold px-2.5 py-0.5 rounded uppercase">
                {item.categoryName || 'General'}
              </span>
            </div>

            <div className="flex items-center text-gray-600 mb-6">
              <User className="w-4 h-4 mr-2" />
              <span>Owner: <span className="font-semibold">{item.ownerUsername}</span></span>
            </div>

            <p className="text-gray-600 mb-8 leading-relaxed">
              {item.description}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-teal-50 p-4 rounded-xl border border-teal-100">
                <p className="text-teal-600 text-sm font-semibold mb-1">Price per day</p>
                <div className="flex items-center font-bold text-2xl text-teal-800">
                  <DollarSign className="w-5 h-5 mr-1" />
                  {item.price}
                </div>
              </div>
              <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                <p className="text-orange-600 text-sm font-semibold mb-1">Security Deposit</p>
                <div className="flex items-center font-bold text-2xl text-orange-800">
                  <DollarSign className="w-5 h-5 mr-1" />
                  {item.deposit}
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-teal-600" />
                Select Rental Dates
              </h2>

              <div className="space-y-4 mb-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <DatePicker 
                    selected={startDate} 
                    onChange={(date: Date | null) => setStartDate(date)}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    minDate={new Date()}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <DatePicker 
                    selected={endDate} 
                    onChange={(date: Date | null) => setEndDate(date)}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate || new Date()}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
              </div>

              {startDate && endDate && totalDays > 0 && (
                <div className="bg-gray-50 p-4 rounded-xl mb-6 flex justify-between items-center">
                  <span className="text-gray-600">Total for {totalDays} days</span>
                  <span className="text-xl font-bold text-gray-800">${estimatedPrice}</span>
                </div>
              )}

              <Button 
                variant="primary" 
                fullWidth 
                size="lg"
                onClick={handleRequestRental}
                disabled={requesting}
              >
                {requesting ? 'Processing...' : 'Request Rental'}
              </Button>
              
              <div className="mt-4 flex items-start text-xs text-gray-500 italic">
                <ShieldCheck className="w-4 h-4 mr-1 text-teal-500 shrink-0" />
                <span>Security deposit is fully refundable after item is returned in good condition.</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ItemDetailsPage;

