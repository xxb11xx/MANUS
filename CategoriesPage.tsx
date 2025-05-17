import React, { useState, useEffect } from 'react';
import * as api from '../../services/api'; // Assuming an API service file
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import CategoryForm from '../../components/menu/CategoryForm'; // Import the form

const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingCategory, setEditingCategory] = useState<any | null>(null);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await api.getCategories();
      setCategories(response.data); // Assuming API returns data in response.data
      setError(null);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
      setError('Failed to fetch categories. Please try again.');
      setCategories([]); // Clear categories on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSaveCategory = async (categoryData: any) => {
    try {
      if (editingCategory) {
        await api.updateCategory(editingCategory.id, categoryData);
      } else {
        await api.createCategory(categoryData);
      }
      setShowForm(false);
      setEditingCategory(null);
      fetchCategories(); // Refresh list
    } catch (err) {
      console.error("Failed to save category:", err);
      setError('Failed to save category. Please ensure all fields are correct and try again.');
      // Optionally, keep the form open if there's an error
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await api.deleteCategory(categoryId);
        fetchCategories(); // Refresh list
      } catch (err) {
        console.error("Failed to delete category:", err);
        setError('Failed to delete category. It might be in use.');
      }
    }
  };

  const openFormForEdit = (category: any) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  const openFormForNew = () => {
    setEditingCategory(null);
    setShowForm(true);
  };

  const closeForm = () => {
    setEditingCategory(null);
    setShowForm(false);
    setError(null); // Clear previous save errors when closing form
  }

  if (loading && !categories.length) return <DashboardLayout><div>Loading categories...</div></DashboardLayout>;
  // Display error prominently if it occurs
  // if (error && !showForm) return <DashboardLayout><div>Error: {error} <button onClick={fetchCategories} className="text-blue-500 underline">Try Again</button></div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Manage Categories</h1>
          <button 
            onClick={openFormForNew}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Add New Category
          </button>
        </div>

        {error && !showForm && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
            <button onClick={fetchCategories} className="ml-4 text-sm text-blue-500 underline">Try Again</button>
          </div>
        )}

        {showForm && (
          <CategoryForm 
            onSave={handleSaveCategory} 
            onCancel={closeForm} 
            initialData={editingCategory}
          />
        )}
        {/* Display error within the form if it occurs during save */}
        {showForm && error && (
             <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 mt-2" role="alert">
                <strong className="font-bold">Save Error: </strong>
                <span className="block sm:inline">{error}</span>
            </div>
        )}

        {!showForm && categories.length === 0 && !loading && (
            <div className="text-center text-gray-500 py-10">
                <p>No categories found. Click "Add New Category" to get started.</p>
            </div>
        )}

        {!showForm && categories.length > 0 && (
          <div className="bg-white shadow-md rounded my-6 overflow-x-auto">
            <table className="min-w-max w-full table-auto">
              <thead>
                <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">Name (EN)</th>
                  <th className="py-3 px-6 text-left">Name (AR)</th>
                  <th className="py-3 px-6 text-left">Description</th>
                  <th className="py-3 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                {categories.map(category => (
                  <tr key={category.id} className="border-b border-gray-200 hover:bg-gray-100">
                    <td className="py-3 px-6 text-left whitespace-nowrap">{category.name}</td>
                    <td className="py-3 px-6 text-left whitespace-nowrap rtl" dir="rtl">{category.nameAr}</td>
                    <td className="py-3 px-6 text-left">{category.description}</td>
                    <td className="py-3 px-6 text-center">
                      <div className="flex item-center justify-center">
                        <button 
                          onClick={() => openFormForEdit(category)}
                          className="w-5 h-5 mr-2 transform hover:text-purple-500 hover:scale-110 focus:outline-none"
                          title="Edit"
                        >
                           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button 
                          onClick={() => handleDeleteCategory(category.id)}
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

export default CategoriesPage;

