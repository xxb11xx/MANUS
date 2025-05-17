import React, { useState, useEffect } from 'react';

interface ModifierFormProps {
  onSave: (modifierData: any) => void;
  onCancel: () => void;
  initialData?: any | null; // For editing a ModifierGroup
  // If managing options within this form, might need more props or a separate component for options
}

const ModifierForm: React.FC<ModifierFormProps> = ({ onSave, onCancel, initialData }) => {
  const [groupName, setGroupName] = useState('');
  const [groupNameAr, setGroupNameAr] = useState('');
  const [minOptions, setMinOptions] = useState<number | string>(0);
  const [maxOptions, setMaxOptions] = useState<number | string>(1);
  const [options, setOptions] = useState<{ name: string; nameAr: string; priceAdjustment: number | string }[]>([{ name: '', nameAr: '', priceAdjustment: 0 }]);

  useEffect(() => {
    if (initialData) {
      setGroupName(initialData.name || '');
      setGroupNameAr(initialData.nameAr || '');
      setMinOptions(initialData.min !== undefined ? initialData.min : 0);
      setMaxOptions(initialData.max !== undefined ? initialData.max : 1);
      if (initialData.options && initialData.options.length > 0) {
        setOptions(initialData.options.map((opt: any) => ({ 
          name: opt.name || '', 
          nameAr: opt.nameAr || '', 
          priceAdjustment: opt.priceAdjustment !== undefined ? opt.priceAdjustment : 0 
        })));
      } else {
        setOptions([{ name: '', nameAr: '', priceAdjustment: 0 }]);
      }
    }
  }, [initialData]);

  const handleOptionChange = (index: number, field: string, value: string | number) => {
    const newOptions = [...options];
    (newOptions[index] as any)[field] = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    setOptions([...options, { name: '', nameAr: '', priceAdjustment: 0 }]);
  };

  const removeOption = (index: number) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const groupData = {
      name: groupName,
      nameAr: groupNameAr,
      min: parseInt(minOptions as string, 10),
      max: parseInt(maxOptions as string, 10),
      options: options.map(opt => ({
        ...opt,
        priceAdjustment: parseFloat(opt.priceAdjustment as string)
      }))
    };
    onSave(groupData);
  };

  return (
    <div className="bg-white p-6 rounded shadow-md mb-6">
      <h2 className="text-xl font-semibold mb-4">{initialData ? 'Edit' : 'Add New'} Modifier Group</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="groupName" className="block text-sm font-medium text-gray-700">Group Name (English)</label>
            <input type="text" id="groupName" value={groupName} onChange={(e) => setGroupName(e.target.value)} className="mt-1 block w-full input" required />
          </div>
          <div>
            <label htmlFor="groupNameAr" className="block text-sm font-medium text-gray-700">Group Name (Arabic)</label>
            <input type="text" id="groupNameAr" value={groupNameAr} onChange={(e) => setGroupNameAr(e.target.value)} className="mt-1 block w-full input rtl" dir="rtl" />
          </div>
          <div>
            <label htmlFor="minOptions" className="block text-sm font-medium text-gray-700">Min Options</label>
            <input type="number" id="minOptions" value={minOptions} onChange={(e) => setMinOptions(e.target.value)} className="mt-1 block w-full input" required />
          </div>
          <div>
            <label htmlFor="maxOptions" className="block text-sm font-medium text-gray-700">Max Options</label>
            <input type="number" id="maxOptions" value={maxOptions} onChange={(e) => setMaxOptions(e.target.value)} className="mt-1 block w-full input" required />
          </div>
        </div>

        <h3 className="text-lg font-medium text-gray-800 mb-2">Options</h3>
        {options.map((option, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3 p-3 border rounded">
            <input 
              type="text" 
              placeholder="Option Name (EN)" 
              value={option.name} 
              onChange={(e) => handleOptionChange(index, 'name', e.target.value)} 
              className="input"
              required
            />
            <input 
              type="text" 
              placeholder="Option Name (AR)" 
              value={option.nameAr} 
              onChange={(e) => handleOptionChange(index, 'nameAr', e.target.value)} 
              className="input rtl" 
              dir="rtl"
            />
            <input 
              type="number" 
              placeholder="Price Adjustment" 
              value={option.priceAdjustment} 
              onChange={(e) => handleOptionChange(index, 'priceAdjustment', e.target.value)} 
              className="input" 
              step="0.01"
              required
            />
            <button type="button" onClick={() => removeOption(index)} className="btn btn-error btn-sm self-center">Remove</button>
          </div>
        ))}
        <button type="button" onClick={addOption} className="btn btn-outline btn-sm mb-6">Add Option</button>

        <div className="flex justify-end space-x-2">
          <button type="button" onClick={onCancel} className="btn btn-ghost">Cancel</button>
          <button type="submit" className="btn btn-primary">Save Modifier Group</button>
        </div>
      </form>
    </div>
  );
};

export default ModifierForm;

