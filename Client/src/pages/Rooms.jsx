// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import {
//   Plus,
//   Search,
//   Edit,
//   CheckCircle,
//   Loader2,
//   Wifi,
//   Tv,
//   Wind,
//   Wine,
//   Bath,
//   Mountain,
//   Waves,
//   Building,
//   TreeDeciduous,
//   Users,
// } from "lucide-react";
// import { toast } from "sonner";

// import { MainLayout } from "@/components/layout/MainLayout";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { QuickBookingModal } from "@/components/booking/QuickBookingModal";
// import { roomsAPI } from "@/api/rooms";

// const statusColors = {
//   available: "bg-green-100 text-green-700 border-green-200",
//   occupied: "bg-blue-100 text-blue-700 border-blue-200",
//   reserved: "bg-yellow-100 text-yellow-700 border-yellow-200",
//   cleaning: "bg-purple-100 text-purple-700 border-purple-200",
//   maintenance: "bg-red-100 text-red-700 border-red-200",
// };

// const housekeepingColors = {
//   clean: "bg-green-100 text-green-700",
//   dirty: "bg-red-100 text-red-700",
//   in_progress: "bg-yellow-100 text-yellow-700",
// };

// const viewIcons = {
//   city: Building,
//   garden: TreeDeciduous,
//   pool: Waves,
//   mountain: Mountain,
// };

// export default function Rooms() {
//   const navigate = useNavigate();
//   const queryClient = useQueryClient();

//   // State
//   const [searchQuery, setSearchQuery] = useState("");
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [floorFilter, setFloorFilter] = useState("all");
//   const [selectedRoom, setSelectedRoom] = useState(null);
//   const [showBookingModal, setShowBookingModal] = useState(false);

//   // Queries
//   const { data, isLoading } = useQuery({
//     queryKey: [
//       "rooms",
//       {
//         search: searchQuery,
//         status: statusFilter !== "all" ? statusFilter : undefined,
//       },
//     ],
//     queryFn: () =>
//       roomsAPI.getAll({
//         search: searchQuery,
//         status: statusFilter !== "all" ? statusFilter : undefined,
//       }),
//   });

//   const rooms = data?.data?.rooms || [];

//   // Mutations
//   const markAsCleanedMutation = useMutation({
//     mutationFn: async (roomId) => {
//       await roomsAPI.updateHousekeeping(roomId, "clean");
//       await roomsAPI.updateStatus(roomId, "available");
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["rooms"] });
//       toast.success("Room marked as cleaned and available");
//     },
//     onError: (error) =>
//       toast.error("Failed to update status: " + error.message),
//   });

//   const startCleaningMutation = useMutation({
//     mutationFn: (roomId) => roomsAPI.updateHousekeeping(roomId, "in_progress"),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["rooms"] });
//       toast.success("Cleaning started");
//     },
//     onError: (error) => toast.error("Failed to update: " + error.message),
//   });

//   // Handlers
//   const handleBookNow = (room) => {
//     setSelectedRoom(room);
//     setShowBookingModal(true);
//   };

//   const filteredRooms = rooms?.filter((room) => {
//     const matchesFloor =
//       floorFilter === "all" || room.floor === parseInt(floorFilter);
//     return matchesFloor;
//   });

//   const floors = [...new Set(rooms?.map((r) => r.floor))].sort();

//   const formatCurrency = (value) => {
//     return new Intl.NumberFormat("en-IN", {
//       style: "currency",
//       currency: "INR",
//       maximumFractionDigits: 0,
//     }).format(value);
//   };

//   const cleaningRooms = rooms.filter((r) => r.status === "cleaning");

//   if (isLoading) {
//     return (
//       <MainLayout title="Rooms" subtitle="Loading inventory...">
//         <div className="flex items-center justify-center min-h-[400px]">
//           <Loader2 className="h-12 w-12 animate-spin text-primary" />
//         </div>
//       </MainLayout>
//     );
//   }

