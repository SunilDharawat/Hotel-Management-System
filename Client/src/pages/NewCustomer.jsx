import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { customersAPI } from "@/api/customers";
import { UserPlus, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function NewCustomer() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const createCustomerMutation = useMutation({
    mutationFn: (data) => customersAPI.create(data),

    onSuccess: () => {
      toast.success("Customer added successfully!");
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      navigate("/customers");
    },

    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to add customer");
    },
  });
  const [formData, setFormData] = useState({
    fullName: "",
    contactNumber: "",
    email: "",
    idProofType: "",
    idProofNumber: "",
    address: "",
    dateOfBirth: "",
    gender: "",
    roomPreference: "",
    floorPreference: "",
    specialRequests: "",
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = "Contact number is required";
    } else if (
      !/^(\+91\s?)?[6-9]\d{9}$/.test(formData.contactNumber.replace(/\s/g, ""))
    ) {
      newErrors.contactNumber = "Please enter a valid Indian mobile number";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.idProofType)
      newErrors.idProofType = "ID proof type is required";
    if (!formData.idProofNumber.trim())
      newErrors.idProofNumber = "ID proof number is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    const newCustomer = {
      id: `cust-${Date.now()}`,
      full_name: formData.fullName.trim(),
      contact_number: formData.contactNumber.trim(),
      email: formData.email.trim().toLowerCase(),
      id_proof_type: formData.idProofType,
      id_proof_number: formData.idProofNumber.trim(),
      address: formData.address.trim(),
      date_of_birth: formData.dateOfBirth || undefined,
      gender: formData.gender || undefined,
      createdAt: new Date().toISOString(),
      preferences: {
        roomType: formData.roomPreference || undefined,
        floorPreference: formData.floorPreference
          ? parseInt(formData.floorPreference)
          : undefined,
        specialRequests: formData.specialRequests.trim() || undefined,
      },
    };

    // addCustomer(newCustomer);
    // toast.success("Customer added successfully!");
    // navigate("/customers");
    createCustomerMutation.mutate(newCustomer);
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  return (
    <MainLayout title="New Customer" subtitle="Register a new guest">
      <div className="max-w-3xl mx-auto animate-fade-in">
        <Button
          variant="ghost"
          onClick={() => navigate("/customers")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Customers
        </Button>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Customer Registration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-medium mb-4 text-primary">
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => handleChange("fullName", e.target.value)}
                      placeholder="Enter full name"
                      className={errors.fullName ? "border-destructive" : ""}
                    />
                    {errors.fullName && (
                      <p className="text-sm text-destructive">
                        {errors.fullName}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactNumber">Contact Number *</Label>
                    <Input
                      id="contactNumber"
                      value={formData.contactNumber}
                      onChange={(e) =>
                        handleChange("contactNumber", e.target.value)
                      }
                      placeholder="+91 9876543210"
                      className={
                        errors.contactNumber ? "border-destructive" : ""
                      }
                    />
                    {errors.contactNumber && (
                      <p className="text-sm text-destructive">
                        {errors.contactNumber}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      placeholder="email@example.com"
                      className={errors.email ? "border-destructive" : ""}
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive">{errors.email}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) =>
                        handleChange("dateOfBirth", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(v) => handleChange("gender", v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleChange("address", e.target.value)}
                      placeholder="Enter full address"
                      rows={2}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-4 text-primary">
                  ID Proof Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="idProofType">ID Proof Type *</Label>
                    <Select
                      value={formData.idProofType}
                      onValueChange={(v) => handleChange("idProofType", v)}
                    >
                      <SelectTrigger
                        className={
                          errors.idProofType ? "border-destructive" : ""
                        }
                      >
                        <SelectValue placeholder="Select ID type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="aadhar">Aadhar Card</SelectItem>
                        <SelectItem value="pan">PAN Card</SelectItem>
                        <SelectItem value="passport">Passport</SelectItem>
                        <SelectItem value="driving_license">
                          Driving License
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.idProofType && (
                      <p className="text-sm text-destructive">
                        {errors.idProofType}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="idProofNumber">ID Proof Number *</Label>
                    <Input
                      id="idProofNumber"
                      value={formData.idProofNumber}
                      onChange={(e) =>
                        handleChange("idProofNumber", e.target.value)
                      }
                      placeholder="Enter ID number"
                      className={
                        errors.idProofNumber ? "border-destructive" : ""
                      }
                    />
                    {errors.idProofNumber && (
                      <p className="text-sm text-destructive">
                        {errors.idProofNumber}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-4 text-primary">
                  Preferences (Optional)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="roomPreference">Room Type Preference</Label>
                    <Select
                      value={formData.roomPreference}
                      onValueChange={(v) => handleChange("roomPreference", v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select room type" />
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
                    <Label htmlFor="floorPreference">Floor Preference</Label>
                    <Select
                      value={formData.floorPreference}
                      onValueChange={(v) => handleChange("floorPreference", v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select floor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Floor 1 (Ground)</SelectItem>
                        <SelectItem value="2">Floor 2</SelectItem>
                        <SelectItem value="3">Floor 3 (Premium)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="specialRequests">Special Requests</Label>
                    <Textarea
                      id="specialRequests"
                      value={formData.specialRequests}
                      onChange={(e) =>
                        handleChange("specialRequests", e.target.value)
                      }
                      placeholder="Any special requests or notes"
                      rows={2}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/customers")}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="hotel-button-gold"
                  disabled={createCustomerMutation.isPending}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  {createCustomerMutation.isPending
                    ? "Registering..."
                    : "Register Customer"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </MainLayout>
  );
}
