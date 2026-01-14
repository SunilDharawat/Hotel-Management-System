// import { MainLayout } from "@/components/layout/MainLayout";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Building2, RotateCcw } from "lucide-react";
// import { toast } from "sonner";
// import { useQuery } from "@tanstack/react-query";
// import { settingsAPI } from "@/api/settings";

// export default function Settings() {
//   const { data: settings, isLoading: settingsLoading } = useQuery({
//     queryKey: ["settings"],
//     queryFn: () => settingsAPI.getAll(),
//   });
//   console.log(settings, "d");

//   const resetData = useResetData();

//   const handleReset = () => {
//     if (confirm("Are you sure you want to reset all demo data?")) {
//       resetData();
//       toast.success("Demo data has been reset");
//     }
//   };

//   return (
//     <MainLayout title="Settings" subtitle="Configure hotel and system settings">
//       <div className="space-y-6 animate-fade-in max-w-4xl">
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Building2 className="h-5 w-5" />
//               Hotel Information
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <Label className="mb-2">Hotel Name</Label>
//                 <Input value={settings.name} readOnly />
//               </div>
//               <div>
//                 <Label>Phone</Label>
//                 <Input value={settings.phone} readOnly />
//               </div>
//               <div>
//                 <Label>Email</Label>
//                 <Input value={settings.email} readOnly />
//               </div>
//               <div>
//                 <Label>GST Number</Label>
//                 <Input value={settings.gstNumber} readOnly />
//               </div>
//             </div>
//             <div>
//               <Label>Address</Label>
//               <Input value={settings.address} readOnly />
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle>GST Rates</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="grid grid-cols-3 gap-4">
//               <div>
//                 <Label>CGST (%)</Label>
//                 <Input value={settings.gstRates.cgst} readOnly />
//               </div>
//               <div>
//                 <Label>SGST (%)</Label>
//                 <Input value={settings.gstRates.sgst} readOnly />
//               </div>
//               <div>
//                 <Label>IGST (%)</Label>
//                 <Input value={settings.gstRates.igst} readOnly />
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="border-destructive/50">
//           <CardHeader>
//             <CardTitle className="text-destructive">Danger Zone</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <p className="text-sm text-muted-foreground mb-4">
//               Reset all demo data to its initial state. This action cannot be
//               undone.
//             </p>
//             <Button variant="destructive" onClick={handleReset}>
//               <RotateCcw className="h-4 w-4 mr-2" />
//               Reset Demo Data
//             </Button>
//           </CardContent>
//         </Card>
//       </div>
//     </MainLayout>
//   );
// }

import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Building2,
  RotateCcw,
  Save,
  DollarSign,
  FileText,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import {
  useSettings,
  useUpdateMultipleSettings,
  useResetSettings,
} from "@/hooks/useSettings";