//   return (
//     <MainLayout
//       title="Room Management"
//       subtitle="Manage inventory and housekeeping"
//     >
//       <div className="space-y-6 animate-fade-in">
//         {/* Housekeeping Alert Banner */}
//         {cleaningRooms.length > 0 && (
//           <Card className="border-purple-200 bg-purple-50/50">
//             <CardHeader className="pb-3">
//               <CardTitle className="text-purple-800 text-lg flex items-center gap-2">
//                 <CheckCircle className="h-5 w-5" />
//                 Rooms Pending Cleaning ({cleaningRooms.length})
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="flex flex-wrap gap-3">
//                 {cleaningRooms.map((room) => (
//                   <div
//                     key={room.id}
//                     className="flex items-center gap-3 bg-white p-3 rounded-lg border shadow-sm"
//                   >
//                     <div>
//                       <p className="font-bold text-sm">
//                         Room {room.room_number}
//                       </p>
//                       <p className="text-xs text-muted-foreground capitalize">
//                         {room.type}
//                       </p>
//                     </div>
//                     <div className="flex gap-1">
//                       {room.housekeeping_status !== "in_progress" && (
//                         <Button
//                           size="sm"
//                           variant="outline"
//                           onClick={() => startCleaningMutation.mutate(room.id)}
//                         >
//                           Start
//                         </Button>
//                       )}
//                       <Button
//                         size="sm"
//                         className="bg-green-600 hover:bg-green-700 text-white"
//                         onClick={() => markAsCleanedMutation.mutate(room.id)}
//                       >
//                         Cleaned
//                       </Button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>
//         )}

//         {/* Filters & Actions */}
//         <div className="flex flex-wrap gap-4 items-center justify-between">
//           <div className="relative flex-1 min-w-[300px]">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//             <Input
//               placeholder="Search room number or type..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="pl-9"
//             />
//           </div>
//           <Button
//             className="hotel-button-gold"
//             onClick={() => navigate("/rooms/new")}
//           >
//             <Plus className="h-4 w-4 mr-2" /> Add Room
//           </Button>
//         </div>

//         <div className="flex flex-col gap-4">
//           <div className="flex gap-2 flex-wrap items-center">
//             <span className="text-sm font-medium mr-2">Status:</span>
//             <Button
//               variant={statusFilter === "all" ? "default" : "outline"}
//               onClick={() => setStatusFilter("all")}
//               size="sm"
//             >
//               All
//             </Button>
//             {[
//               "available",
//               "occupied",
//               "reserved",
//               "cleaning",
//               "maintenance",
//             ].map((s) => (
//               <Button
//                 key={s}
//                 variant={statusFilter === s ? "default" : "outline"}
//                 onClick={() => setStatusFilter(s)}
//                 size="sm"
//                 className="capitalize"
//               >
//                 {s}
//               </Button>
//             ))}
//           </div>

//           <div className="flex gap-2 flex-wrap items-center">
//             <span className="text-sm font-medium mr-2">Floor:</span>
//             <Button
//               variant={floorFilter === "all" ? "secondary" : "outline"}
//               onClick={() => setFloorFilter("all")}
//               size="sm"
//             >
//               All Floors
//             </Button>
//             {floors.map((f) => (
//               <Button
//                 key={f}
//                 variant={floorFilter === String(f) ? "secondary" : "outline"}
//                 onClick={() => setFloorFilter(String(f))}
//                 size="sm"
//               >
//                 Floor {f}
//               </Button>
//             ))}
//           </div>
//         </div>

//         {/* Room Grid (Card View) */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
//           {filteredRooms.map((room) => {
//             const ViewIcon = viewIcons[room.view_type] || Building;

//             return (
//               <Card
//                 key={room.id}
//                 className="overflow-hidden hover:shadow-lg transition-all "
//               >
//                 <div className="h-24 bg-gradient-hero flex items-center justify-between px-6 rounded-2xl">
//                   <div>
//                     <p className="text-3xl font-bold text-hotel-gold-dark">
//                       {room.room_number}
//                     </p>
//                     <p className="text-xs text-hotel-gold uppercase tracking-wider">
//                       {room.type}
//                     </p>
//                   </div>
//                   <Badge className={`${statusColors[room.status]} px-3 py-1`}>
//                     {room.status}
//                   </Badge>
//                 </div>

//                 <CardContent className="p-5 space-y-2">
//                   <div className="flex justify-between items-center text-sm">
//                     <div className="flex items-center gap-1 text-muted-foreground">
//                       <ViewIcon className="h-4 w-4" />
//                       <span className="capitalize">
//                         {room?.view_type.replace("_", " ")}
//                       </span>
//                     </div>
//                     <Badge
//                       variant="outline"
//                       className={housekeepingColors[room.housekeeping_status]}
//                     >
//                       {room.housekeeping_status?.replace("_", " ")}
//                     </Badge>
//                   </div>

//                   <div className="flex items-baseline justify-between">
//                     <p className="text-2xl font-bold text-slate-900">
//                       {formatCurrency(room.base_price)}
//                     </p>
//                     <span className="text-xs text-muted-foreground">
//                       per night
//                     </span>
//                   </div>

//                   <div className="flex items-center gap-2 text-sm text-muted-foreground bg-slate-50 p-2 rounded">
//                     <Users className="h-4 w-4" />
//                     <span>Up to {room.max_occupancy} Guests</span>
//                     <span className="ml-auto font-medium text-slate-700">
//                       Floor {room.floor}
//                     </span>
//                   </div>

