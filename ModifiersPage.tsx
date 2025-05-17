import React, { useState, useEffect } from "react";
import * as api from "../../services/api";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import ModifierForm from "../../components/menu/ModifierForm";

const ModifiersPage: React.FC = () => {
  const [modifierGroups, setModifierGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingGroup, setEditingGroup] = useState<any | null>(null);

  const fetchModifierGroups = async () => {
    setLoading(true);
    try {
      const response = await api.getModifierGroups();
      setModifierGroups(response.data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch modifier groups:", err);
      setError("Failed to fetch modifier groups. Please try again.");
      setModifierGroups([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModifierGroups();
  }, []);

  const handleSaveGroup = async (groupData: any) => {
    // Note: API for options within groups might need separate handling or be part of groupData
    try {
      if (editingGroup) {
        await api.updateModifierGroup(editingGroup.id, groupData);
      } else {
        await api.createModifierGroup(groupData);
      }
      setShowForm(false);
      setEditingGroup(null);
      fetchModifierGroups(); // Refresh list
    } catch (err) {
      console.error("Failed to save modifier group:", err);
      setError("Failed to save modifier group. Please ensure all fields are correct and try again.");
    }
  };

  const handleDeleteGroup = async (groupId: string) => {
    if (window.confirm("Are you sure you want to delete this modifier group and all its options?")) {
      try {
        await api.deleteModifierGroup(groupId);
        fetchModifierGroups(); // Refresh list
      } catch (err) {
        console.error("Failed to delete modifier group:", err);
        setError("Failed to delete modifier group. It might be in use or have dependent data.");
      }
    }
  };

  const openFormForEdit = (group: any) => {
    setEditingGroup(group);
    setShowForm(true);
  };

  const openFormForNew = () => {
    setEditingGroup(null);
    setShowForm(true);
  };
  
  const closeForm = () => {
    setEditingGroup(null);
    setShowForm(false);
    setError(null);
  }

  if (loading && !modifierGroups.length) return <DashboardLayout><div>Loading modifier groups...</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Manage Modifier Groups</h1>
          <button 
            onClick={openFormForNew}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Add New Modifier Group
          </button>
        </div>

        {error && !showForm && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
            <button onClick={fetchModifierGroups} className="ml-4 text-sm text-blue-500 underline">Try Again</button>
          </div>
        )}

        {showForm && (
          <ModifierForm 
            onSave={handleSaveGroup} 
            onCancel={closeForm} 
            initialData={editingGroup}
          />
        )}
        {showForm && error && (
             <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 mt-2" role="alert">
                <strong className="font-bold">Save Error: </strong>
                <span className="block sm:inline">{error}</span>
            </div>
        )}

        {!showForm && modifierGroups.length === 0 && !loading && (
            <div className="text-center text-gray-500 py-10">
                <p>No modifier groups found. Click "Add New Modifier Group" to get started.</p>
            </div>
        )}

        {!showForm && modifierGroups.length > 0 && (
          <div className="bg-white shadow-md rounded my-6 overflow-x-auto">
            <table className="min-w-max w-full table-auto">
              <thead>
                <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">Group Name (EN)</th>
                  <th className="py-3 px-6 text-left">Group Name (AR)</th>
                  <th className="py-3 px-6 text-center">Min</th>
                  <th className="py-3 px-6 text-center">Max</th>
                  <th className="py-3 px-6 text-left">Options</th>
                  <th className="py-3 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                {modifierGroups.map(group => (
                  <tr key={group.id} className="border-b border-gray-200 hover:bg-gray-100">
                    <td className="py-3 px-6 text-left whitespace-nowrap">{group.name}</td>
                    <td className="py-3 px-6 text-left whitespace-nowrap rtl" dir="rtl">{group.nameAr}</td>
                    <td className="py-3 px-6 text-center">{group.min}</td>
                    <td className="py-3 px-6 text-center">{group.max}</td>
                    <td className="py-3 px-6 text-left">
                      {group.options && group.options.map((opt: any) => (
                        <span key={opt.id} className="bg-gray-200 text-gray-700 py-1 px-2 rounded-full text-xs mr-1 mb-1 inline-block">
                          {opt.name} ({opt.nameAr}) - {typeof opt.priceAdjustment === "number" ? opt.priceAdjustment.toFixed(2) : opt.priceAdjustment}
                        </span>
                      ))}
                    </td>
                    <td className="py-3 px-6 text-center">
                      <div className="flex item-center justify-center">
                        <button 
                          onClick={() => openFormForEdit(group)}
                          className="w-5 h-5 mr-2 transform hover:text-purple-500 hover:scale-110 focus:outline-none"
                          title="Edit"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button 
                          onClick={() => handleDeleteGroup(group.id)}
                          className="w-5 h-5 mr-2 transform hover:text-red-500 hover:scale-110 focus:outline-none"
                          title="Delete"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ModifiersPage;

