import React, { useState, useEffect } from "react";
import { apiService } from "../../../services/api"; // Assuming apiService is set up

// Define Branch type based on Prisma schema (can be shared in a types file)
interface Branch {
  id: string;
  name: string;
  nameAr: string;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  createdAt?: Date; // Optional on create
  updatedAt?: Date; // Optional on create
}

interface BranchFormProps {
  branch: Branch | null; // null for add mode, existing branch for edit mode
  onClose: () => void;
  onSave: (savedBranch: Branch) => void;
}

const BranchForm: React.FC<BranchFormProps> = ({ branch, onClose, onSave }) => {
  const [formData, setFormData] = useState<Partial<Branch>>({
    name: "",
    nameAr: "",
    phone: "",
    address: "",
    city: "",
    country: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (branch) {
      setFormData({
        name: branch.name,
        nameAr: branch.nameAr,
        phone: branch.phone || "",
        address: branch.address || "",
        city: branch.city || "",
        country: branch.country || "",
      });
    } else {
      setFormData({
        name: "",
        nameAr: "",
        phone: "",
        address: "",
        city: "",
        country: "",
      });
    }
  }, [branch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      let savedBranchData: Branch;
      if (branch && branch.id) {
        // Edit mode
        const response = await apiService.put<Branch>(`/settings/branches/${branch.id}`, formData);
        savedBranchData = response.data;
      } else {
        // Add mode
        const response = await apiService.post<Branch>("/settings/branches", formData);
        savedBranchData = response.data;
      }
      onSave(savedBranchData);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to save branch");
      console.error("Error saving branch:", err);
    }
    setIsSaving(false);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-xl font-semibold mb-6">{branch ? "Edit Branch" : "Add New Branch"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name (English)</label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name || ""}
              onChange={handleChange}
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
              value={formData.nameAr || ""}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rtl-input"
              dir="rtl"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="text"
              name="phone"
              id="phone"
              value={formData.phone || ""}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
            <textarea
              name="address"
              id="address"
              value={formData.address || ""}
              onChange={handleChange}
              rows={3}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
            <input
              type="text"
              name="city"
              id="city"
              value={formData.city || ""}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
            <input
              type="text"
              name="country"
              id="country"
              value={formData.country || ""}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
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
              {isSaving ? "Saving..." : "Save Branch"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BranchForm;

