import React, { useState, useEffect } from "react";
import { apiService } from "../../../services/api";

// Define PrinterProfile type (can be shared)
interface PrinterProfile {
  id: string;
  name: string;
  type: "KITCHEN" | "RECEIPT" | "REPORT"; // Example types
  ipAddress?: string | null;
  port?: number | null;
  isDefault: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface PrinterProfileFormProps {
  profile: PrinterProfile | null;
  onClose: () => void;
  onSave: (savedProfile: PrinterProfile) => void;
}

const PrinterProfileForm: React.FC<PrinterProfileFormProps> = ({ profile, onClose, onSave }) => {
  const [name, setName] = useState("");
  const [type, setType] = useState<"KITCHEN" | "RECEIPT" | "REPORT">("RECEIPT");
  const [ipAddress, setIpAddress] = useState("");
  const [port, setPort] = useState<number | string>(""); // string for input, number for payload
  const [isDefault, setIsDefault] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setName(profile.name);
      setType(profile.type);
      setIpAddress(profile.ipAddress || "");
      setPort(profile.port?.toString() || "");
      setIsDefault(profile.isDefault);
    } else {
      setName("");
      setType("RECEIPT");
      setIpAddress("");
      setPort("");
      setIsDefault(false);
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    const payload = {
      name,
      type,
      ipAddress: ipAddress || null,
      port: port ? parseInt(port.toString(), 10) : null,
      isDefault,
    };

    if (payload.port && isNaN(payload.port)) {
        setError("Port must be a valid number.");
        setIsSaving(false);
        return;
    }

    try {
      let savedData: PrinterProfile;
      if (profile && profile.id) {
        const response = await apiService.put<PrinterProfile>(`/settings/printer-profiles/${profile.id}`, payload);
        savedData = response.data;
      } else {
        const response = await apiService.post<PrinterProfile>("/settings/printer-profiles", payload);
        savedData = response.data;
      }
      onSave(savedData);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to save printer profile");
      console.error("Error saving printer profile:", err);
    }
    setIsSaving(false);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-xl font-semibold mb-6">{profile ? "Edit Printer Profile" : "Add New Printer Profile"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Profile Name</label>
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
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">Profile Type</label>
            <select
              name="type"
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value as "KITCHEN" | "RECEIPT" | "REPORT")}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="RECEIPT">Receipt Printer</option>
              <option value="KITCHEN">Kitchen Printer</option>
              <option value="REPORT">Report Printer</option>
            </select>
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
            <label htmlFor="port" className="block text-sm font-medium text-gray-700">Port (Optional)</label>
            <input
              type="number"
              name="port"
              id="port"
              value={port}
              onChange={(e) => setPort(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={isDefault}
                onChange={(e) => setIsDefault(e.target.checked)}
                className="form-checkbox h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Set as Default Profile</span>
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
              {isSaving ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PrinterProfileForm;

