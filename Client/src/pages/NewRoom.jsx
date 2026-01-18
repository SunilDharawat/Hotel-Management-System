import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { ArrowLeft, DoorOpen, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function NewRoom() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // 1. Mutation for creating a room
  const createRoomMutation = useMutation({
    mutationFn: (data) => roomsAPI.create(data),
    onSuccess: () => {
      toast.success("Room created successfully!");
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      navigate("/rooms");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to create room");
    },
  });

  // 2. Form State
  const [formData, setFormData] = useState({
    room_number: "",
    type: "single",
    floor: "",
    base_price: "",
    max_occupancy: "2",
    size_sqft: "",
    view_type: "city",
    description: "",
  });

  const [errors, setErrors] = useState({});

  // 3. Validation Logic
  const validateForm = () => {
    const newErrors = {};
    if (!formData.room_number.trim())
      newErrors.room_number = "Room number is required";
    if (!formData.floor) newErrors.floor = "Floor is required";
    if (!formData.base_price || formData.base_price <= 0)
      newErrors.base_price = "Enter a valid price";
    if (!formData.size_sqft) newErrors.size_sqft = "Room size is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 4. Handlers
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fill all required fields");
      return;
    }

    // Convert string inputs to numbers for the API
    const roomPayload = {
      ...formData,
      floor: parseInt(formData.floor),
      base_price: parseFloat(formData.base_price),
      max_occupancy: parseInt(formData.max_occupancy),
      size_sqft: parseInt(formData.size_sqft),
    };

    createRoomMutation.mutate(roomPayload);
  };

  return (
    <MainLayout title="Add New Room" subtitle="Expand your hotel inventory">
      <div className="max-w-3xl mx-auto animate-fade-in">
        <Button
          variant="ghost"
          onClick={() => navigate("/rooms")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Inventory
        </Button>

        <form onSubmit={handleSubmit}>
          <Card className="border-t-4 border-t-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DoorOpen className="h-5 w-5 text-primary" />
                Room Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Info Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="room_number">Room Number *</Label>
                  <Input
                    id="room_number"
                    placeholder="e.g. 201"
                    value={formData.room_number}
                    onChange={(e) =>
                      handleChange("room_number", e.target.value)
                    }
                    className={errors.room_number ? "border-destructive" : ""}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Room Type *</Label>
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
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="floor">Floor *</Label>
                  <Input
                    id="floor"
                    type="number"
                    placeholder="e.g. 2"
                    value={formData.floor}
                    onChange={(e) => handleChange("floor", e.target.value)}
                    className={errors.floor ? "border-destructive" : ""}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="base_price">Base Price (INR) *</Label>
                  <Input
                    id="base_price"
                    type="number"
                    placeholder="7500"
                    value={formData.base_price}
                    onChange={(e) => handleChange("base_price", e.target.value)}
                    className={errors.base_price ? "border-destructive" : ""}
                  />
                </div>
              </div>

              {/* Specifications Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t">
                <div className="space-y-2">
                  <Label htmlFor="max_occupancy">Max Occupancy</Label>
                  <Select
                    value={formData.max_occupancy}
                    onValueChange={(v) => handleChange("max_occupancy", v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} Persons
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="size_sqft">Size (Sq. Ft) *</Label>
                  <Input
                    id="size_sqft"
                    type="number"
                    placeholder="450"
                    value={formData.size_sqft}
                    onChange={(e) => handleChange("size_sqft", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="view_type">View Type</Label>
                  <Select
                    value={formData.view_type}
                    onValueChange={(v) => handleChange("view_type", v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="city_view">City View</SelectItem>
                      <SelectItem value="garden_view">Garden View</SelectItem>
                      <SelectItem value="sea_view">Sea View</SelectItem>
                      <SelectItem value="pool_view">Pool View</SelectItem>
                      <SelectItem value="mountain_view">
                        Mountain View
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Description Section */}
              <div className="space-y-2 pt-4 border-t">
                <Label htmlFor="description">Room Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the room amenities, features, etc..."
                  rows={4}
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/rooms")}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="hotel-button-gold px-8"
                  disabled={createRoomMutation.isPending}
                >
                  {createRoomMutation.isPending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Create Room
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </MainLayout>
  );
}
