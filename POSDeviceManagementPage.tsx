import React, { useState, useEffect } from "react";
import { apiService } from "../../../services/api";
import POSDeviceForm from "../../../components/settings/pos_device/POSDeviceForm";

// Define types (can be shared)
interface PrinterProfile {
  id: string;
  name: string;
}

interface POSDevice {
  id: string;
  name: string;
  ipAddress?: string | null;
  branchId: string; // Assuming these are managed per branch, or globally
  branch?: { name: string }; // For display
  printerProfileId?: string | null;
  printerProfile?: PrinterProfile | null;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const POSDeviceManagementPage: React.FC = () => {
  const [devices, setDevices] = useState<POSDevice[]>([]);
  const [printerProfiles, setPrinterProfiles] = useState<PrinterProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentDevice, setCurrentDevice] = useState<POSDevice | null>(null);

  // TODO: Determine how branchId is sourced. For now, assuming a global list or a specific context.
  // For this example, we'll assume devices are not strictly filtered by a single branch on this page,
  // or that branchId is handled during creation/editing if it's a global admin page.
  const placeholderBranchId = "global_or_selected_branch_id"; // Replace with actual logic

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [devicesResponse, profilesResponse] = await Promise.all([
        apiService.get<POSDevice[]>("/settings/pos-devices"),
        apiService.get<PrinterProfile[]>("/settings/printer-profiles") // Fetch printer profiles for the form
      ]);
      setDevices(devicesResponse.data);
      setPrinterProfiles(profilesResponse.data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to fetch data");
      console.error("Error fetching data:", err);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddDevice = () => {
    setCurrentDevice(null);
    setIsFormOpen(true);
  };

  const handleEditDevice = (device: POSDevice) => {
    setCurrentDevice(device);
    setIsFormOpen(true);
  };

  const handleDeleteDevice = async (deviceId: string) => {
    if (window.confirm("Are you sure you want to delete this POS device?")) {
      setIsLoading(true);
      try {
        await apiService.delete(`/settings/pos-devices/${deviceId}`);
        fetchData(); // Refresh list
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || "Failed to delete POS device");
        console.error("Error deleting POS device:", err);
      }
      setIsLoading(false);
    }
  };

  const handleFormSave = (savedDevice: POSDevice) => {
    fetchData();
    setIsFormOpen(false);
  };

  if (isLoading && devices.length === 0 && printerProfiles.length === 0) return <p>Loading POS Devices and Printer Profiles...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">POS Device Management</h1>
      
      <button 
        onClick={handleAddDevice}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Add New POS Device
      </button>

      {isFormOpen && (
        <POSDeviceForm 
          device={currentDevice}
          branchId={currentDevice?.branchId || placeholderBranchId} // Pass branchId context
          printerProfiles={printerProfiles}
          onClose={() => setIsFormOpen(false)}
          onSave={handleFormSave}
        />
      )}

      {error && <p style={{ color: "red" }} className="mb-4">Error: {error}</p>}
      {isLoading && <p className="mb-4">Processing...</p>}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">IP Address</th>
              <th className="py-3 px-4 text-left">Branch (ID)</th> 
              <th className="py-3 px-4 text-left">Printer Profile</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {devices.length === 0 && !isLoading ? (
              <tr>
                <td colSpan={6} className="py-4 px-4 text-center text-gray-500">
                  No POS devices found. Click "Add New POS Device" to create one.
                </td>
              </tr>
            ) : (
              devices.map((dev) => (
                <tr key={dev.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{dev.name}</td>
                  <td className="py-3 px-4">{dev.ipAddress || "N/A"}</td>
                  <td className="py-3 px-4">{dev.branch?.name || dev.branchId}</td>
                  <td className="py-3 px-4">{dev.printerProfile?.name || "None"}</td>
                  <td className="py-3 px-4">{dev.isActive ? "Active" : "Inactive"}</td>
                  <td className="py-3 px-4">
                    <button 
                      onClick={() => handleEditDevice(dev)}
                      className="mr-2 px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
                      disabled={isLoading}
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteDevice(dev.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                      disabled={isLoading}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default POSDeviceManagementPage;

