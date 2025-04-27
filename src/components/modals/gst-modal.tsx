"use client";
import { useState } from 'react';
import { Loader2, X } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import useUom from '@/hooks/use-uom';

interface UOMModalProps {
  isOpen: boolean;
  onClose: () => void;
  // onSave: (uomData: UOMData) => void;
}

export interface UOMData {
  uom: string;
  uom_short: string;
  isActive: boolean;
}

export default function UOMModal({ isOpen, onClose }: UOMModalProps) {
  const [uomData, setUomData] = useState<UOMData>({
    uom: '',
    uom_short: '',
    isActive: true,
  });
  const { loading, addUom } = useUom();

  const handleInputChange = (field: keyof UOMData, value: string | boolean) => {
    setUomData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!uomData.uom || !uomData.uom_short) {
      toast.error("Please fill in both Unit of Measure and Short Form");
      return;
    }
  
    const res = await addUom(uomData);
    console.log("res", res);
  
    if (res instanceof Error) {
      toast.error("Something went wrong");
      return;
    }
  
    if (res && 'success' in res) {
      if (res.success) {
        toast.success("Unit of Measure added successfully");
        // onSave(uomData);
        onClose();
        return;
      }
    }
  
    toast.error("Something went wrong");
  };
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white rounded-lg shadow-lg">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold text-gray-800">Add Unit of Measure</DialogTitle>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0 rounded-full"
              onClick={onClose}
            >
              <X className="h-4 w-4 text-gray-500" />
            </Button>
          </div>
          <DialogDescription className="text-gray-500">
            Configure a new unit of measure for inventory or transactions
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-5 py-4">
          <div className="grid grid-cols-2 items-center gap-4">
            <Label htmlFor="uom" className="text-gray-700">
              Unit of Measure
            </Label>
            <Input
              id="uom"
              type="text"
              value={uomData.uom}
              onChange={(e) => handleInputChange('uom', e.target.value)}
              placeholder="e.g., Kilogram"
              className="bg-gray-50 border-gray-200 focus:border-blue-400 focus:ring-blue-300"
            />
          </div>

          <div className="grid grid-cols-2 items-center gap-4">
            <Label htmlFor="uom_short" className="text-gray-700">
              Short Form
            </Label>
            <Input
              id="uom_short"
              type="text"
              value={uomData.uom_short}
              onChange={(e) => handleInputChange('uom_short', e.target.value)}
              placeholder="e.g., kg"
              className="bg-gray-50 border-gray-200 focus:border-blue-400 focus:ring-blue-300"
            />
          </div>

          <div className="flex items-center justify-between py-2">
            <Label htmlFor="active-status" className="text-gray-700">Active Status</Label>
            <Switch
              id="active-status"
              checked={uomData.isActive}
              onCheckedChange={(checked) => handleInputChange('isActive', checked)}
            />
          </div>
        </div>

        <DialogFooter className="sm:justify-end">
          <Button
            variant="outline"
            onClick={onClose}
            className="mr-2 border-gray-200 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Save Unit of Measure
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}