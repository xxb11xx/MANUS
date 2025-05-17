import React, { useState, useEffect } from "react";
import { apiService } from "../../../services/api";

// Define POSDevice and PrinterProfile types (can be shared)
interface PrinterProfile {
  id: string;
  name: string;
  // other fields as necessary
}

interface POSDevice {
  id: string;
  name: string;
  ipAddress?: string | null;
  branchId: string; // Assuming it's linked to a branch
  printerProfileId?: string | null;
  printerProfile?: PrinterProfile | null; // For display
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface POSDeviceFormProps {
  device: POSDevice | null;
  branchId: string; // To associate the device with a branch
  printerProfiles: PrinterProfile[]; // To select a printer profile
  onClose: () => void;
  onSave: (savedDevice: POSDevice) => void;
}

const POSDeviceForm: React.FC<POSDeviceFormProps> = ({ device, branchId, printerProfiles, onClose, onSave }) => {
  const [name, setName] = useState("");
  const [ipAddress, setIpAddress] = useState("");
  const [selectedPrinterProfileId, setSelectedPrinterProfileId] = useState<string | undefined>(undefined);
  const [isActive, setIsActive] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (device) {
      setName(device.name);
      setIpAddress(device.ipAddress || "");
      setSelectedPrinterProfileId(device.printerProfileId || undefined);
      setIsActive(device.isActive);
    } else {
      setName("");
      setIpAddress("");
      setSelectedPrinterProfileId(undefined);
      setIsActive(true);
    }
  }, [device]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    const payload = {
      name,
      ipAddress: ipAddress || null,
      branchId, // Always associate with the current branch context if applicable, or make it selectable
      printerProfileId: selectedPrinterProfileId || null,
      isActive,
    };

    try {
      let savedData: POSDevice;
      if (device && device.id) {
        const response = await apiService.put<POSDevice>(`/settings/pos-devices/${device.id}`, payload);
        savedData = response.data;
      } else {
        const response = await apiService.post<POSDevice>("/settings/pos-devices", payload);
        savedData = response.data;
      }
      onSave(savedData);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to save POS device");
      console.error("Error saving POS device:", err);
    }
    setIsSaving(false);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-xl font-semibold mb-6">{device ? "Edit POS Device" : "Add New POS Device"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Device Name</label>
            <input
              type="text"
              name="name"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="ipAddress" className="block text-sm font-medium text-gray-700">IP Address (Optional)</label>
            <input
              type="text"
              name="ipAddress"
              id="ipAddress"
              value={ipAddress}
              onChange={(e) => setIpAddress(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="printerProfileId" className="block text-sm font-medium text-gray-700">Printer Profile (Optional)</label>
            <select
              name="printerProfileId"
              id="printerProfileId"
              value={selectedPrinterProfileId || ""}
              onChange={(e) => setSelectedPrinterProfileId(e.target.value || undefined)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">None</option>
              {printerProfiles.map(profile => (
                <option key={profile.id} value={profile.id}>{profile.name}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="form-checkbox h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Device is Active</span>
            </label>
          </div>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save Device"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default POSDeviceForm;

