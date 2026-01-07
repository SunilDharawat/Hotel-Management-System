import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCustomers, useRooms, useBookings, useSettings, useAuth } from '@/contexts/AppContext';
import { toast } from 'sonner';
import { format, differenceInDays } from 'date-fns';

export default function NewBooking() {
  const navigate = useNavigate();
  const { customers } = useCustomers();
  const { rooms, updateRoom } = useRooms();
  const { addBooking } = useBookings();
  const { settings } = useSettings();
  const { user } = useAuth();

  const availableRooms = rooms.filter(r => r.status === 'available');

  const [formData, setFormData] = useState({
    customerId: '',
    roomId: '',
    checkIn: format(new Date(), 'yyyy-MM-dd'),
    checkOut: format(new Date(Date.now() + 86400000), 'yyyy-MM-dd'),
    numberOfGuests: 1,
    advancePayment: 0,
    paymentMethod: 'cash',
    specialRequests: ''
  });

  const selectedRoom = rooms.find(r => r.id === formData.roomId);
  const nights = differenceInDays(new Date(formData.checkOut), new Date(formData.checkIn));
  const roomCharges = selectedRoom ? selectedRoom.basePrice * nights : 0;
  const cgst = roomCharges * (settings.gstRates.cgst / 100);
  const sgst = roomCharges * (settings.gstRates.sgst / 100);
  const totalAmount = roomCharges + cgst + sgst;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.customerId || !formData.roomId) {
      toast.error('Please select a customer and room');
      return;
    }

    if (nights <= 0) {
      toast.error('Check-out date must be after check-in date');
      return;
    }

    const booking = {
      id: `booking-${Date.now()}`,
      ...formData,
      numberOfGuests: parseInt(formData.numberOfGuests),
      advancePayment: parseFloat(formData.advancePayment) || 0,
      checkIn: new Date(formData.checkIn),
      checkOut: new Date(formData.checkOut),
      status: 'confirmed',
      totalAmount,
      paymentStatus: formData.advancePayment >= totalAmount ? 'paid' : formData.advancePayment > 0 ? 'partial' : 'pending',
      createdAt: new Date(),
      createdBy: user?.id
    };

    addBooking(booking);
    
    if (selectedRoom) {
      updateRoom({ ...selectedRoom, status: 'reserved' });
    }

    toast.success('Booking created successfully!');
    navigate('/bookings');
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <MainLayout title="New Booking" subtitle="Create a new room reservation">
      <div className="max-w-4xl mx-auto animate-fade-in">
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Booking Details */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Guest & Room Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <Label>Select Guest</Label>
                      <Select
                        value={formData.customerId}
                        onValueChange={(value) => setFormData({ ...formData, customerId: value })}
                      >
                        <SelectTrigger className="bg-background">
                          <SelectValue placeholder="Choose a guest" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover">
                          {customers.map(customer => (
                            <SelectItem key={customer.id} value={customer.id}>
                              {customer.name} - {customer.phone}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="col-span-2">
                      <Label>Select Room</Label>
                      <Select
                        value={formData.roomId}
                        onValueChange={(value) => setFormData({ ...formData, roomId: value })}
                      >
                        <SelectTrigger className="bg-background">
                          <SelectValue placeholder="Choose a room" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover">
                          {availableRooms.map(room => (
                            <SelectItem key={room.id} value={room.id}>
                              Room {room.roomNumber} - {room.type} ({formatCurrency(room.basePrice)}/night)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Check-in Date</Label>
                      <Input
                        type="date"
                        value={formData.checkIn}
                        onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label>Check-out Date</Label>
                      <Input
                        type="date"
                        value={formData.checkOut}
                        onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label>Number of Guests</Label>
                      <Input
                        type="number"
                        min="1"
                        max={selectedRoom?.maxOccupancy || 4}
                        value={formData.numberOfGuests}
                        onChange={(e) => setFormData({ ...formData, numberOfGuests: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label>Payment Method</Label>
                      <Select
                        value={formData.paymentMethod}
                        onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}
                      >
                        <SelectTrigger className="bg-background">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-popover">
                          <SelectItem value="cash">Cash</SelectItem>
                          <SelectItem value="card">Card</SelectItem>
                          <SelectItem value="online">Online</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="col-span-2">
                      <Label>Advance Payment</Label>
                      <Input
                        type="number"
                        min="0"
                        value={formData.advancePayment}
                        onChange={(e) => setFormData({ ...formData, advancePayment: e.target.value })}
                      />
                    </div>

                    <div className="col-span-2">
                      <Label>Special Requests</Label>
                      <Textarea
                        value={formData.specialRequests}
                        onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                        placeholder="Any special requests or notes..."
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Price Summary */}
            <div>
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Price Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedRoom && (
                    <>
                      <div className="p-4 rounded-lg bg-muted">
                        <p className="font-semibold">Room {selectedRoom.roomNumber}</p>
                        <p className="text-sm text-muted-foreground capitalize">{selectedRoom.type}</p>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Room Rate</span>
                          <span>{formatCurrency(selectedRoom.basePrice)}/night</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Nights</span>
                          <span>{nights > 0 ? nights : 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Room Charges</span>
                          <span>{formatCurrency(roomCharges)}</span>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                          <span>CGST ({settings.gstRates.cgst}%)</span>
                          <span>{formatCurrency(cgst)}</span>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                          <span>SGST ({settings.gstRates.sgst}%)</span>
                          <span>{formatCurrency(sgst)}</span>
                        </div>
                        <div className="border-t pt-2 flex justify-between font-bold text-lg">
                          <span>Total</span>
                          <span>{formatCurrency(totalAmount)}</span>
                        </div>
                      </div>
                    </>
                  )}

                  <div className="flex gap-2 pt-4">
                    <Button type="button" variant="outline" className="flex-1" onClick={() => navigate('/bookings')}>
                      Cancel
                    </Button>
                    <Button type="submit" className="flex-1 hotel-button-gold">
                      Confirm Booking
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}
