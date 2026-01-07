// Sample Users
export const sampleUsers = [
  {
    id: 'user-1',
    username: 'admin',
    password: 'admin123',
    name: 'John Administrator',
    role: 'admin',
    email: 'admin@grandhotel.com',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'user-2',
    username: 'manager',
    password: 'manager123',
    name: 'Sarah Manager',
    role: 'manager',
    email: 'manager@grandhotel.com',
    isActive: true,
    createdAt: '2024-01-15T00:00:00Z'
  },
  {
    id: 'user-3',
    username: 'receptionist',
    password: 'recep123',
    name: 'Mike Receptionist',
    role: 'receptionist',
    email: 'reception@grandhotel.com',
    isActive: true,
    createdAt: '2024-02-01T00:00:00Z'
  }
];

// Sample Customers
export const sampleCustomers = [
  { id: 'cust-1', fullName: 'Rahul Sharma', contactNumber: '+91 9876543210', email: 'rahul.sharma@email.com', idProofType: 'aadhar', idProofNumber: '1234 5678 9012', address: '123 MG Road, Mumbai, Maharashtra 400001', dateOfBirth: '1985-05-15', gender: 'male', createdAt: '2024-06-01T10:00:00Z', preferences: { roomType: 'deluxe', floorPreference: 3, specialRequests: 'Extra pillows' } },
  { id: 'cust-2', fullName: 'Priya Patel', contactNumber: '+91 9876543211', email: 'priya.patel@email.com', idProofType: 'passport', idProofNumber: 'J1234567', address: '456 Park Street, Kolkata, West Bengal 700016', dateOfBirth: '1990-08-22', gender: 'female', createdAt: '2024-06-05T14:30:00Z', preferences: { roomType: 'suite', floorPreference: 2 } },
  { id: 'cust-3', fullName: 'Amit Kumar', contactNumber: '+91 9876543212', email: 'amit.kumar@email.com', idProofType: 'pan', idProofNumber: 'ABCDE1234F', address: '789 Anna Salai, Chennai, Tamil Nadu 600002', dateOfBirth: '1982-12-10', gender: 'male', createdAt: '2024-06-10T09:15:00Z' },
  { id: 'cust-4', fullName: 'Sneha Reddy', contactNumber: '+91 9876543213', email: 'sneha.reddy@email.com', idProofType: 'driving_license', idProofNumber: 'DL-1234567890', address: '321 Jubilee Hills, Hyderabad, Telangana 500033', dateOfBirth: '1995-03-28', gender: 'female', createdAt: '2024-06-15T16:45:00Z' },
  { id: 'cust-5', fullName: 'Vikram Singh', contactNumber: '+91 9876543214', email: 'vikram.singh@email.com', idProofType: 'aadhar', idProofNumber: '9876 5432 1098', address: '555 Civil Lines, Delhi 110054', dateOfBirth: '1978-07-04', gender: 'male', createdAt: '2024-06-20T11:00:00Z', preferences: { roomType: 'suite', specialRequests: 'Late checkout preferred' } },
  { id: 'cust-6', fullName: 'Anita Desai', contactNumber: '+91 9876543215', email: 'anita.desai@email.com', idProofType: 'passport', idProofNumber: 'K9876543', address: '888 Koregaon Park, Pune, Maharashtra 411001', dateOfBirth: '1988-11-18', gender: 'female', createdAt: '2024-07-01T08:30:00Z' },
  { id: 'cust-7', fullName: 'Rajesh Gupta', contactNumber: '+91 9876543216', email: 'rajesh.gupta@email.com', idProofType: 'pan', idProofNumber: 'FGHIJ5678K', address: '222 Ashram Road, Ahmedabad, Gujarat 380009', dateOfBirth: '1975-01-25', gender: 'male', createdAt: '2024-07-05T13:20:00Z' },
  { id: 'cust-8', fullName: 'Kavita Menon', contactNumber: '+91 9876543217', email: 'kavita.menon@email.com', idProofType: 'aadhar', idProofNumber: '5555 6666 7777', address: '999 MG Road, Bangalore, Karnataka 560001', dateOfBirth: '1992-09-12', gender: 'female', createdAt: '2024-07-10T15:45:00Z' },
  { id: 'cust-9', fullName: 'Suresh Iyer', contactNumber: '+91 9876543218', email: 'suresh.iyer@email.com', idProofType: 'driving_license', idProofNumber: 'KA-9876543210', address: '111 Brigade Road, Bangalore, Karnataka 560025', dateOfBirth: '1980-04-30', gender: 'male', createdAt: '2024-07-15T10:10:00Z' },
  { id: 'cust-10', fullName: 'Meera Nair', contactNumber: '+91 9876543219', email: 'meera.nair@email.com', idProofType: 'passport', idProofNumber: 'L1122334', address: '777 Marine Drive, Kochi, Kerala 682001', dateOfBirth: '1987-06-08', gender: 'female', createdAt: '2024-08-01T09:00:00Z', preferences: { roomType: 'deluxe', floorPreference: 1 } },
  { id: 'cust-11', fullName: 'Arjun Kapoor', contactNumber: '+91 9876543220', email: 'arjun.kapoor@email.com', idProofType: 'aadhar', idProofNumber: '1111 2222 3333', address: '444 Linking Road, Mumbai, Maharashtra 400050', dateOfBirth: '1993-02-14', gender: 'male', createdAt: '2024-08-10T12:30:00Z' },
  { id: 'cust-12', fullName: 'Divya Krishnan', contactNumber: '+91 9876543221', email: 'divya.k@email.com', idProofType: 'pan', idProofNumber: 'KLMNO9012P', address: '666 TTK Road, Chennai, Tamil Nadu 600018', dateOfBirth: '1991-10-05', gender: 'female', createdAt: '2024-08-15T14:15:00Z' },
  { id: 'cust-13', fullName: 'Nikhil Joshi', contactNumber: '+91 9876543222', email: 'nikhil.joshi@email.com', idProofType: 'driving_license', idProofNumber: 'MH-1234567890', address: '333 FC Road, Pune, Maharashtra 411005', dateOfBirth: '1986-08-20', gender: 'male', createdAt: '2024-09-01T11:45:00Z' },
  { id: 'cust-14', fullName: 'Pooja Agarwal', contactNumber: '+91 9876543223', email: 'pooja.agarwal@email.com', idProofType: 'aadhar', idProofNumber: '4444 5555 6666', address: '888 Hazratganj, Lucknow, UP 226001', dateOfBirth: '1994-12-25', gender: 'female', createdAt: '2024-09-10T16:00:00Z' },
  { id: 'cust-15', fullName: 'Sanjay Verma', contactNumber: '+91 9876543224', email: 'sanjay.verma@email.com', idProofType: 'passport', idProofNumber: 'M5566778', address: '555 Connaught Place, Delhi 110001', dateOfBirth: '1979-03-15', gender: 'male', createdAt: '2024-09-15T08:20:00Z', preferences: { roomType: 'suite', specialRequests: 'Airport pickup required' } }
];