//                   <div className="pt-2 flex gap-2">
//                     {room.status === "available" ? (
//                       <Button
//                         className="w-full hotel-button-gold"
//                         onClick={() => handleBookNow(room)}
//                       >
//                         Book Now
//                       </Button>
//                     ) : room.status === "cleaning" ? (
//                       <Button
//                         className="w-full bg-green-600 hover:bg-green-700 text-white"
//                         onClick={() => markAsCleanedMutation.mutate(room.id)}
//                       >
//                         Mark Ready
//                       </Button>
//                     ) : null}
//                   </div>
//                 </CardContent>
//               </Card>
//             );
//           })}
//         </div>

//         {filteredRooms.length === 0 && (
//           <div className="text-center py-20 border-2 border-dashed rounded-xl">
//             <p className="text-muted-foreground">
//               No rooms match your current filters
//             </p>
//           </div>
//         )}
//       </div>

//       {selectedRoom && (
//         <QuickBookingModal
//           isOpen={showBookingModal}
//           onClose={() => {
//             setShowBookingModal(false);
//             setSelectedRoom(null);
//           }}
//           room={selectedRoom}
//         />
//       )}
//     </MainLayout>
//   );
// }
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Plus,
  Search,
  Edit,
  CheckCircle,
  Loader2,
  Wifi,
  Tv,
  Wind,
  Wine,
  Bath,
  Mountain,
  Waves,
  Building,
  TreeDeciduous,
  Users,
  Pencil, // Added Pencil icon
} from "lucide-react";
import { toast } from "sonner";

import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QuickBookingModal } from "@/components/booking/QuickBookingModal";
import { EditRoomModal } from "./EditRoomModel"; // Import the new modal
import { roomsAPI } from "@/api/rooms";

const statusColors = {
  available: "bg-green-100 text-green-700 border-green-200",
  occupied: "bg-blue-100 text-blue-700 border-blue-200",
  reserved: "bg-yellow-100 text-yellow-700 border-yellow-200",
  cleaning: "bg-purple-100 text-purple-700 border-purple-200",
  maintenance: "bg-red-100 text-red-700 border-red-200",
};

const housekeepingColors = {
  clean: "bg-green-100 text-green-700",
  dirty: "bg-red-100 text-red-700",
  in_progress: "bg-yellow-100 text-yellow-700",
};

const viewIcons = {
  city: Building,
  garden: TreeDeciduous,
  pool: Waves,
  mountain: Mountain,
};

