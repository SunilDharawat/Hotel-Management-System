import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRooms } from '@/contexts/AppContext';
import { QuickBookingModal } from '@/components/booking/QuickBookingModal';
import { Search, Wifi, Tv, Wind, Wine, Bath, Mountain, Waves, Building, TreeDeciduous, Users } from 'lucide-react';

const statusColors = {
  available: 'bg-green-100 text-green-700 border-green-200',
  occupied: 'bg-blue-100 text-blue-700 border-blue-200',
  reserved: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  cleaning: 'bg-purple-100 text-purple-700 border-purple-200',
  maintenance: 'bg-red-100 text-red-700 border-red-200'
};

const amenityIcons = {
  wifi: Wifi,
  tv: Tv,
  ac: Wind,
  minibar: Wine,
  jacuzzi: Bath
};

const viewIcons = {
  city: Building,
  garden: TreeDeciduous,
  pool: Waves,
  mountain: Mountain
};

export default function Rooms() {
  const { rooms } = useRooms();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [floorFilter, setFloorFilter] = useState('all');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  const handleBookNow = (room) => {
    setSelectedRoom(room);
    setShowBookingModal(true);
  };

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.roomNumber.includes(searchQuery) ||
      room.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || room.status === statusFilter;
    const matchesFloor = floorFilter === 'all' || room.floor === parseInt(floorFilter);
    return matchesSearch && matchesStatus && matchesFloor;
  });

  const floors = [...new Set(rooms.map(r => r.floor))].sort();

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <MainLayout title="Room Management" subtitle="View and manage all hotel rooms">
      <div className="space-y-6 animate-fade-in">
        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search rooms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={statusFilter === 'all' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('all')}
              size="sm"
            >
              All
            </Button>
            {['available', 'occupied', 'reserved', 'cleaning', 'maintenance'].map(status => (
              <Button
                key={status}
                variant={statusFilter === status ? 'default' : 'outline'}
                onClick={() => setStatusFilter(status)}
                size="sm"
                className="capitalize"
              >
                {status}
              </Button>
            ))}
          </div>

          <div className="flex gap-2">
            <Button
              variant={floorFilter === 'all' ? 'secondary' : 'outline'}
              onClick={() => setFloorFilter('all')}
              size="sm"
            >
              All Floors
            </Button>
            {floors.map(floor => (
              <Button
                key={floor}
                variant={floorFilter === String(floor) ? 'secondary' : 'outline'}
                onClick={() => setFloorFilter(String(floor))}
                size="sm"
              >
                Floor {floor}
              </Button>
            ))}
          </div>
        </div>

        {/* Room Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map(room => {
            const ViewIcon = viewIcons[room.viewType] || Building;
            
            return (
              <Card key={room.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-32 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-4xl font-display font-bold text-primary">{room.roomNumber}</p>
                    <p className="text-sm text-muted-foreground capitalize">{room.type}</p>
                  </div>
                </div>
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge className={statusColors[room.status]}>
                      {room.status}
                    </Badge>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <ViewIcon className="h-4 w-4" />
                      <span className="text-sm capitalize">{room.viewType} view</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-xl font-bold">{formatCurrency(room.basePrice)}</p>
                    <span className="text-sm text-muted-foreground">/night</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>Max {room.maxOccupancy} guests</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {room.amenities.slice(0, 4).map(amenity => {
                      const Icon = amenityIcons[amenity];
                      return Icon ? (
                        <div key={amenity} className="p-2 rounded-lg bg-muted" title={amenity}>
                          <Icon className="h-4 w-4 text-muted-foreground" />
                        </div>
                      ) : null;
                    })}
                    {room.amenities.length > 4 && (
                      <div className="p-2 rounded-lg bg-muted text-xs text-muted-foreground">
                        +{room.amenities.length - 4}
                      </div>
                    )}
                  </div>

                  {room.status === 'available' && (
                    <Button 
                      className="w-full hotel-button-gold"
                      onClick={() => handleBookNow(room)}
                    >
                      Book Now
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredRooms.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No rooms match your filters</p>
          </div>
        )}
      </div>

      {selectedRoom && (
        <QuickBookingModal
          isOpen={showBookingModal}
          onClose={() => {
            setShowBookingModal(false);
            setSelectedRoom(null);
          }}
          room={selectedRoom}
        />
      )}
    </MainLayout>
  );
}