export default function Settings() {
  const { data: settings, isLoading, error } = useSettings();
  const updateSettingsMutation = useUpdateMultipleSettings();
  const resetSettingsMutation = useResetSettings();

  // Local state for form
  const [generalForm, setGeneralForm] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    gst_number: "",
  });

  const [gstRatesForm, setGstRatesForm] = useState({
    cgst: 6,
    sgst: 6,
    igst: 12,
  });

  const [roomPricingForm, setRoomPricingForm] = useState({
    single: 2500,
    double: 4000,
    suite: 7500,
    deluxe: 10000,
  });

  const [policiesForm, setPoliciesForm] = useState({
    cancellation_hours: 24,
    late_checkout_charge: 500,
    early_checkout_refund_percent: 10,
  });

  const [showResetDialog, setShowResetDialog] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Load settings into form when data is available
  useEffect(() => {
    if (settings) {
      if (settings.general) {
        setGeneralForm(settings.general);
      }
      if (settings.gst_rates) {
        setGstRatesForm(settings.gst_rates);
      }
      if (settings.room_pricing) {
        setRoomPricingForm(settings.room_pricing);
      }
      if (settings.policies) {
        setPoliciesForm(settings.policies);
      }
    }
  }, [settings]);

  // Track changes
  useEffect(() => {
    if (!settings) return;

    const changed =
      JSON.stringify(generalForm) !== JSON.stringify(settings.general || {}) ||
      JSON.stringify(gstRatesForm) !==
        JSON.stringify(settings.gst_rates || {}) ||
      JSON.stringify(roomPricingForm) !==
        JSON.stringify(settings.room_pricing || {}) ||
      JSON.stringify(policiesForm) !== JSON.stringify(settings.policies || {});

    setHasChanges(changed);
  }, [generalForm, gstRatesForm, roomPricingForm, policiesForm, settings]);

  const handleSaveAll = async () => {
    try {
      await updateSettingsMutation.mutateAsync({
        general: generalForm,
        gst_rates: gstRatesForm,
        room_pricing: roomPricingForm,
        policies: policiesForm,
      });
      setHasChanges(false);
    } catch (error) {
      // Error handled in mutation
    }
  };

  const handleReset = async () => {
    try {
      await resetSettingsMutation.mutateAsync();
      setShowResetDialog(false);
    } catch (error) {
      // Error handled in mutation
    }
  };

  const handleCancel = () => {
    if (settings) {
      setGeneralForm(settings.general || {});
      setGstRatesForm(settings.gst_rates || {});
      setRoomPricingForm(settings.room_pricing || {});
      setPoliciesForm(settings.policies || {});
      setHasChanges(false);
      toast.info("Changes discarded");
    }
  };

  if (isLoading) {
    return (
      <MainLayout
        title="Settings"
        subtitle="Configure hotel and system settings"
      >
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
            <p className="text-muted-foreground">Loading settings...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout
        title="Settings"
        subtitle="Configure hotel and system settings"
      >
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <AlertCircle className="h-12 w-12 text-red-600 mx-auto" />
            <div>
              <h3 className="text-lg font-semibold text-red-600">
                Failed to load settings
              </h3>
              <p className="text-muted-foreground">{error.message}</p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Settings" subtitle="Configure hotel and system settings">
      <div className="space-y-6 animate-fade-in max-w-5xl">
        {/* Action Buttons */}
        {hasChanges && (
          <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border rounded-lg p-4 shadow-lg">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                You have unsaved changes
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={updateSettingsMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveAll}
                  disabled={updateSettingsMutation.isPending}
                >
                  {updateSettingsMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save All Changes
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">
              <Building2 className="h-4 w-4 mr-2" />
              General
            </TabsTrigger>
            <TabsTrigger value="pricing">
              <DollarSign className="h-4 w-4 mr-2" />
              Pricing
            </TabsTrigger>
            <TabsTrigger value="gst">
              <FileText className="h-4 w-4 mr-2" />
              GST
            </TabsTrigger>
            <TabsTrigger value="policies">
              <FileText className="h-4 w-4 mr-2" />
              Policies
            </TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Hotel Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="mb-2" htmlFor="name">
                      Hotel Name *
                    </Label>
                    <Input
                      id="name"
                      value={generalForm.name}
                      onChange={(e) =>
                        setGeneralForm({ ...generalForm, name: e.target.value })
                      }
                      placeholder="Enter hotel name"
                    />
                  </div>
                  <div>
                    <Label className="mb-2" htmlFor="phone">
                      Phone Number *
                    </Label>
                    <Input
                      id="phone"
                      value={generalForm.phone}
                      onChange={(e) =>
                        setGeneralForm({
                          ...generalForm,
                          phone: e.target.value,
                        })
                      }
                      placeholder="+91-9876543210"
                    />
                  </div>
                  <div>
                    <Label className="mb-2" htmlFor="email">
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={generalForm.email}
                      onChange={(e) =>
                        setGeneralForm({
                          ...generalForm,
                          email: e.target.value,
                        })
                      }
                      placeholder="info@hotel.com"
                    />
                  </div>
                  <div>
                    <Label className="mb-2" htmlFor="gst_number">
                      GST Number *
                    </Label>
                    <Input
                      id="gst_number"
                      value={generalForm.gst_number}
                      onChange={(e) =>
                        setGeneralForm({
                          ...generalForm,
                          gst_number: e.target.value.toUpperCase(),
                        })
                      }
                      placeholder="29ABCDE1234F1Z5"
                      maxLength={15}
                    />
                  </div>
                </div>
                <div>
                  <Label className="mb-2" htmlFor="address">
                    Address *
                  </Label>
                  <Input
                    id="address"
                    value={generalForm.address}
                    onChange={(e) =>
                      setGeneralForm({
                        ...generalForm,
                        address: e.target.value,
                      })
                    }
                    placeholder="Enter hotel address"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Room Pricing */}
          <TabsContent value="pricing" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Base Room Pricing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="mb-2" htmlFor="single">
                      Single Room (₹)
                    </Label>
                    <Input
                      id="single"
                      type="number"
                      min="0"
                      value={roomPricingForm.single}
                      onChange={(e) =>
                        setRoomPricingForm({
                          ...roomPricingForm,
                          single: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label className="mb-2" htmlFor="double">
                      Double Room (₹)
                    </Label>
                    <Input
                      id="double"
                      type="number"
                      min="0"
                      value={roomPricingForm.double}
                      onChange={(e) =>
                        setRoomPricingForm({
                          ...roomPricingForm,
                          double: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label className="mb-2" htmlFor="suite">
                      Suite (₹)
                    </Label>
                    <Input
                      id="suite"
                      type="number"
                      min="0"
                      value={roomPricingForm.suite}
                      onChange={(e) =>
                        setRoomPricingForm({
                          ...roomPricingForm,
                          suite: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label className="mb-2" htmlFor="deluxe">
                      Deluxe Room (₹)
                    </Label>
                    <Input
                      id="deluxe"
                      type="number"
                      min="0"
                      value={roomPricingForm.deluxe}
                      onChange={(e) =>
                        setRoomPricingForm({
                          ...roomPricingForm,
                          deluxe: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* GST Rates */}
          <TabsContent value="gst" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  GST Rates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="mb-2" htmlFor="cgst">
                      CGST (%)
                    </Label>
                    <Input
                      id="cgst"
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={gstRatesForm.cgst}
                      onChange={(e) =>
                        setGstRatesForm({
                          ...gstRatesForm,
                          cgst: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label className="mb-2" htmlFor="sgst">
                      SGST (%)
                    </Label>
                    <Input
                      id="sgst"
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={gstRatesForm.sgst}
                      onChange={(e) =>
                        setGstRatesForm({
                          ...gstRatesForm,
                          sgst: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label className="mb-2" htmlFor="igst">
                      IGST (%)
                    </Label>
                    <Input
                      id="igst"
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={gstRatesForm.igst}
                      onChange={(e) =>
                        setGstRatesForm({
                          ...gstRatesForm,
                          igst: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  Total GST: {gstRatesForm.cgst + gstRatesForm.sgst}%
                  (Intra-state) or {gstRatesForm.igst}% (Inter-state)
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Policies */}
          <TabsContent value="policies" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Hotel Policies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="mb-2" htmlFor="cancellation_hours">
                      Cancellation Notice (hours)
                    </Label>
                    <Input
                      id="cancellation_hours"
                      type="number"
                      min="0"
                      value={policiesForm.cancellation_hours}
                      onChange={(e) =>
                        setPoliciesForm({
                          ...policiesForm,
                          cancellation_hours: parseInt(e.target.value) || 0,
                        })
                      }
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Minimum hours before check-in to cancel
                    </p>
                  </div>
                  <div>
                    <Label className="mb-2" htmlFor="late_checkout_charge">
                      Late Checkout Charge (₹)
                    </Label>
                    <Input
                      id="late_checkout_charge"
                      type="number"
                      min="0"
                      value={policiesForm.late_checkout_charge}
                      onChange={(e) =>
                        setPoliciesForm({
                          ...policiesForm,
                          late_checkout_charge: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Additional charge for late checkout
                    </p>
                  </div>
                  <div>
                    <Label
                      className="mb-2"
                      htmlFor="early_checkout_refund_percent"
                    >
                      Early Checkout Refund (%)
                    </Label>
                    <Input
                      id="early_checkout_refund_percent"
                      type="number"
                      min="0"
                      max="100"
                      value={policiesForm.early_checkout_refund_percent}
                      onChange={(e) =>
                        setPoliciesForm({
                          ...policiesForm,
                          early_checkout_refund_percent:
                            parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Refund percentage for early checkout
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Danger Zone */}
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Reset all settings to their default values. This action cannot be
              undone.
            </p>
            <Button
              variant="destructive"
              onClick={() => setShowResetDialog(true)}
              disabled={resetSettingsMutation.isPending}
            >
              {resetSettingsMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Resetting...
                </>
              ) : (
                <>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset to Defaults
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Reset Confirmation Dialog */}
      <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will reset all settings to their default values. Any custom
              configurations will be lost. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReset}
              className="bg-destructive hover:bg-destructive/90"
            >
              Reset Settings
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
}
