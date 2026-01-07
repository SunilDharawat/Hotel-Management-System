import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCustomers, useBookings, useRooms, useSettings, useAuth } from '@/contexts/AppContext';
import { toast } from 'sonner';
import { format, differenceInDays } from 'date-fns';
import { UserPlus, Calendar, CheckCircle } from 'lucide-react';

export function QuickBookingModal({ isOpen, onClose, room }) {
  const { customers, addCustomer } = useCustomers();
  const { addBooking } = useBookings();
  const { updateRoom } = useRooms();
  const { settings } = useSettings();
  const { user } = useAuth();

  const [step, setStep] = useState(1);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [isNewCustomer, setIsNewCustomer] = useState(false);

  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    idProofType: 'aadhar',
    idProofNumber: '',
    address: '',
    gender: 'male',
    nationality: 'Indian'
  });

  const [bookingDetails, setBookingDetails] = useState({
    checkIn: format(new Date(), 'yyyy-MM-dd'),
    checkOut: format(new Date(Date.now() + 86400000), 'yyyy-MM-dd'),
    numberOfGuests: 1,
    advancePayment: 0,
    paymentMethod: 'cash',
    specialRequests: ''
  });

  const nights = differenceInDays(new Date(bookingDetails.checkOut), new Date(bookingDetails.checkIn));
  const roomCharges = room.basePrice * nights;
  const cgst = roomCharges * (settings.gstRates.cgst / 100);
  const sgst = roomCharges * (settings.gstRates.sgst / 100);
  const totalAmount = roomCharges + cgst + sgst;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  const handleNext = () => {
    if (step === 1) {
      if (!isNewCustomer && !selectedCustomerId) {
        toast.error('Please select a customer');
        return;
      }
      if (isNewCustomer && (!newCustomer.name || !newCustomer.phone)) {
        toast.error('Please fill in required customer details');
        return;
      }
    }
    if (step === 2) {
      if (nights <= 0) {
        toast.error('Check-out date must be after check-in');
        return;
      }
    }
    setStep(step + 1);
  };

  const handleConfirm = () => {
    let customerId = selectedCustomerId;

    if (isNewCustomer) {
      const customer = {
        id: `cust-${Date.now()}`,
        ...newCustomer,
        createdAt: new Date(),
        totalStays: 0,
        totalSpent: 0
      };
      addCustomer(customer);
      customerId = customer.id;
    }

    const booking = {
      id: `booking-${Date.now()}`,
      customerId,
      roomId: room.id,
      checkIn: new Date(bookingDetails.checkIn),
      checkOut: new Date(bookingDetails.checkOut),
      numberOfGuests: parseInt(bookingDetails.numberOfGuests),
      status: 'confirmed',
      totalAmount,
      advancePayment: parseFloat(bookingDetails.advancePayment) || 0,
      paymentStatus: bookingDetails.advancePayment >= totalAmount ? 'paid' : bookingDetails.advancePayment > 0 ? 'partial' : 'pending',
      paymentMethod: bookingDetails.paymentMethod,
      specialRequests: bookingDetails.specialRequests,
      createdAt: new Date(),
      createdBy: user?.id
    };

    addBooking(booking);
    updateRoom({ ...room, status: 'reserved' });

    toast.success('Booking created successfully!');
    onClose();
  };

  const resetAndClose = () => {
    setStep(1);
    setSelectedCustomerId('');
    setIsNewCustomer(false);
    setNewCustomer({
      name: '',
      email: '',
      phone: '',
      idProofType: 'aadhar',
      idProofNumber: '',
      address: '',
      gender: 'male',
      nationality: 'Indian'
    });
    setBookingDetails({
      checkIn: format(new Date(), 'yyyy-MM-dd'),
      checkOut: format(new Date(Date.now() + 86400000), 'yyyy-MM-dd'),
      numberOfGuests: 1,
      advancePayment: 0,
      paymentMethod: 'cash',
      specialRequests: ''
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={resetAndClose}>
      <DialogContent className="max-w-lg bg-background">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {step === 1 && <><UserPlus className="h-5 w-5" />Select Guest</>}
            {step === 2 && <><Calendar className="h-5 w-5" />Booking Details</>}
            {step === 3 && <><CheckCircle className="h-5 w-5" />Confirm Booking</>}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Step 1: Customer Selection */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={!isNewCustomer ? 'default' : 'outline'}
                  onClick={() => setIsNewCustomer(false)}
                  className="flex-1"
                >
                  Existing Guest
                </Button>
                <Button
                  type="button"
                  variant={isNewCustomer ? 'default' : 'outline'}
                  onClick={() => setIsNewCustomer(true)}
                  className="flex-1"
                >
                  New Guest
                </Button>
              </div>

              {!isNewCustomer ? (
                <div>
                  <Label>Select Guest</Label>
                  <Select value={selectedCustomerId} onValueChange={setSelectedCustomerId}>
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
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label>Full Name *</Label>
                    <Input
                      value={newCustomer.name}
                      onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                      placeholder="Enter full name"
                    />
                  </div>
                  <div>
                    <Label>Phone *</Label>
                    <Input
                      value={newCustomer.phone}
                      onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={newCustomer.email}
                      onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                      placeholder="email@example.com"
                    />
                  </div>
                  <div>
                    <Label>ID Type</Label>
                    <Select
                      value={newCustomer.idProofType}
                      onValueChange={(value) => setNewCustomer({ ...newCustomer, idProofType: value })}
                    >
                      <SelectTrigger className="bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover">
                        <SelectItem value="aadhar">Aadhar Card</SelectItem>
                        <SelectItem value="passport">Passport</SelectItem>
                        <SelectItem value="driving_license">Driving License</SelectItem>
                        <SelectItem value="voter_id">Voter ID</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>ID Number</Label>
                    <Input
                      value={newCustomer.idProofNumber}
                      onChange={(e) => setNewCustomer({ ...newCustomer, idProofNumber: e.target.value })}
                      placeholder="ID number"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Booking Details */}
          {step === 2 && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Check-in</Label>
                <Input
                  type="date"
                  value={bookingDetails.checkIn}
                  onChange={(e) => setBookingDetails({ ...bookingDetails, checkIn: e.target.value })}
                />
              </div>
              <div>
                <Label>Check-out</Label>
                <Input
                  type="date"
                  value={bookingDetails.checkOut}
                  onChange={(e) => setBookingDetails({ ...bookingDetails, checkOut: e.target.value })}
                />
              </div>
              <div>
                <Label>Guests</Label>
                <Input
                  type="number"
                  min="1"
                  max={room.maxOccupancy}
                  value={bookingDetails.numberOfGuests}
                  onChange={(e) => setBookingDetails({ ...bookingDetails, numberOfGuests: e.target.value })}
                />
              </div>
              <div>
                <Label>Payment Method</Label>
                <Select
                  value={bookingDetails.paymentMethod}
                  onValueChange={(value) => setBookingDetails({ ...bookingDetails, paymentMethod: value })}
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
                  value={bookingDetails.advancePayment}
                  onChange={(e) => setBookingDetails({ ...bookingDetails, advancePayment: e.target.value })}
                />
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-muted">
                <h4 className="font-semibold mb-2">Room {room.roomNumber}</h4>
                <p className="text-sm text-muted-foreground capitalize">{room.type} Room</p>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Check-in</span>
                  <span>{format(new Date(bookingDetails.checkIn), 'MMM d, yyyy')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Check-out</span>
                  <span>{format(new Date(bookingDetails.checkOut), 'MMM d, yyyy')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Nights</span>
                  <span>{nights}</span>
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
                <div className="border-t pt-2 flex justify-between font-bold">
                  <span>Total Amount</span>
                  <span>{formatCurrency(totalAmount)}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Advance Payment</span>
                  <span>- {formatCurrency(bookingDetails.advancePayment)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Balance Due</span>
                  <span>{formatCurrency(totalAmount - bookingDetails.advancePayment)}</span>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            {step > 1 && (
              <Button variant="outline" onClick={() => setStep(step - 1)} className="flex-1">
                Back
              </Button>
            )}
            {step < 3 ? (
              <Button onClick={handleNext} className="flex-1 hotel-button-gold">
                Next
              </Button>
            ) : (
              <Button onClick={handleConfirm} className="flex-1 hotel-button-gold">
                Confirm Booking
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
