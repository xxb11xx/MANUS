import axios from "axios"; // We will need to install axios or use fetch

const API_BASE_URL = "/api/v1"; // Adjust if your backend runs on a different port during development

// Helper function for API requests
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    // Add authorization header if/when JWT is implemented
    // "Authorization": `Bearer ${localStorage.getItem("token")}`
  },
});

// Category API calls
export const getCategories = () => apiClient.get("/menu/categories");
export const getCategoryById = (id: string) => apiClient.get(`/menu/categories/${id}`);
export const createCategory = (categoryData: any) => apiClient.post("/menu/categories", categoryData);
export const updateCategory = (id: string, categoryData: any) => apiClient.put(`/menu/categories/${id}`, categoryData);
export const deleteCategory = (id: string) => apiClient.delete(`/menu/categories/${id}`);

// Product API calls
export const getProducts = () => apiClient.get("/menu/products");
export const getProductById = (id: string) => apiClient.get(`/menu/products/${id}`);
export const createProduct = (productData: any) => apiClient.post("/menu/products", productData);
export const updateProduct = (id: string, productData: any) => apiClient.put(`/menu/products/${id}`, productData);
export const deleteProduct = (id: string) => apiClient.delete(`/menu/products/${id}`);

// ModifierGroup API calls
export const getModifierGroups = () => apiClient.get("/menu/modifiers/groups");
export const getModifierGroupById = (id: string) => apiClient.get(`/menu/modifiers/groups/${id}`);
export const createModifierGroup = (groupData: any) => apiClient.post("/menu/modifiers/groups", groupData);
export const updateModifierGroup = (id: string, groupData: any) => apiClient.put(`/menu/modifiers/groups/${id}`, groupData);
export const deleteModifierGroup = (id: string) => apiClient.delete(`/menu/modifiers/groups/${id}`);

// ModifierOption API calls (assuming they are nested or managed separately)
// These might need adjustment based on how ModifierOptions are actually handled by the API (e.g., nested under groups)
export const createModifierOption = (optionData: any) => apiClient.post("/menu/modifiers/options", optionData);
export const getModifierOptionById = (id: string) => apiClient.get(`/menu/modifiers/options/${id}`);
export const updateModifierOption = (id: string, optionData: any) => apiClient.put(`/menu/modifiers/options/${id}`, optionData);
export const deleteModifierOption = (id: string) => apiClient.delete(`/menu/modifiers/options/${id}`);

// Auth API calls (example)
export const login = (credentials: any) => apiClient.post("/auth/login", credentials);
export const register = (userData: any) => apiClient.post("/auth/register", userData);
export const getProfile = () => apiClient.get("/auth/profile");

export default apiClient;

