import React, { useState, useEffect } from 'react';

interface ProductFormProps {
  onSave: (productData: any) => void;
  onCancel: () => void;
  initialData?: any | null;
  categories?: any[]; // To populate category dropdown
  branches?: any[]; // To populate branch dropdown
}

const ProductForm: React.FC<ProductFormProps> = ({ onSave, onCancel, initialData, categories = [], branches = [] }) => {
  const [name, setName] = useState('');
  const [nameAr, setNameAr] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | string>('');
  const [sku, setSku] = useState('');
  const [barcode, setBarcode] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [categoryId, setCategoryId] = useState('');
  const [branchId, setBranchId] = useState('');
  // const [inventoryLevel, setInventoryLevel] = useState<number | string>(0);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setNameAr(initialData.nameAr || '');
      setDescription(initialData.description || '');
      setPrice(initialData.price || '');
      setSku(initialData.sku || '');
      setBarcode(initialData.barcode || '');
      setIsActive(initialData.isActive !== undefined ? initialData.isActive : true);
      setCategoryId(initialData.categoryId || '');
      setBranchId(initialData.branchId || '');
      // setInventoryLevel(initialData.inventoryLevel || 0);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      nameAr,
      description,
      price: parseFloat(price as string),
      sku,
      barcode,
      isActive,
      categoryId,
      branchId,
      // inventoryLevel: parseInt(inventoryLevel as string, 10),
    });
  };

  return (
    <div className="bg-white p-6 rounded shadow-md mb-6">
      <h2 className="text-xl font-semibold mb-4">{initialData ? 'Edit' : 'Add New'} Product</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name (English)</label>
            <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full input" required />
          </div>
          <div>
            <label htmlFor="nameAr" className="block text-sm font-medium text-gray-700">Name (Arabic)</label>
            <input type="text" id="nameAr" value={nameAr} onChange={(e) => setNameAr(e.target.value)} className="mt-1 block w-full input rtl" dir="rtl" />
          </div>
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
            <input type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)} className="mt-1 block w-full input" required step="0.01" />
          </div>
          <div>
            <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">Category</label>
            <select id="categoryId" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="mt-1 block w-full select" required>
              <option value="">Select Category</option>
              {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="branchId" className="block text-sm font-medium text-gray-700">Branch</label>
            <select id="branchId" value={branchId} onChange={(e) => setBranchId(e.target.value)} className="mt-1 block w-full select" required>
              <option value="">Select Branch</option>
              {branches.map(branch => <option key={branch.id} value={branch.id}>{branch.name}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="sku" className="block text-sm font-medium text-gray-700">SKU</label>
            <input type="text" id="sku" value={sku} onChange={(e) => setSku(e.target.value)} className="mt-1 block w-full input" />
          </div>
          <div>
            <label htmlFor="barcode" className="block text-sm font-medium text-gray-700">Barcode</label>
            <input type="text" id="barcode" value={barcode} onChange={(e) => setBarcode(e.target.value)} className="mt-1 block w-full input" />
          </div>
          {/* <div>
            <label htmlFor="inventoryLevel" className="block text-sm font-medium text-gray-700">Inventory Level</label>
            <input type="number" id="inventoryLevel" value={inventoryLevel} onChange={(e) => setInventoryLevel(e.target.value)} className="mt-1 block w-full input" />
          </div> */}
          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="mt-1 block w-full textarea" />
          </div>
          <div className="md:col-span-2 flex items-center">
            <input type="checkbox" id="isActive" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">Is Active</label>
          </div>
        </div>
        <div className="flex justify-end space-x-2 mt-6">
          <button type="button" onClick={onCancel} className="btn btn-ghost">Cancel</button>
          <button type="submit" className="btn btn-primary">Save Product</button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;