// Sample Rooms (25 rooms across 3 floors)
export const sampleRooms = [
  { id: 'room-101', roomNumber: '101', type: 'single', floor: 1, basePrice: 2500, maxOccupancy: 1, size: 250, viewType: 'garden_view', status: 'available', amenities: ['AC', 'TV', 'Wi-Fi', 'Mini-bar'], housekeepingStatus: 'clean', maintenanceHistory: [] },
  { id: 'room-102', roomNumber: '102', type: 'single', floor: 1, basePrice: 2500, maxOccupancy: 1, size: 250, viewType: 'garden_view', status: 'occupied', amenities: ['AC', 'TV', 'Wi-Fi', 'Mini-bar'], housekeepingStatus: 'clean', maintenanceHistory: [] },
  { id: 'room-103', roomNumber: '103', type: 'double', floor: 1, basePrice: 4000, maxOccupancy: 2, size: 350, viewType: 'pool_view', status: 'available', amenities: ['AC', 'TV', 'Wi-Fi', 'Mini-bar', 'Safe'], housekeepingStatus: 'clean', maintenanceHistory: [] },
  { id: 'room-104', roomNumber: '104', type: 'double', floor: 1, basePrice: 4000, maxOccupancy: 2, size: 350, viewType: 'pool_view', status: 'reserved', amenities: ['AC', 'TV', 'Wi-Fi', 'Mini-bar', 'Safe'], housekeepingStatus: 'clean', maintenanceHistory: [] },
  { id: 'room-105', roomNumber: '105', type: 'double', floor: 1, basePrice: 4000, maxOccupancy: 2, size: 350, viewType: 'garden_view', status: 'available', amenities: ['AC', 'TV', 'Wi-Fi', 'Mini-bar', 'Safe'], housekeepingStatus: 'clean', maintenanceHistory: [] },
  { id: 'room-106', roomNumber: '106', type: 'deluxe', floor: 1, basePrice: 6000, maxOccupancy: 3, size: 450, viewType: 'pool_view', status: 'occupied', amenities: ['AC', 'TV', 'Wi-Fi', 'Mini-bar', 'Safe', 'Jacuzzi'], housekeepingStatus: 'clean', maintenanceHistory: [] },
  { id: 'room-107', roomNumber: '107', type: 'deluxe', floor: 1, basePrice: 6000, maxOccupancy: 3, size: 450, viewType: 'garden_view', status: 'cleaning', amenities: ['AC', 'TV', 'Wi-Fi', 'Mini-bar', 'Safe', 'Jacuzzi'], housekeepingStatus: 'in_progress', maintenanceHistory: [] },
  { id: 'room-108', roomNumber: '108', type: 'suite', floor: 1, basePrice: 10000, maxOccupancy: 4, size: 600, viewType: 'pool_view', status: 'available', amenities: ['AC', 'TV', 'Wi-Fi', 'Mini-bar', 'Safe', 'Jacuzzi', 'Kitchen'], housekeepingStatus: 'clean', maintenanceHistory: [] },
  { id: 'room-201', roomNumber: '201', type: 'single', floor: 2, basePrice: 2800, maxOccupancy: 1, size: 280, viewType: 'city_view', status: 'available', amenities: ['AC', 'TV', 'Wi-Fi', 'Mini-bar'], housekeepingStatus: 'clean', maintenanceHistory: [] },
  { id: 'room-202', roomNumber: '202', type: 'single', floor: 2, basePrice: 2800, maxOccupancy: 1, size: 280, viewType: 'city_view', status: 'occupied', amenities: ['AC', 'TV', 'Wi-Fi', 'Mini-bar'], housekeepingStatus: 'clean', maintenanceHistory: [] },
  { id: 'room-203', roomNumber: '203', type: 'double', floor: 2, basePrice: 4500, maxOccupancy: 2, size: 380, viewType: 'sea_view', status: 'available', amenities: ['AC', 'TV', 'Wi-Fi', 'Mini-bar', 'Safe', 'Balcony'], housekeepingStatus: 'clean', maintenanceHistory: [] },
  { id: 'room-204', roomNumber: '204', type: 'double', floor: 2, basePrice: 4500, maxOccupancy: 2, size: 380, viewType: 'sea_view', status: 'maintenance', amenities: ['AC', 'TV', 'Wi-Fi', 'Mini-bar', 'Safe', 'Balcony'], housekeepingStatus: 'dirty', maintenanceHistory: [{ id: 'maint-1', roomId: 'room-204', description: 'AC repair required', startDate: '2024-12-26T10:00:00Z', status: 'in_progress', assignedTo: 'Technical Team' }] },
  { id: 'room-205', roomNumber: '205', type: 'double', floor: 2, basePrice: 4500, maxOccupancy: 2, size: 380, viewType: 'city_view', status: 'occupied', amenities: ['AC', 'TV', 'Wi-Fi', 'Mini-bar', 'Safe', 'Balcony'], housekeepingStatus: 'clean', maintenanceHistory: [] },
  { id: 'room-206', roomNumber: '206', type: 'deluxe', floor: 2, basePrice: 7000, maxOccupancy: 3, size: 500, viewType: 'sea_view', status: 'available', amenities: ['AC', 'TV', 'Wi-Fi', 'Mini-bar', 'Safe', 'Jacuzzi', 'Balcony'], housekeepingStatus: 'clean', maintenanceHistory: [] },
  { id: 'room-207', roomNumber: '207', type: 'deluxe', floor: 2, basePrice: 7000, maxOccupancy: 3, size: 500, viewType: 'sea_view', status: 'reserved', amenities: ['AC', 'TV', 'Wi-Fi', 'Mini-bar', 'Safe', 'Jacuzzi', 'Balcony'], housekeepingStatus: 'clean', maintenanceHistory: [] },
  { id: 'room-208', roomNumber: '208', type: 'suite', floor: 2, basePrice: 12000, maxOccupancy: 4, size: 700, viewType: 'sea_view', status: 'occupied', amenities: ['AC', 'TV', 'Wi-Fi', 'Mini-bar', 'Safe', 'Jacuzzi', 'Kitchen', 'Balcony'], housekeepingStatus: 'clean', maintenanceHistory: [] },
  { id: 'room-301', roomNumber: '301', type: 'double', floor: 3, basePrice: 5000, maxOccupancy: 2, size: 400, viewType: 'mountain_view', status: 'available', amenities: ['AC', 'TV', 'Wi-Fi', 'Mini-bar', 'Safe', 'Balcony'], housekeepingStatus: 'clean', maintenanceHistory: [] },
  { id: 'room-302', roomNumber: '302', type: 'double', floor: 3, basePrice: 5000, maxOccupancy: 2, size: 400, viewType: 'mountain_view', status: 'available', amenities: ['AC', 'TV', 'Wi-Fi', 'Mini-bar', 'Safe', 'Balcony'], housekeepingStatus: 'clean', maintenanceHistory: [] },
  { id: 'room-303', roomNumber: '303', type: 'deluxe', floor: 3, basePrice: 8000, maxOccupancy: 3, size: 550, viewType: 'mountain_view', status: 'occupied', amenities: ['AC', 'TV', 'Wi-Fi', 'Mini-bar', 'Safe', 'Jacuzzi', 'Balcony'], housekeepingStatus: 'clean', maintenanceHistory: [] },
  { id: 'room-304', roomNumber: '304', type: 'deluxe', floor: 3, basePrice: 8000, maxOccupancy: 3, size: 550, viewType: 'sea_view', status: 'maintenance', amenities: ['AC', 'TV', 'Wi-Fi', 'Mini-bar', 'Safe', 'Jacuzzi', 'Balcony'], housekeepingStatus: 'dirty', maintenanceHistory: [{ id: 'maint-2', roomId: 'room-304', description: 'Bathroom plumbing issue', startDate: '2024-12-27T08:00:00Z', status: 'pending', assignedTo: 'Plumbing Team' }] },
  { id: 'room-305', roomNumber: '305', type: 'deluxe', floor: 3, basePrice: 8000, maxOccupancy: 3, size: 550, viewType: 'sea_view', status: 'available', amenities: ['AC', 'TV', 'Wi-Fi', 'Mini-bar', 'Safe', 'Jacuzzi', 'Balcony'], housekeepingStatus: 'clean', maintenanceHistory: [] },
  { id: 'room-306', roomNumber: '306', type: 'suite', floor: 3, basePrice: 15000, maxOccupancy: 4, size: 800, viewType: 'sea_view', status: 'reserved', amenities: ['AC', 'TV', 'Wi-Fi', 'Mini-bar', 'Safe', 'Jacuzzi', 'Kitchen', 'Balcony', 'Private Pool'], housekeepingStatus: 'clean', maintenanceHistory: [] },
  { id: 'room-307', roomNumber: '307', type: 'suite', floor: 3, basePrice: 15000, maxOccupancy: 4, size: 800, viewType: 'mountain_view', status: 'available', amenities: ['AC', 'TV', 'Wi-Fi', 'Mini-bar', 'Safe', 'Jacuzzi', 'Kitchen', 'Balcony', 'Private Pool'], housekeepingStatus: 'clean', maintenanceHistory: [] },
  { id: 'room-308', roomNumber: '308', type: 'suite', floor: 3, basePrice: 20000, maxOccupancy: 6, size: 1000, viewType: 'sea_view', status: 'occupied', amenities: ['AC', 'TV', 'Wi-Fi', 'Mini-bar', 'Safe', 'Jacuzzi', 'Kitchen', 'Balcony', 'Private Pool', 'Butler Service'], housekeepingStatus: 'clean', maintenanceHistory: [] },
  { id: 'room-309', roomNumber: '309', type: 'suite', floor: 3, basePrice: 25000, maxOccupancy: 6, size: 1200, viewType: 'sea_view', status: 'cleaning', amenities: ['AC', 'TV', 'Wi-Fi', 'Mini-bar', 'Safe', 'Jacuzzi', 'Kitchen', 'Balcony', 'Private Pool', 'Butler Service', 'Home Theater'], housekeepingStatus: 'in_progress', maintenanceHistory: [] },
];

