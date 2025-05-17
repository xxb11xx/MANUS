import { useState, useMemo } from 'react';

export type SortOrder = 'asc' | 'desc' | null;

export interface SortConfig<T> {
  key: keyof T | string;
  order: SortOrder;
}

export const useSortableTable = <T extends object>(initialData: T[], initialSortConfig: SortConfig<T> | null = null) => {
  const [sortConfig, setSortConfig] = useState<SortConfig<T> | null>(initialSortConfig);

  const sortedData = useMemo(() => {
    if (!sortConfig || !sortConfig.key || !sortConfig.order) {
      return initialData;
    }

    const dataCopy = [...initialData];

    dataCopy.sort((a, b) => {
      const aValue = a[sortConfig.key as keyof T];
      const bValue = b[sortConfig.key as keyof T];

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.order === 'asc' ? aValue - bValue : bValue - aValue;
      }
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.order === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }
      // Add more type handling (e.g., dates) if needed
      // Fallback for other types or mixed types (treat as strings)
      const stringA = String(aValue).toLowerCase();
      const stringB = String(bValue).toLowerCase();
      return sortConfig.order === 'asc' ? stringA.localeCompare(stringB) : stringB.localeCompare(stringA);
    });
    return dataCopy;
  }, [initialData, sortConfig]);

  const requestSort = (key: keyof T | string) => {
    let order: SortOrder = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.order === 'asc') {
      order = 'desc';
    } else if (sortConfig && sortConfig.key === key && sortConfig.order === 'desc') {
      order = null; // Optional: third click removes sort or cycles back to asc
    } // If order is null, it will default to 'asc' on next click due to the first condition
    setSortConfig({ key, order });
  };

  return { sortedData, requestSort, sortConfig };
};

