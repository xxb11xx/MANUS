import React, { useState, useEffect } from "react";
import { apiService } from "../../../services/api"; // Assuming apiService is set up
import BranchForm from "../../../components/settings/branch/BranchForm"; // Import BranchForm

// Define Branch type based on Prisma schema
interface Branch {
  id: string;
  name: string;
  nameAr: string;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const BranchManagementPage: React.FC = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentBranch, setCurrentBranch] = useState<Branch | null>(null);

  const fetchBranches = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiService.get<Branch[]>("/settings/branches");
      setBranches(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to fetch branches");
      console.error("Error fetching branches:", err);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const handleAddBranch = () => {
    setCurrentBranch(null);
    setIsFormOpen(true);
  };

  const handleEditBranch = (branch: Branch) => {
    setCurrentBranch(branch);
    setIsFormOpen(true);
  };

  const handleDeleteBranch = async (branchId: string) => {
    if (window.confirm("Are you sure you want to delete this branch?")) {
      setIsLoading(true); // Or a specific deleting state
      try {
        await apiService.delete(`/settings/branches/${branchId}`);
        fetchBranches(); // Refresh the list
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || "Failed to delete branch");
        console.error("Error deleting branch:", err);
      }
      setIsLoading(false);
    }
  };

  const handleFormSave = (savedBranch: Branch) => {
    fetchBranches();
    setIsFormOpen(false);
  };

  if (isLoading && branches.length === 0) return <p>Loading branches...</p>;
  // Keep displaying table even when loading for delete/save for better UX

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Branch Management</h1>
      
      <button 
        onClick={handleAddBranch}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Add New Branch
      </button>

      {isFormOpen && (
        <BranchForm 
          branch={currentBranch}
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
              <th className="py-3 px-4 text-left">Phone</th>
              <th className="py-3 px-4 text-left">Address</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {branches.length === 0 && !isLoading ? (
              <tr>
                <td colSpan={5} className="py-4 px-4 text-center text-gray-500">
                  No branches found. Click "Add New Branch" to create one.
                </td>
              </tr>
            ) : (
              branches.map((branch) => (
                <tr key={branch.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{branch.name}</td>
                  <td className="py-3 px-4">{branch.nameAr}</td>
                  <td className="py-3 px-4">{branch.phone || "N/A"}</td>
                  <td className="py-3 px-4">{branch.address || "N/A"}</td>
                  <td className="py-3 px-4">
                    <button 
                      onClick={() => handleEditBranch(branch)}
                      className="mr-2 px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
                      disabled={isLoading}
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteBranch(branch.id)}
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

export default BranchManagementPage;