// Generate dates relative to today
const today = new Date();
const formatDate = (date) => date.toISOString();
const addDays = (date, days) => new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
const subDays = (date, days) => new Date(date.getTime() - days * 24 * 60 * 60 * 1000);

// Sample Bookings
export const sampleBookings = [
  { id: 'book-1', customerId: 'cust-1', roomId: 'room-102', checkInDate: formatDate(subDays(today, 2)), checkOutDate: formatDate(addDays(today, 1)), numberOfGuests: 1, advancePayment: 2500, totalAmount: 7500, status: 'checked_in', createdAt: formatDate(subDays(today, 5)), actualCheckIn: formatDate(subDays(today, 2)) },
  { id: 'book-2', customerId: 'cust-2', roomId: 'room-106', checkInDate: formatDate(subDays(today, 1)), checkOutDate: formatDate(addDays(today, 2)), numberOfGuests: 2, specialRequests: 'Sea facing room preferred', advancePayment: 6000, totalAmount: 18000, status: 'checked_in', createdAt: formatDate(subDays(today, 7)), actualCheckIn: formatDate(subDays(today, 1)) },
  { id: 'book-3', customerId: 'cust-5', roomId: 'room-208', checkInDate: formatDate(subDays(today, 3)), checkOutDate: formatDate(addDays(today, 0)), numberOfGuests: 3, advancePayment: 12000, totalAmount: 36000, status: 'checked_in', createdAt: formatDate(subDays(today, 10)), actualCheckIn: formatDate(subDays(today, 3)) },
  { id: 'book-4', customerId: 'cust-8', roomId: 'room-202', checkInDate: formatDate(subDays(today, 1)), checkOutDate: formatDate(addDays(today, 3)), numberOfGuests: 1, advancePayment: 2800, totalAmount: 11200, status: 'checked_in', createdAt: formatDate(subDays(today, 3)), actualCheckIn: formatDate(subDays(today, 1)) },
  { id: 'book-5', customerId: 'cust-10', roomId: 'room-205', checkInDate: formatDate(today), checkOutDate: formatDate(addDays(today, 2)), numberOfGuests: 2, advancePayment: 4500, totalAmount: 9000, status: 'checked_in', createdAt: formatDate(subDays(today, 2)), actualCheckIn: formatDate(today) },
  { id: 'book-6', customerId: 'cust-11', roomId: 'room-303', checkInDate: formatDate(subDays(today, 2)), checkOutDate: formatDate(addDays(today, 1)), numberOfGuests: 2, advancePayment: 8000, totalAmount: 24000, status: 'checked_in', createdAt: formatDate(subDays(today, 5)), actualCheckIn: formatDate(subDays(today, 2)) },
  { id: 'book-7', customerId: 'cust-15', roomId: 'room-308', checkInDate: formatDate(subDays(today, 4)), checkOutDate: formatDate(addDays(today, 2)), numberOfGuests: 4, specialRequests: 'Airport pickup, late checkout', advancePayment: 40000, totalAmount: 120000, status: 'checked_in', createdAt: formatDate(subDays(today, 14)), actualCheckIn: formatDate(subDays(today, 4)) },
  { id: 'book-8', customerId: 'cust-3', roomId: 'room-104', checkInDate: formatDate(addDays(today, 1)), checkOutDate: formatDate(addDays(today, 4)), numberOfGuests: 2, advancePayment: 4000, totalAmount: 12000, status: 'confirmed', createdAt: formatDate(subDays(today, 3)) },
  { id: 'book-9', customerId: 'cust-6', roomId: 'room-207', checkInDate: formatDate(addDays(today, 2)), checkOutDate: formatDate(addDays(today, 5)), numberOfGuests: 2, advancePayment: 7000, totalAmount: 21000, status: 'confirmed', createdAt: formatDate(subDays(today, 5)) },
  { id: 'book-10', customerId: 'cust-9', roomId: 'room-306', checkInDate: formatDate(addDays(today, 3)), checkOutDate: formatDate(addDays(today, 7)), numberOfGuests: 4, specialRequests: 'Anniversary celebration', advancePayment: 30000, totalAmount: 60000, status: 'confirmed', createdAt: formatDate(subDays(today, 10)) },
  { id: 'book-11', customerId: 'cust-4', roomId: 'room-203', checkInDate: formatDate(addDays(today, 5)), checkOutDate: formatDate(addDays(today, 8)), numberOfGuests: 2, advancePayment: 0, totalAmount: 13500, status: 'pending', createdAt: formatDate(today) },
  { id: 'book-12', customerId: 'cust-7', roomId: 'room-301', checkInDate: formatDate(addDays(today, 7)), checkOutDate: formatDate(addDays(today, 10)), numberOfGuests: 2, advancePayment: 0, totalAmount: 15000, status: 'pending', createdAt: formatDate(today) },
  { id: 'book-13', customerId: 'cust-1', roomId: 'room-201', checkInDate: formatDate(subDays(today, 15)), checkOutDate: formatDate(subDays(today, 12)), numberOfGuests: 1, advancePayment: 2800, totalAmount: 8400, status: 'checked_out', createdAt: formatDate(subDays(today, 20)), actualCheckIn: formatDate(subDays(today, 15)), actualCheckOut: formatDate(subDays(today, 12)) },
  { id: 'book-14', customerId: 'cust-2', roomId: 'room-305', checkInDate: formatDate(subDays(today, 10)), checkOutDate: formatDate(subDays(today, 7)), numberOfGuests: 2, advancePayment: 8000, totalAmount: 24000, status: 'checked_out', createdAt: formatDate(subDays(today, 15)), actualCheckIn: formatDate(subDays(today, 10)), actualCheckOut: formatDate(subDays(today, 7)) },
  { id: 'book-15', customerId: 'cust-3', roomId: 'room-108', checkInDate: formatDate(subDays(today, 8)), checkOutDate: formatDate(subDays(today, 5)), numberOfGuests: 3, advancePayment: 10000, totalAmount: 30000, status: 'checked_out', createdAt: formatDate(subDays(today, 12)), actualCheckIn: formatDate(subDays(today, 8)), actualCheckOut: formatDate(subDays(today, 5)) },
  { id: 'book-16', customerId: 'cust-12', roomId: 'room-206', checkInDate: formatDate(subDays(today, 6)), checkOutDate: formatDate(subDays(today, 3)), numberOfGuests: 2, advancePayment: 7000, totalAmount: 21000, status: 'checked_out', createdAt: formatDate(subDays(today, 10)), actualCheckIn: formatDate(subDays(today, 6)), actualCheckOut: formatDate(subDays(today, 3)) },
  { id: 'book-17', customerId: 'cust-13', roomId: 'room-307', checkInDate: formatDate(subDays(today, 5)), checkOutDate: formatDate(subDays(today, 2)), numberOfGuests: 3, advancePayment: 15000, totalAmount: 45000, status: 'checked_out', createdAt: formatDate(subDays(today, 8)), actualCheckIn: formatDate(subDays(today, 5)), actualCheckOut: formatDate(subDays(today, 2)) },
  { id: 'book-18', customerId: 'cust-14', roomId: 'room-103', checkInDate: formatDate(addDays(today, 2)), checkOutDate: formatDate(addDays(today, 4)), numberOfGuests: 2, advancePayment: 4000, totalAmount: 8000, status: 'cancelled', createdAt: formatDate(subDays(today, 5)) },
];

