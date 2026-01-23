// import { useState, useEffect } from "react";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { X, Save, Loader2, DoorOpen } from "lucide-react";
// import { toast } from "sonner";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Textarea } from "@/components/ui/textarea";
// import { roomsAPI } from "@/api/rooms";

// export function EditRoomModal({ isOpen, onClose, room }) {
//   const queryClient = useQueryClient();

//   // Update room mutation
//   const updateRoomMutation = useMutation({
//     mutationFn: ({ id, data }) => roomsAPI.update(id, data),
//     onSuccess: () => {
//       toast.success("Room updated successfully!");
//       queryClient.invalidateQueries({ queryKey: ["rooms"] });
//       onClose();
//     },
//     onError: (error) => {
//       toast.error(error?.response?.data?.message || "Failed to update room");
//     },
//   });

//   // Form State
//   const [formData, setFormData] = useState({
//     room_number: "",
//     type: "single",
//     floor: "",
//     base_price: "",
//     max_occupancy: "2",
//     size_sqft: "",
//     view_type: "city",
//     description: "",
//   });

//   const [errors, setErrors] = useState({});

//   // Populate form when room changes
//   useEffect(() => {
//     if (room) {
//       setFormData({
//         room_number: room.room_number || "",
//         type: room.type || "single",
//         floor: room.floor?.toString() || "",
//         base_price: room.base_price?.toString() || "",
//         max_occupancy: room.max_occupancy?.toString() || "2",
//         size_sqft: room.size_sqft?.toString() || "",
//         view_type: room.view_type || "city",
//         description: room.description || "",
//       });
//       setErrors({});
//     }
//   }, [room]);

//   // Validation Logic
//   const validateForm = () => {
//     const newErrors = {};
//     if (!formData.room_number.trim())
//       newErrors.room_number = "Room number is required";
//     if (!formData.floor) newErrors.floor = "Floor is required";
//     if (!formData.base_price || formData.base_price <= 0)
//       newErrors.base_price = "Enter a valid price";
//     if (!formData.size_sqft) newErrors.size_sqft = "Room size is required";

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   // Handlers
//   const handleChange = (field, value) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//     if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!validateForm()) {
//       toast.error("Please fill all required fields");
//       return;
//     }

//     // Convert string inputs to numbers for the API
//     const roomPayload = {
//       ...formData,
//       floor: parseInt(formData.floor),
//       base_price: parseFloat(formData.base_price),
//       max_occupancy: parseInt(formData.max_occupancy),
//       size_sqft: parseInt(formData.size_sqft),
//     };

//     updateRoomMutation.mutate({ id: room.id, data: roomPayload });
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle className="flex items-center gap-2 text-xl">
//             <DoorOpen className="h-5 w-5 text-primary" />
//             Edit Room {room?.room_number}
//           </DialogTitle>
//         </DialogHeader>

//         <form onSubmit={handleSubmit} className="space-y-6 pt-4">
//           {/* Basic Info Section */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="space-y-2">
//               <Label htmlFor="room_number">Room Number *</Label>
//               <Input
//                 id="room_number"
//                 placeholder="e.g. 201"
//                 value={formData.room_number}
//                 onChange={(e) => handleChange("room_number", e.target.value)}
//                 className={errors.room_number ? "border-destructive" : ""}
//               />
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="type">Room Type *</Label>
//               <Select
//                 value={formData.type}
//                 onValueChange={(v) => handleChange("type", v)}
//               >
//                 <SelectTrigger>
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="single">Single</SelectItem>
//                   <SelectItem value="double">Double</SelectItem>
//                   <SelectItem value="deluxe">Deluxe</SelectItem>
//                   <SelectItem value="suite">Suite</SelectItem>
//                   <SelectItem value="hall">Hall</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="floor">Floor *</Label>
//               <Input
//                 id="floor"
//                 type="number"
//                 placeholder="e.g. 2"
//                 value={formData.floor}
//                 onChange={(e) => handleChange("floor", e.target.value)}
//                 className={errors.floor ? "border-destructive" : ""}
//               />
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="base_price">Base Price (INR) *</Label>
//               <Input
//                 id="base_price"
//                 type="number"
//                 placeholder="7500"
//                 value={formData.base_price}
//                 onChange={(e) => handleChange("base_price", e.target.value)}
//                 className={errors.base_price ? "border-destructive" : ""}
//               />
//             </div>
//           </div>

