import React, { useState, useEffect } from "react";
import { apiService } from "../../../services/api";

// Define TaxGroup type based on Prisma schema
interface Tax {
  id: string;
  name: string;
  rate: number; // Percentage
  isDefault: boolean;
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

interface TaxGroupFormProps {
  taxGroup: TaxGroup | null;
  onClose: () => void;
  onSave: (savedTaxGroup: TaxGroup) => void;
}

const TaxGroupForm: React.FC<TaxGroupFormProps> = ({ taxGroup, onClose, onSave }) => {
  const [name, setName] = useState("");
  const [nameAr, setNameAr] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  // For simplicity, managing taxes within a tax group will be a TODO for detailed implementation
  // const [taxes, setTaxes] = useState<Partial<Tax>[]>([]); 
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (taxGroup) {
      setName(taxGroup.name);
      setNameAr(taxGroup.nameAr);
      setIsDefault(taxGroup.isDefault);
      // setTaxes(taxGroup.taxes.map(t => ({ ...t }))); // If managing taxes directly
    } else {
      setName("");
      setNameAr("");
      setIsDefault(false);
      // setTaxes([]);
    }
  }, [taxGroup]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    const payload = {
      name,
      nameAr,
      isDefault,
      // taxes: taxes.filter(t => t.name && t.rate != null), // Filter out incomplete taxes if managed here
    };

    try {
      let savedData: TaxGroup;
      if (taxGroup && taxGroup.id) {
        const response = await apiService.put<TaxGroup>(`/settings/tax-groups/${taxGroup.id}`, payload);
        savedData = response.data;
      } else {
        const response = await apiService.post<TaxGroup>("/settings/tax-groups", payload);
        savedData = response.data;
      }
      onSave(savedData);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to save tax group");
      console.error("Error saving tax group:", err);
    }
    setIsSaving(false);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-6">{taxGroup ? "Edit Tax Group" : "Add New Tax Group"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name (English)</label>
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
            <label htmlFor="nameAr" className="block text-sm font-medium text-gray-700">Name (Arabic)</label>
            <input
              type="text"
              name="nameAr"
              id="nameAr"
              value={nameAr}
              onChange={(e) => setNameAr(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rtl-input"
              dir="rtl"
              required
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
              <span className="ml-2 text-sm text-gray-700">Set as Default Tax Group</span>
            </label>
          </div>
          
          {/* TODO: Implement UI for managing individual taxes within the group */}
          <p className="text-sm text-gray-500 mb-4">Note: Management of individual taxes within this group (e.g., VAT 15%) will be handled in a more detailed view or a separate component. This form covers the group creation/editing.</p>

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
              {isSaving ? "Saving..." : "Save Tax Group"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaxGroupForm;