// Sample Invoices
export const sampleInvoices = [
  { id: 'inv-1', invoiceNumber: 'INV-2024-001', bookingId: 'book-13', customerId: 'cust-1', items: [{ id: 'item-1', description: 'Room 201 - Single (3 nights)', quantity: 3, unitPrice: 2800, totalPrice: 8400, category: 'room' }, { id: 'item-2', description: 'Room Service - Dinner', quantity: 2, unitPrice: 1200, totalPrice: 2400, category: 'food' }, { id: 'item-3', description: 'Laundry Service', quantity: 1, unitPrice: 500, totalPrice: 500, category: 'service' }], subtotal: 11300, cgst: 508.5, sgst: 508.5, igst: 0, totalGst: 1017, grandTotal: 12317, paymentMethod: 'credit_card', paymentStatus: 'paid', paymentReference: 'TXN123456789', createdAt: formatDate(subDays(today, 12)), paidAt: formatDate(subDays(today, 12)) },
  { id: 'inv-2', invoiceNumber: 'INV-2024-002', bookingId: 'book-14', customerId: 'cust-2', items: [{ id: 'item-4', description: 'Room 305 - Deluxe (3 nights)', quantity: 3, unitPrice: 8000, totalPrice: 24000, category: 'room' }, { id: 'item-5', description: 'Spa Treatment', quantity: 2, unitPrice: 3000, totalPrice: 6000, category: 'service' }, { id: 'item-6', description: 'Mini Bar', quantity: 1, unitPrice: 2500, totalPrice: 2500, category: 'food' }], subtotal: 32500, cgst: 2925, sgst: 2925, igst: 0, totalGst: 5850, grandTotal: 38350, paymentMethod: 'upi', paymentStatus: 'paid', paymentReference: 'UPI123456789', createdAt: formatDate(subDays(today, 7)), paidAt: formatDate(subDays(today, 7)) },
  { id: 'inv-3', invoiceNumber: 'INV-2024-003', bookingId: 'book-15', customerId: 'cust-3', items: [{ id: 'item-7', description: 'Room 108 - Suite (3 nights)', quantity: 3, unitPrice: 10000, totalPrice: 30000, category: 'room' }, { id: 'item-8', description: 'Airport Transfer', quantity: 2, unitPrice: 1500, totalPrice: 3000, category: 'service' }], subtotal: 33000, cgst: 2970, sgst: 2970, igst: 0, totalGst: 5940, grandTotal: 38940, paymentMethod: 'net_banking', paymentStatus: 'paid', paymentReference: 'NB987654321', createdAt: formatDate(subDays(today, 5)), paidAt: formatDate(subDays(today, 5)) },
  { id: 'inv-4', invoiceNumber: 'INV-2024-004', bookingId: 'book-16', customerId: 'cust-12', items: [{ id: 'item-9', description: 'Room 206 - Deluxe (3 nights)', quantity: 3, unitPrice: 7000, totalPrice: 21000, category: 'room' }, { id: 'item-10', description: 'Restaurant - Breakfast', quantity: 6, unitPrice: 800, totalPrice: 4800, category: 'food' }], subtotal: 25800, cgst: 2322, sgst: 2322, igst: 0, totalGst: 4644, grandTotal: 30444, paymentMethod: 'debit_card', paymentStatus: 'paid', paymentReference: 'DC456789123', createdAt: formatDate(subDays(today, 3)), paidAt: formatDate(subDays(today, 3)) },
  { id: 'inv-5', invoiceNumber: 'INV-2024-005', bookingId: 'book-17', customerId: 'cust-13', items: [{ id: 'item-11', description: 'Room 307 - Suite (3 nights)', quantity: 3, unitPrice: 15000, totalPrice: 45000, category: 'room' }, { id: 'item-12', description: 'Private Dinner', quantity: 1, unitPrice: 8000, totalPrice: 8000, category: 'food' }, { id: 'item-13', description: 'Butler Service', quantity: 3, unitPrice: 2000, totalPrice: 6000, category: 'service' }], subtotal: 59000, cgst: 5310, sgst: 5310, igst: 0, totalGst: 10620, grandTotal: 69620, paymentMethod: 'cash', paymentStatus: 'paid', createdAt: formatDate(subDays(today, 2)), paidAt: formatDate(subDays(today, 2)) }
];

