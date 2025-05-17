import React, { useState } from 'react';
import { Eye, EyeOff, Columns } from 'lucide-react';

export interface ColumnConfig<T> {
  key: keyof T | string; // Allow string for custom keys not directly in T
  header: string;
  isVisible: boolean;
}

interface ColumnVisibilityToggleProps<T> {
  columns: ColumnConfig<T>[];
  onVisibilityChange: (updatedColumns: ColumnConfig<T>[]) => void;
}

const ColumnVisibilityToggle = <T extends object>({ columns, onVisibilityChange }: ColumnVisibilityToggleProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = (key: keyof T | string) => {
    const updated = columns.map(col =>
      col.key === key ? { ...col, isVisible: !col.isVisible } : col
    );
    onVisibilityChange(updated);
  };

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
          onClick={() => setIsOpen(!isOpen)}
          aria-haspopup="true"
          aria-expanded={isOpen}
        >
          <Columns className="mr-2 h-5 w-5" />
          Columns
        </button>
      </div>

      {isOpen && (
        <div
          className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
        >
          <div className="py-1" role="none">
            {columns.map((col) => (
              <button
                key={String(col.key)}
                onClick={() => handleToggle(col.key)}
                className={`${col.isVisible ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700'
                  } group flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 hover:text-gray-900`}
                role="menuitem"
              >
                {col.isVisible ? (
                  <Eye className="mr-3 h-5 w-5 text-indigo-600" aria-hidden="true" />
                ) : (
                  <EyeOff className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
                )}
                {col.header}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ColumnVisibilityToggle;

