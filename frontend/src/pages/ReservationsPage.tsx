import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Button from '../components/Button';
import ReviewModal from '../components/ReviewModal';
import rentalService, { RENTAL_STATUS } from '../services/rentalService';
import type { RentalResponse, RentalStatus } from '../services/rentalService';
import { Calendar, Package, RefreshCw, CheckCircle, XCircle, Info, MessageCircle, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ReservationsPage = () => {
  const [myRequests, setMyRequests] = useState<RentalResponse[]>([]);
  const [myItemsRequests, setMyItemsRequests] = useState<RentalResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'requests' | 'items'>('requests');
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedRentalForReview, setSelectedRentalForReview] = useState<RentalResponse | null>(null);
  const [reviewRole, setReviewRole] = useState<'borrower' | 'owner'>('borrower');
  const navigate = useNavigate();

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const [requests, items] = await Promise.all([
        rentalService.getMyRequests(),
        rentalService.getMyItems()
      ]);
      setMyRequests(requests);
      setMyItemsRequests(items);
    } catch (err) {
      console.error(err);
      alert('Failed to load reservations');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenReview = (rental: RentalResponse, role: 'borrower' | 'owner') => {
    setSelectedRentalForReview(rental);
    setReviewRole(role);
    setIsReviewModalOpen(true);
  };

  const handleStatusChange = async (id: number, action: 'accept' | 'decline' | 'start' | 'return') => {
    try {
      if (action === 'accept') await rentalService.acceptRental(id);
      else if (action === 'decline') await rentalService.declineRental(id);
      else if (action === 'start') await rentalService.startRental(id);
      else if (action === 'return') await rentalService.returnRental(id);
      
      alert(`Rental successfully ${action}ed!`);
      fetchReservations();
    } catch (err) {
      console.error(err);
      alert(`Failed to ${action} rental`);
    }
  };

  const getStatusBadge = (status: RentalStatus) => {
    const badges: Record<RentalStatus, React.JSX.Element> = {
      [RENTAL_STATUS.REQUESTED]: <span className="flex items-center text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded font-semibold"><Info className="w-3 h-3 mr-1" /> Requested</span>,
      [RENTAL_STATUS.ACCEPTED]: <span className="flex items-center text-xs bg-green-100 text-green-800 px-2 py-1 rounded font-semibold"><CheckCircle className="w-3 h-3 mr-1" /> Accepted</span>,
      [RENTAL_STATUS.DECLINED]: <span className="flex items-center text-xs bg-red-100 text-red-800 px-2 py-1 rounded font-semibold"><XCircle className="w-3 h-3 mr-1" /> Declined</span>,
      [RENTAL_STATUS.IN_PROGRESS]: <span className="flex items-center text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded font-semibold"><RefreshCw className="w-3 h-3 mr-1" /> In Progress</span>,
      [RENTAL_STATUS.RETURNED]: <span className="flex items-center text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded font-semibold"><Package className="w-3 h-3 mr-1" /> Returned</span>,
      [RENTAL_STATUS.COMPLETED]: <span className="flex items-center text-xs bg-teal-100 text-teal-800 px-2 py-1 rounded font-semibold"><CheckCircle className="w-3 h-3 mr-1" /> Completed</span>,
      [RENTAL_STATUS.CANCELLED]: <span className="flex items-center text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded font-semibold"><XCircle className="w-3 h-3 mr-1" /> Cancelled</span>
    };
    return badges[status] || <span>{status}</span>;
  };

  const RentalCard = ({ rental, isOwner }: { rental: RentalResponse, isOwner: boolean }) => (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden mb-6 transition-all hover:shadow-lg">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-teal-50 rounded-lg flex items-center justify-center mr-4 shrink-0">
              <Package className="w-6 h-6 text-teal-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">{rental.itemName}</h3>
              <p className="text-gray-500 text-sm">
                {isOwner ? `Borrower: ${rental.borrowerUsername}` : `Owner: ${rental.ownerUsername}`}
              </p>
            </div>
          </div>
          {getStatusBadge(rental.status)}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2 text-teal-500" />
            <span>From: <span className="font-semibold">{rental.startDate}</span></span>
          </div>
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2 text-teal-500" />
            <span>To: <span className="font-semibold">{rental.endDate}</span></span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 justify-end pt-4 border-t border-gray-100">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center"
            onClick={() => navigate(`/chat/${rental.id}`)}
          >
            <MessageCircle className="w-4 h-4 mr-1" /> Chat
          </Button>

          {rental.status === RENTAL_STATUS.COMPLETED && (
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center border-yellow-500 text-yellow-600 hover:bg-yellow-50"
              onClick={() => handleOpenReview(rental, isOwner ? 'owner' : 'borrower')}
            >
              <Star className="w-4 h-4 mr-1" /> Write Review
            </Button>
          )}

          {isOwner && rental.status === RENTAL_STATUS.REQUESTED && (
            <>
              <Button variant="danger" size="sm" onClick={() => handleStatusChange(rental.id, 'decline')}>Decline</Button>
              <Button variant="primary" size="sm" onClick={() => handleStatusChange(rental.id, 'accept')}>Accept</Button>
            </>
          )}

          {isOwner && rental.status === RENTAL_STATUS.ACCEPTED && (
            <Button variant="primary" size="sm" onClick={() => handleStatusChange(rental.id, 'start')}>Start Rental</Button>
          )}

          {isOwner && rental.status === RENTAL_STATUS.IN_PROGRESS && (
            <Button variant="primary" size="sm" onClick={() => handleStatusChange(rental.id, 'return')}>Confirm Return</Button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">My Reservations</h1>

        <div className="flex border-b border-gray-200 mb-8">
          <button 
            className={`px-6 py-3 font-semibold text-sm transition-all border-b-2 ${
              activeTab === 'requests' 
                ? 'border-teal-500 text-teal-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('requests')}
          >
            My Requests
          </button>
          <button 
            className={`px-6 py-3 font-semibold text-sm transition-all border-b-2 ${
              activeTab === 'items' 
                ? 'border-teal-500 text-teal-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('items')}
          >
            Received Requests
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <RefreshCw className="w-8 h-8 text-teal-500 animate-spin" />
          </div>
        ) : (
          <div>
            {activeTab === 'requests' ? (
              myRequests.length > 0 ? (
                myRequests.map(rental => <RentalCard key={rental.id} rental={rental} isOwner={false} />)
              ) : (
                <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-dashed border-gray-300">
                  <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">You haven't made any rental requests yet.</p>
                </div>
              )
            ) : (
              myItemsRequests.length > 0 ? (
                myItemsRequests.map(rental => <RentalCard key={rental.id} rental={rental} isOwner={true} />)
              ) : (
                <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-dashed border-gray-300">
                  <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">You haven't received any rental requests for your items.</p>
                </div>
              )
            )}
          </div>
        )}
      </main>

      {selectedRentalForReview && (
        <ReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          itemId={selectedRentalForReview.itemId}
          itemName={selectedRentalForReview.itemName}
          revieweeId={reviewRole === 'borrower' ? selectedRentalForReview.ownerId : selectedRentalForReview.borrowerId}
          revieweeName={reviewRole === 'borrower' ? selectedRentalForReview.ownerUsername : selectedRentalForReview.borrowerUsername}
          onSuccess={() => {
            alert('Review submitted successfully!');
            fetchReservations();
          }}
        />
      )}
    </div>
  );
};

export default ReservationsPage;