// Sample SMS Messages
export const sampleMessages = [
  { id: 'msg-1', customerId: 'cust-1', customerName: 'Rahul Sharma', phoneNumber: '+91 9876543210', messageType: 'booking_confirmation', content: 'Dear Rahul Sharma, your booking at Grand Palace Hotel is confirmed! Booking ID: book-1. Check-in: 26 Dec 2024. We look forward to hosting you!', status: 'sent', sentAt: formatDate(subDays(today, 5)) },
  { id: 'msg-2', customerId: 'cust-2', customerName: 'Priya Patel', phoneNumber: '+91 9876543211', messageType: 'check_in_reminder', content: 'Dear Priya Patel, reminder: Your check-in at Grand Palace Hotel is tomorrow. Please bring valid ID proof. Contact: +91 1234567890', status: 'sent', sentAt: formatDate(subDays(today, 2)) },
  { id: 'msg-3', customerId: 'cust-5', customerName: 'Vikram Singh', phoneNumber: '+91 9876543214', messageType: 'check_out_reminder', content: 'Dear Vikram Singh, your checkout is scheduled for today. Please settle your bills at the front desk. Thank you for staying with us!', status: 'sent', sentAt: formatDate(today) },
  { id: 'msg-4', customerId: 'cust-3', customerName: 'Amit Kumar', phoneNumber: '+91 9876543212', messageType: 'booking_confirmation', content: 'Dear Amit Kumar, your booking at Grand Palace Hotel is confirmed! Room 104 awaits you on 29 Dec 2024.', status: 'sent', sentAt: formatDate(subDays(today, 3)) },
  { id: 'msg-5', customerId: 'cust-10', customerName: 'Meera Nair', phoneNumber: '+91 9876543219', messageType: 'promotional', content: 'Exclusive offer for you, Meera! Get 20% off on your next stay at Grand Palace Hotel. Book before 31 Dec 2024. Code: NEWYEAR20', status: 'sent', sentAt: formatDate(subDays(today, 1)) }
];

