import React, { useState, useEffect } from "react";
import { apiService } from "../../../services/api";
import PrinterProfileForm from "../../../components/settings/printer_profile/PrinterProfileForm";

// Define PrinterProfile type (can be shared)
interface PrinterProfile {
  id: string;
  name: string;
  type: "KITCHEN" | "RECEIPT" | "REPORT";
  ipAddress?: string | null;
  port?: number | null;
  isDefault: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const PrinterProfileManagementPage: React.FC = () => {
  const [profiles, setProfiles] = useState<PrinterProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentProfile, setCurrentProfile] = useState<PrinterProfile | null>(null);

  const fetchPrinterProfiles = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiService.get<PrinterProfile[]>("/settings/printer-profiles");
      setProfiles(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to fetch printer profiles");
      console.error("Error fetching printer profiles:", err);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchPrinterProfiles();
  }, []);

  const handleAddProfile = () => {
    setCurrentProfile(null);
    setIsFormOpen(true);
  };

  const handleEditProfile = (profile: PrinterProfile) => {
    setCurrentProfile(profile);
    setIsFormOpen(true);
  };

  const handleDeleteProfile = async (profileId: string) => {
    if (window.confirm("Are you sure you want to delete this printer profile?")) {
      setIsLoading(true);
      try {
        await apiService.delete(`/settings/printer-profiles/${profileId}`);
        fetchPrinterProfiles(); // Refresh list
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || "Failed to delete printer profile");
        console.error("Error deleting printer profile:", err);
      }
      setIsLoading(false);
    }
  };

  const handleFormSave = (savedProfile: PrinterProfile) => {
    fetchPrinterProfiles();
    setIsFormOpen(false);
  };

  if (isLoading && profiles.length === 0) return <p>Loading printer profiles...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Printer Profile Management</h1>
      
      <button 
        onClick={handleAddProfile}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Add New Printer Profile
      </button>

      {isFormOpen && (
        <PrinterProfileForm 
          profile={currentProfile}
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
              <th className="py-3 px-4 text-left">Type</th>
              <th className="py-3 px-4 text-left">IP Address</th>
              <th className="py-3 px-4 text-left">Port</th>
              <th className="py-3 px-4 text-left">Default</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {profiles.length === 0 && !isLoading ? (
              <tr>
                <td colSpan={6} className="py-4 px-4 text-center text-gray-500">
                  No printer profiles found. Click "Add New Printer Profile" to create one.
                </td>
              </tr>
            ) : (
              profiles.map((prof) => (
                <tr key={prof.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{prof.name}</td>
                  <td className="py-3 px-4">{prof.type}</td>
                  <td className="py-3 px-4">{prof.ipAddress || "N/A"}</td>
                  <td className="py-3 px-4">{prof.port || "N/A"}</td>
                  <td className="py-3 px-4">{prof.isDefault ? "Yes" : "No"}</td>
                  <td className="py-3 px-4">
                    <button 
                      onClick={() => handleEditProfile(prof)}
                      className="mr-2 px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
                      disabled={isLoading}
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteProfile(prof.id)}
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

export default PrinterProfileManagementPage;

