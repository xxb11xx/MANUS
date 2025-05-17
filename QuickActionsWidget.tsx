import React from 'react';
import { Link } from 'react-router-dom'; // Assuming react-router-dom for navigation
import { PlusCircleIcon, ShoppingCartIcon, CogIcon, ArchiveIcon, ClipboardListIcon, UsersIcon } from '@heroicons/react/outline'; // Example icons

// Define action type
interface QuickAction {
  name: string;
  to: string;
  icon: React.ElementType;
  bgColor: string;
  textColor: string;
}

const actions: QuickAction[] = [
  {
    name: 'New Order',
    to: '/orders/new', // Or to a dedicated POS page
    icon: PlusCircleIcon,
    bgColor: 'bg-green-500',
    textColor: 'text-white',
  },
  {
    name: 'Menu Management',
    to: '/menu/categories', // Or a general menu landing page
    icon: ClipboardListIcon,
    bgColor: 'bg-blue-500',
    textColor: 'text-white',
  },
  {
    name: 'View Orders',
    to: '/orders',
    icon: ShoppingCartIcon,
    bgColor: 'bg-indigo-500',
    textColor: 'text-white',
  },
  {
    name: 'Inventory',
    to: '/inventory/stock-levels',
    icon: ArchiveIcon,
    bgColor: 'bg-yellow-500',
    textColor: 'text-white',
  },
  {
    name: 'Settings',
    to: '/settings/branches', // Or a general settings landing page
    icon: CogIcon,
    bgColor: 'bg-gray-500',
    textColor: 'text-white',
  },
  // Add more actions as needed, e.g., User Management
  // {
  //   name: 'User Management',
  //   to: '/settings/users',
  //   icon: UsersIcon,
  //   bgColor: 'bg-purple-500',
  //   textColor: 'text-white',
  // },
];

const QuickActionsWidget: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {actions.map((action) => (
          <Link
            key={action.name}
            to={action.to}
            className={`flex flex-col items-center justify-center p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 ${action.bgColor} ${action.textColor}`}
          >
            <action.icon className="h-8 w-8 mb-2" />
            <span className="text-sm font-medium text-center">{action.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default QuickActionsWidget;