// Sample SMS Templates
export const sampleTemplates = [
  { id: 'tpl-1', type: 'booking_confirmation', name: 'Booking Confirmation', content: 'Dear {customer_name}, your booking at Vrindavan Palace is confirmed! Booking ID: {booking_id}. Check-in: {check_in_date}. We look forward to hosting you!', isActive: true },
  { id: 'tpl-2', type: 'check_in_reminder', name: 'Check-in Reminder', content: 'Dear {customer_name}, reminder: Your check-in at Vrindavan Palace is tomorrow. Please bring valid ID proof. Contact: {hotel_phone}', isActive: true },
  { id: 'tpl-3', type: 'check_out_reminder', name: 'Check-out Reminder', content: 'Dear {customer_name}, your checkout is scheduled for today. Please settle your bills at the front desk. Thank you for staying with us!', isActive: true },
  { id: 'tpl-4', type: 'promotional', name: 'Promotional Message', content: 'Exclusive offer for you, {customer_name}! Get {discount}% off on your next stay at Vrindavan Palace. Book before {expiry_date}. Code: {promo_code}', isActive: true },
  { id: 'tpl-5', type: 'invoice', name: 'Invoice Sharing', content: 'Dear {customer_name}, thank you for staying at Vrindavan Palace. Your invoice #{invoice_number} for ₹{amount} is attached. We hope to see you again!', isActive: true },
  { id: 'tpl-6', type: 'payment_reminder', name: 'Payment Reminder', content: 'Dear {customer_name}, this is a gentle reminder about your pending payment of ₹{amount} for booking #{booking_id}. Please complete the payment at your earliest convenience.', isActive: true }
];

// Sample Hotel Settings
export const sampleSettings = {
  name: 'Vrindavan Palace',
  address: '123 Luxury Avenue, Seaside District, Mumbai, Maharashtra 400001',
  phone: '+91 22 1234 5678',
  email: 'info@grandpalacehotel.com',
  gstNumber: '27AABCG1234M1ZA',
  gstRates: { cgst: 9, sgst: 9, igst: 18 },
  roomPricing: { single: 2500, double: 4000, suite: 10000, deluxe: 6000 },
  policies: { cancellationHours: 24, lateCheckoutCharge: 50, earlyCheckoutRefund: 25 },
  currency: 'INR',
  dateFormat: 'DD/MM/YYYY'
};

// Generate revenue data for charts
export const generateRevenueData = () => {
  const data = [];
  for (let i = 29; i >= 0; i--) {
    const date = subDays(today, i);
    data.push({
      date: date.toISOString().split('T')[0],
      revenue: Math.floor(Math.random() * 150000) + 50000,
      bookings: Math.floor(Math.random() * 10) + 2
    });
  }
  return data;
};