//           {/* Specifications Section */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t">
//             <div className="space-y-2">
//               <Label htmlFor="max_occupancy">Max Occupancy</Label>
//               <Select
//                 value={formData.max_occupancy}
//                 onValueChange={(v) => handleChange("max_occupancy", v)}
//               >
//                 <SelectTrigger>
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {[1, 2, 3, 4, 5, 6].map((num) => (
//                     <SelectItem key={num} value={num.toString()}>
//                       {num} Persons
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="size_sqft">Size (Sq. Ft) *</Label>
//               <Input
//                 id="size_sqft"
//                 type="number"
//                 placeholder="450"
//                 value={formData.size_sqft}
//                 onChange={(e) => handleChange("size_sqft", e.target.value)}
//               />
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="view_type">View Type</Label>
//               <Select
//                 value={formData.view_type}
//                 onValueChange={(v) => handleChange("view_type", v)}
//               >
//                 <SelectTrigger>
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="city_view">City View</SelectItem>
//                   <SelectItem value="sea_view">Sea View</SelectItem>
//                   <SelectItem value="garden_view">Garden View</SelectItem>
//                   <SelectItem value="pool_view">Pool View</SelectItem>
//                   <SelectItem value="mountain_view">Mountain View</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>

//           {/* Description Section */}
//           <div className="space-y-2 pt-4 border-t">
//             <Label htmlFor="description">Room Description</Label>
//             <Textarea
//               id="description"
//               placeholder="Describe the room amenities, features, etc..."
//               rows={4}
//               value={formData.description}
//               onChange={(e) => handleChange("description", e.target.value)}
//             />
//           </div>

//           {/* Action Buttons */}
//           <div className="flex justify-end gap-4 pt-6 border-t">
//             <Button type="button" variant="outline" onClick={onClose}>
//               Cancel
//             </Button>
//             <Button
//               type="submit"
//               className="hotel-button-gold px-8"
//               disabled={updateRoomMutation.isPending}
//             >
//               {updateRoomMutation.isPending ? (
//                 <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//               ) : (
//                 <Save className="h-4 w-4 mr-2" />
//               )}
//               Update Room
//             </Button>
//           </div>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// }
import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { roomsAPI } from "@/api/rooms";
import { Save, Loader2, Users } from "lucide-react";
import { toast } from "sonner";

export function EditRoomModal({ isOpen, onClose, room }) {
  const queryClient = useQueryClient();

  // 1. Form State initialized with room data
  const [formData, setFormData] = useState({
    room_number: "",
    type: "single",
    floor: "",
    base_price: "",
    max_occupancy: "",
    size_sqft: "",
    view_type: "",
    description: "",
  });

  const [errors, setErrors] = useState({});

  // Sync state when room prop changes
  useEffect(() => {
    if (room) {
      setFormData({
        room_number: room.room_number || "",
        type: room.type || "single",
        floor: room.floor?.toString() || "",
        base_price: room.base_price?.toString() || "",
        max_occupancy: room.max_occupancy?.toString() || "",
        size_sqft: room.size_sqft?.toString() || "",
        view_type: room.view_type || "city_view",
        description: room.description || "",
      });
    }
  }, [room]);

  // 2. Mutation for updating
  const updateMutation = useMutation({
    mutationFn: (data) => roomsAPI.update(room.id, data),
    onSuccess: () => {
      toast.success("Room updated successfully");
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      onClose();
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Update failed");
    },
  });

  // 3. Logic Handlers (Same as NewRoom)
  const isHall = formData.type === "hall";

  const handleChange = (field, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };

      // If user changes type during edit, handle defaults
      if (field === "type") {
        if (value === "hall") {
          updated.max_occupancy = "50";
          updated.view_type = "party_hall";
        } else {
          updated.max_occupancy = "2";
          updated.view_type = "city_view";
        }
      }
      return updated;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      floor: parseInt(formData.floor),
      base_price: parseFloat(formData.base_price),
      max_occupancy: parseInt(formData.max_occupancy),
      size_sqft: parseInt(formData.size_sqft),
    };

    updateMutation.mutate(payload);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Edit {isHall ? "Hall" : "Room"}: {room?.room_number}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Number/Name</Label>
              <Input
                value={formData.room_number}
                onChange={(e) => handleChange("room_number", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Type</Label>
              <Select
                value={formData.type}
                onValueChange={(v) => handleChange("type", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single</SelectItem>
                  <SelectItem value="double">Double</SelectItem>
                  <SelectItem value="deluxe">Deluxe</SelectItem>
                  <SelectItem value="suite">Suite</SelectItem>
                  <SelectItem value="hall">Hall</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Floor</Label>
              <Input
                type="number"
                value={formData.floor}
                onChange={(e) => handleChange("floor", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Base Price (INR)</Label>
              <Input
                type="number"
                value={formData.base_price}
                onChange={(e) => handleChange("base_price", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* CONDITIONAL OCCUPANCY */}
            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                <Users className="h-3 w-3" /> Max Capacity
              </Label>
              {isHall ? (
                <Input
                  type="number"
                  value={formData.max_occupancy}
                  onChange={(e) =>
                    handleChange("max_occupancy", e.target.value)
                  }
                />
              ) : (
                <Select
                  value={formData.max_occupancy}
                  onValueChange={(v) => handleChange("max_occupancy", v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <SelectItem key={n} value={n.toString()}>
                        {n} Persons
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* CONDITIONAL VIEW TYPE */}
            <div className="space-y-2">
              <Label>{isHall ? "Hall Purpose" : "View Type"}</Label>
              <Select
                value={formData.view_type}
                onValueChange={(v) => handleChange("view_type", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {isHall ? (
                    <>
                      <SelectItem value="party_hall">Party Hall</SelectItem>
                      <SelectItem value="meeting_hall">Meeting Hall</SelectItem>
                    </>
                  ) : (
                    <>
                      <SelectItem value="city_view">City View</SelectItem>
                      <SelectItem value="garden_view">Garden View</SelectItem>
                      <SelectItem value="sea_view">Sea View</SelectItem>
                      <SelectItem value="pool_view">Pool View</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Size (Sq. Ft)</Label>
            <Input
              type="number"
              value={formData.size_sqft}
              onChange={(e) => handleChange("size_sqft", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={3}
            />
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="hotel-button-gold"
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
