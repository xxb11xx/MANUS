import React, { useState, useEffect } from "react";
import { apiService } from "../../../services/api";
import TaxGroupForm from "../../../components/settings/tax_group/TaxGroupForm";

// Define Tax and TaxGroup types (can be shared)
interface Tax {
  id: string;
  name: string;
  rate: number;
  isDefault: boolean; // Usually a tax itself isn't default, but a tax group can be.
  // ZATCA related fields if applicable at the tax level
  taxType?: string; // e.g., VAT, Excise
  taxSubType?: string; // e.g., Standard, ZeroRated, Exempt
  reasonCode?: string; // For ZATCA e-invoicing if applicable
  reasonText?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface TaxGroup {
  id: string;
  name: string;
  nameAr: string;
  taxes: Tax[];
  isDefault: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const TaxGroupManagementPage: React.FC = () => {
  const [taxGroups, setTaxGroups] = useState<TaxGroup[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentTaxGroup, setCurrentTaxGroup] = useState<TaxGroup | null>(null);

  const fetchTaxGroups = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiService.get<TaxGroup[]>("/settings/tax-groups");
      setTaxGroups(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to fetch tax groups");
      console.error("Error fetching tax groups:", err);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchTaxGroups();
  }, []);

  const handleAddTaxGroup = () => {
    setCurrentTaxGroup(null);
    setIsFormOpen(true);
  };

  const handleEditTaxGroup = (taxGroup: TaxGroup) => {
    setCurrentTaxGroup(taxGroup);
    setIsFormOpen(true);
  };

  const handleDeleteTaxGroup = async (taxGroupId: string) => {
    if (window.confirm("Are you sure you want to delete this tax group?")) {
      setIsLoading(true);
      try {
        await apiService.delete(`/settings/tax-groups/${taxGroupId}`);
        fetchTaxGroups(); // Refresh list
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || "Failed to delete tax group");
        console.error("Error deleting tax group:", err);
      }
      setIsLoading(false);
    }
  };

  const handleFormSave = (savedTaxGroup: TaxGroup) => {
    fetchTaxGroups();
    setIsFormOpen(false);
  };

  if (isLoading && taxGroups.length === 0) return <p>Loading tax groups...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Tax Group Management</h1>
      
      <button 
        onClick={handleAddTaxGroup}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Add New Tax Group
      </button>

      {isFormOpen && (
        <TaxGroupForm 
          taxGroup={currentTaxGroup}
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
              <th className="py-3 px-4 text-left">Name (English)</th>
              <th className="py-3 px-4 text-left">Name (Arabic)</th>
              <th className="py-3 px-4 text-left">Default</th>
              <th className="py-3 px-4 text-left">Taxes Count</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {taxGroups.length === 0 && !isLoading ? (
              <tr>
                <td colSpan={5} className="py-4 px-4 text-center text-gray-500">
                  No tax groups found. Click "Add New Tax Group" to create one.
                </td>
              </tr>
            ) : (
              taxGroups.map((group) => (
                <tr key={group.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{group.name}</td>
                  <td className="py-3 px-4">{group.nameAr}</td>
                  <td className="py-3 px-4">{group.isDefault ? "Yes" : "No"}</td>
                  <td className="py-3 px-4">{group.taxes?.length || 0}</td>
                  <td className="py-3 px-4">
                    <button 
                      onClick={() => handleEditTaxGroup(group)}
                      className="mr-2 px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
                      disabled={isLoading}
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteTaxGroup(group.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                      disabled={isLoading}
                    >
                      Delete
                    </button>
                    {/* TODO: Add a button/link to manage individual taxes within this group */}
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

export default TaxGroupManagementPage;

