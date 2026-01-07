import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSettings, useResetData } from '@/contexts/AppContext';
import { Building2, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

export default function Settings() {
  const { settings } = useSettings();
  const resetData = useResetData();

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all demo data?')) {
      resetData();
      toast.success('Demo data has been reset');
    }
  };

  return (
    <MainLayout title="Settings" subtitle="Configure hotel and system settings">
      <div className="space-y-6 animate-fade-in max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />Hotel Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><Label>Hotel Name</Label><Input value={settings.name} readOnly /></div>
              <div><Label>Phone</Label><Input value={settings.phone} readOnly /></div>
              <div><Label>Email</Label><Input value={settings.email} readOnly /></div>
              <div><Label>GST Number</Label><Input value={settings.gstNumber} readOnly /></div>
            </div>
            <div><Label>Address</Label><Input value={settings.address} readOnly /></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>GST Rates</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div><Label>CGST (%)</Label><Input value={settings.gstRates.cgst} readOnly /></div>
              <div><Label>SGST (%)</Label><Input value={settings.gstRates.sgst} readOnly /></div>
              <div><Label>IGST (%)</Label><Input value={settings.gstRates.igst} readOnly /></div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-destructive/50">
          <CardHeader><CardTitle className="text-destructive">Danger Zone</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">Reset all demo data to its initial state. This action cannot be undone.</p>
            <Button variant="destructive" onClick={handleReset}>
              <RotateCcw className="h-4 w-4 mr-2" />Reset Demo Data
            </Button>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
