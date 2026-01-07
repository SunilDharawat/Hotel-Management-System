import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useBookings, useCustomers, useRooms } from '@/contexts/AppContext';
import { CheckoutModal } from '@/components/booking/CheckoutModal';
import { CancellationModal } from '@/components/booking/CancellationModal';
import { ExtendStayModal } from '@/components/booking/ExtendStayModal';
import { Search, Plus, Calendar, MoreVertical, LogIn, LogOut, Clock, XCircle, CalendarPlus } from 'lucide-react';
import { format } from 'date-fns';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  checked_in: 'bg-green-100 text-green-700',
  checked_out: 'bg-gray-100 text-gray-700',
  cancelled: 'bg-red-100 text-red-700'
};

export default function Bookings() {
  const navigate = useNavigate();
  const { bookings, updateBooking } = useBookings();
  const { customers } = useCustomers();
  const { rooms, updateRoom } = useRooms();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [checkoutBooking, setCheckoutBooking] = useState(null);
  const [cancelBooking, setCancelBooking] = useState(null);
  const [extendBooking, setExtendBooking] = useState(null);

  const getCustomer = (customerId) => customers.find(c => c.id === customerId);
  const getRoom = (roomId) => rooms.find(r => r.id === roomId);

  const filteredBookings = bookings.filter(booking => {
    const customer = getCustomer(booking.customerId);
    const room = getRoom(booking.roomId);
    const matchesSearch = 
      customer?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room?.roomNumber.includes(searchQuery) ||
      booking.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCheckIn = (booking) => {
    const room = getRoom(booking.roomId);
    updateBooking({ ...booking, status: 'checked_in' });
    if (room) {
      updateRoom({ ...room, status: 'occupied' });
    }
  };

  const handleCheckOut = (booking) => {
    setCheckoutBooking(booking);
  };

  const handleCancel = (booking) => {
    setCancelBooking(booking);
  };

  const handleExtend = (booking) => {
    setExtendBooking(booking);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <MainLayout title="Bookings" subtitle="Manage reservations and check-ins">
      <div className="space-y-6 animate-fade-in">
        {/* Header Actions */}
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="relative flex-1 min-w-64 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search bookings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button className="hotel-button-gold" onClick={() => navigate('/bookings/new')}>
            <Plus className="h-4 w-4 mr-2" />
            New Booking
          </Button>
        </div>

        {/* Status Filters */}
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={statusFilter === 'all' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('all')}
            size="sm"
          >
            All
          </Button>
          {['pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled'].map(status => (
            <Button
              key={status}
              variant={statusFilter === status ? 'default' : 'outline'}
              onClick={() => setStatusFilter(status)}
              size="sm"
              className="capitalize"
            >
              {status.replace('_', ' ')}
            </Button>
          ))}
        </div>

        {/* Bookings List */}
        <div className="space-y-4">
          {filteredBookings.map(booking => {
            const customer = getCustomer(booking.customerId);
            const room = getRoom(booking.roomId);

            return (
              <Card key={booking.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-wrap gap-4 items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-lg">{customer?.name || 'Unknown Guest'}</h3>
                        <Badge className={statusColors[booking.status]}>
                          {booking.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {format(new Date(booking.checkIn), 'MMM d')} - {format(new Date(booking.checkOut), 'MMM d, yyyy')}
                        </span>
                        <span>Room {room?.roomNumber || 'N/A'}</span>
                        <span>{booking.numberOfGuests} guest(s)</span>
                      </div>
                      {booking.specialRequests && (
                        <p className="text-sm text-muted-foreground italic">"{booking.specialRequests}"</p>
                      )}
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-bold text-lg">{formatCurrency(booking.totalAmount)}</p>
                        <p className="text-sm text-muted-foreground">
                          Advance: {formatCurrency(booking.advancePayment || 0)}
                        </p>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 bg-popover">
                          {booking.status === 'confirmed' && (
                            <DropdownMenuItem onClick={() => handleCheckIn(booking)}>
                              <LogIn className="h-4 w-4 mr-2" />
                              Check In
                            </DropdownMenuItem>
                          )}
                          {booking.status === 'checked_in' && (
                            <DropdownMenuItem onClick={() => handleCheckOut(booking)}>
                              <LogOut className="h-4 w-4 mr-2" />
                              Check Out
                            </DropdownMenuItem>
                          )}
                          {['confirmed', 'checked_in'].includes(booking.status) && (
                            <DropdownMenuItem onClick={() => handleExtend(booking)}>
                              <CalendarPlus className="h-4 w-4 mr-2" />
                              Extend Stay
                            </DropdownMenuItem>
                          )}
                          {['pending', 'confirmed'].includes(booking.status) && (
                            <DropdownMenuItem 
                              onClick={() => handleCancel(booking)}
                              className="text-destructive"
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Cancel Booking
                            </DropdownMenuItem>
                          )}
                          {booking.status === 'checked_in' && (
                            <DropdownMenuItem 
                              onClick={() => handleCancel(booking)}
                              className="text-orange-600"
                            >
                              <Clock className="h-4 w-4 mr-2" />
                              Early Checkout
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {filteredBookings.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No bookings found</p>
            </div>
          )}
        </div>
      </div>

      {checkoutBooking && (
        <CheckoutModal
          isOpen={!!checkoutBooking}
          onClose={() => setCheckoutBooking(null)}
          booking={checkoutBooking}
        />
      )}

      {cancelBooking && (
        <CancellationModal
          isOpen={!!cancelBooking}
          onClose={() => setCancelBooking(null)}
          booking={cancelBooking}
        />
      )}

      {extendBooking && (
        <ExtendStayModal
          isOpen={!!extendBooking}
          onClose={() => setExtendBooking(null)}
          booking={extendBooking}
        />
      )}
    </MainLayout>
  );
}