export default function Rooms() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [floorFilter, setFloorFilter] = useState("all");
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false); // Add edit modal state
  const [roomToEdit, setRoomToEdit] = useState(null); // Add room to edit state

  // Queries
  const { data, isLoading } = useQuery({
    queryKey: [
      "rooms",
      {
        search: searchQuery,
        status: statusFilter !== "all" ? statusFilter : undefined,
      },
    ],
    queryFn: () =>
      roomsAPI.getAll({
        search: searchQuery,
        status: statusFilter !== "all" ? statusFilter : undefined,
      }),
  });

  const rooms = data?.data?.rooms || [];

  // Mutations
  const markAsCleanedMutation = useMutation({
    mutationFn: async (roomId) => {
      await roomsAPI.updateHousekeeping(roomId, "clean");
      await roomsAPI.updateStatus(roomId, "available");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      toast.success("Room marked as cleaned and available");
    },
    onError: (error) =>
      toast.error("Failed to update status: " + error.message),
  });

  const startCleaningMutation = useMutation({
    mutationFn: (roomId) => roomsAPI.updateHousekeeping(roomId, "in_progress"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      toast.success("Cleaning started");
    },
    onError: (error) => toast.error("Failed to update: " + error.message),
  });

  // Handlers
  const handleBookNow = (room) => {
    setSelectedRoom(room);
    setShowBookingModal(true);
  };

  const handleEditRoom = (room) => {
    setRoomToEdit(room);
    setShowEditModal(true);
  };

  const filteredRooms = rooms?.filter((room) => {
    const matchesFloor =
      floorFilter === "all" || room.floor === parseInt(floorFilter);
    return matchesFloor;
  });

  const floors = [...new Set(rooms?.map((r) => r.floor))].sort();

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const cleaningRooms = rooms.filter((r) => r.status === "cleaning");

  if (isLoading) {
    return (
      <MainLayout title="Rooms" subtitle="Loading inventory...">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout
      title="Room Management"
      subtitle="Manage inventory and housekeeping"
    >
      <div className="space-y-6 animate-fade-in">
        {/* Housekeeping Alert Banner */}
        {cleaningRooms.length > 0 && (
          <Card className="border-purple-200 bg-purple-50/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-purple-800 text-lg flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Rooms Pending Cleaning ({cleaningRooms.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {cleaningRooms.map((room) => (
                  <div
                    key={room.id}
                    className="flex items-center gap-3 bg-white p-3 rounded-lg border shadow-sm"
                  >
                    <div>
                      <p className="font-bold text-sm">
                        Room {room.room_number}
                      </p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {room.type}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      {room.housekeeping_status !== "in_progress" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => startCleaningMutation.mutate(room.id)}
                        >
                          Start
                        </Button>
                      )}
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => markAsCleanedMutation.mutate(room.id)}
                      >
                        Cleaned
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters & Actions */}
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search room number or type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button
            className="hotel-button-gold"
            onClick={() => navigate("/rooms/new")}
          >
            <Plus className="h-4 w-4 mr-2" /> Add Room
          </Button>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex gap-2 flex-wrap items-center">
            <span className="text-sm font-medium mr-2">Status:</span>
            <Button
              variant={statusFilter === "all" ? "default" : "outline"}
              onClick={() => setStatusFilter("all")}
              size="sm"
            >
              All
            </Button>
            {[
              "available",
              "occupied",
              "reserved",
              "cleaning",
              "maintenance",
            ].map((s) => (
              <Button
                key={s}
                variant={statusFilter === s ? "default" : "outline"}
                onClick={() => setStatusFilter(s)}
                size="sm"
                className="capitalize"
              >
                {s}
              </Button>
            ))}
          </div>

          <div className="flex gap-2 flex-wrap items-center">
            <span className="text-sm font-medium mr-2">Floor:</span>
            <Button
              variant={floorFilter === "all" ? "secondary" : "outline"}
              onClick={() => setFloorFilter("all")}
              size="sm"
            >
              All Floors
            </Button>
            {floors.map((f) => (
              <Button
                key={f}
                variant={floorFilter === String(f) ? "secondary" : "outline"}
                onClick={() => setFloorFilter(String(f))}
                size="sm"
              >
                Floor {f}
              </Button>
            ))}
          </div>
        </div>

        {/* Room Grid (Card View) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {filteredRooms.map((room) => {
            const ViewIcon = viewIcons[room.view_type] || Building;

            return (
              <Card
                key={room.id}
                className="overflow-hidden hover:shadow-lg transition-all"
              >
                <div className="h-24 bg-gradient-hero flex items-center justify-between px-6 rounded-2xl relative">
                  <div>
                    <p className="text-3xl font-bold text-hotel-gold-dark">
                      {room.room_number}
                    </p>
                    <p className="text-xs text-hotel-gold uppercase tracking-wider">
                      {room.type}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`${statusColors[room.status]} px-3 py-1`}>
                      {room.status}
                    </Badge>
                    {/* Edit Button */}
                    {room.status === "available" && (
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-hotel-navy-dark bg-white/20 cursor-pointer"
                        onClick={() => handleEditRoom(room)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>

                <CardContent className="p-5 space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <ViewIcon className="h-4 w-4" />
                      <span className="capitalize">
                        {room?.view_type?.replace("_", " ")}
                      </span>
                    </div>
                    <Badge
                      variant="outline"
                      className={housekeepingColors[room.housekeeping_status]}
                    >
                      {room.housekeeping_status?.replace("_", " ")}
                    </Badge>
                  </div>

                  <div className="flex items-baseline justify-between">
                    <p className="text-2xl font-bold text-slate-900">
                      {formatCurrency(room.base_price)}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      per night
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground bg-slate-50 p-2 rounded">
                    <Users className="h-4 w-4" />
                    <span>Up to {room.max_occupancy} Guests</span>
                    <span className="ml-auto font-medium text-slate-700">
                      Floor {room.floor}
                    </span>
                  </div>

                  <div className="pt-2 flex gap-2">
                    {room.status === "available" ? (
                      <Button
                        className="w-full hotel-button-gold"
                        onClick={() => handleBookNow(room)}
                      >
                        Book Now
                      </Button>
                    ) : room.status === "cleaning" ? (
                      <Button
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => markAsCleanedMutation.mutate(room.id)}
                      >
                        Mark Ready
                      </Button>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredRooms.length === 0 && (
          <div className="text-center py-20 border-2 border-dashed rounded-xl">
            <p className="text-muted-foreground">
              No rooms match your current filters
            </p>
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

      {/* Edit Room Modal */}
      {roomToEdit && (
        <EditRoomModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setRoomToEdit(null);
          }}
          room={roomToEdit}
        />
      )}
    </MainLayout>
  );
}
