import React, { useState, useEffect } from "react";
import * as api from "../../services/api";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import ProductForm from "../../components/menu/ProductForm";

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]); // For dropdown in form
  const [branches, setBranches] = useState<any[]>([]); // For dropdown in form
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);

  const fetchProductsAndRelatedData = async () => {
    setLoading(true);
    try {
      const [productsResponse, categoriesResponse, branchesResponse] = await Promise.all([
        api.getProducts(),
        api.getCategories(), // Assuming you have a getBranches API endpoint
        api.getBranches() // Replace with actual API call if available, or mock for now
      ]);
      setProducts(productsResponse.data);
      setCategories(categoriesResponse.data);
      // Mock branches if API not ready, or use actual data
      setBranches(branchesResponse.data.length > 0 ? branchesResponse.data : [{id: "branch1", name: "Main Branch"}, {id: "branch2", name: "Second Branch"}]); 
      setError(null);
    } catch (err) {
      console.error("Failed to fetch data:", err);
      setError("Failed to fetch products or related data. Please try again.");
      setProducts([]);
      setCategories([]);
      setBranches([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsAndRelatedData();
  }, []);

  const handleSaveProduct = async (productData: any) => {
    try {
      if (editingProduct) {
        await api.updateProduct(editingProduct.id, productData);
      } else {
        await api.createProduct(productData);
      }
      setShowForm(false);
      setEditingProduct(null);
      fetchProductsAndRelatedData(); // Refresh list and related data
    } catch (err) {
      console.error("Failed to save product:", err);
      setError("Failed to save product. Please ensure all fields are correct and try again.");
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await api.deleteProduct(productId);
        fetchProductsAndRelatedData(); // Refresh list
      } catch (err) {
        console.error("Failed to delete product:", err);
        setError("Failed to delete product. It might be associated with other data.");
      }
    }
  };
  
  const openFormForEdit = (product: any) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const openFormForNew = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const closeForm = () => {
    setEditingProduct(null);
    setShowForm(false);
    setError(null);
  }

  if (loading && !products.length) return <DashboardLayout><div>Loading products...</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Manage Products</h1>
          <button 
            onClick={openFormForNew}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Add New Product
          </button>
        </div>

        {error && !showForm && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
            <button onClick={fetchProductsAndRelatedData} className="ml-4 text-sm text-blue-500 underline">Try Again</button>
          </div>
        )}

        {showForm && (
          <ProductForm 
            onSave={handleSaveProduct} 
            onCancel={closeForm} 
            initialData={editingProduct}
            categories={categories}
            branches={branches} // Pass branches to form
          />
        )}
        {showForm && error && (
             <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 mt-2" role="alert">
                <strong className="font-bold">Save Error: </strong>
                <span className="block sm:inline">{error}</span>
            </div>
        )}

        {!showForm && products.length === 0 && !loading && (
            <div className="text-center text-gray-500 py-10">
                <p>No products found. Click "Add New Product" to get started.</p>
            </div>
        )}

        {!showForm && products.length > 0 && (
          <div className="bg-white shadow-md rounded my-6 overflow-x-auto">
            <table className="min-w-max w-full table-auto">
              <thead>
                <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">Name (EN)</th>
                  <th className="py-3 px-6 text-left">Name (AR)</th>
                  <th className="py-3 px-6 text-left">Category</th>
                  <th className="py-3 px-6 text-right">Price</th>
                  <th className="py-3 px-6 text-left">Branch</th> 
                  <th className="py-3 px-6 text-center">Active</th>
                  <th className="py-3 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                {products.map(product => (
                  <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-100">
                    <td className="py-3 px-6 text-left whitespace-nowrap">{product.name}</td>
                    <td className="py-3 px-6 text-left whitespace-nowrap rtl" dir="rtl">{product.nameAr}</td>
                    <td className="py-3 px-6 text-left">{categories.find(c => c.id === product.categoryId)?.name || "N/A"}</td>
                    <td className="py-3 px-6 text-right">{typeof product.price === "number" ? product.price.toFixed(2) : product.price}</td>
                    <td className="py-3 px-6 text-left">{branches.find(b => b.id === product.branchId)?.name || "N/A"}</td>
                    <td className="py-3 px-6 text-center">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${product.isActive ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"}`}>
                        {product.isActive ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-center">
                      <div className="flex item-center justify-center">
                        <button 
                          onClick={() => openFormForEdit(product)}
                          className="w-5 h-5 mr-2 transform hover:text-purple-500 hover:scale-110 focus:outline-none"
                          title="Edit"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button 
                          onClick={() => handleDeleteProduct(product.id)}
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

export default ProductsPage;

