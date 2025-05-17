import React from 'react';
import ClonedOrdersWidget from '../../components/dashboard/ClonedOrdersWidget';
import ClonedNetSalesWidget from '../../components/dashboard/ClonedNetSalesWidget';
import ClonedNetPaymentsWidget from '../../components/dashboard/ClonedNetPaymentsWidget';
import ClonedReturnAmountWidget from '../../components/dashboard/ClonedReturnAmountWidget';
import ClonedDiscountAmountWidget from '../../components/dashboard/ClonedDiscountAmountWidget';
import ClonedOrderTypesWidget from '../../components/dashboard/ClonedOrderTypesWidget';

// TODO: Implement proper tab handling and conditional rendering based on active tab
const ClonedDashboardPage: React.FC = () => {
  const activeTab = 'General'; // Default to General tab for now

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-gray-100 min-h-screen">
      {/* Welcome Message and Top Controls (Search, Notifications etc. - These would typically be part of a shared Header component) */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Welcome, 2M</h1> {/* As per screenshot */}
        {/* Tab Navigation */}
        <div className="mt-4 border-b border-gray-300">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {['General', 'Branches', 'Inventory', 'Kitchen'].map((tabName) => (
              <a
                key={tabName}
                href="#" // Replace with actual routing later
                className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm 
                  ${activeTab === tabName
                    ? 'border-purple-600 text-purple-700'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                `}
              >
                {tabName}
                {tabName === 'Kitchen' && (
                  <span className="ml-2 inline-block py-0.5 px-2.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                    New
                  </span>
                )}
              </a>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Dashboard Content - Widget Grid */}
      {activeTab === 'General' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Row 1 */}
          <div className="lg:col-span-1 md:col-span-1">
            <ClonedOrdersWidget />
          </div>
          <div className="lg:col-span-1 md:col-span-1">
            <ClonedNetSalesWidget />
          </div>
          <div className="lg:col-span-1 md:col-span-1">
            <ClonedNetPaymentsWidget />
          </div>

          {/* Row 2 */}
          <div className="lg:col-span-1 md:col-span-1">
            <ClonedReturnAmountWidget />
          </div>
          <div className="lg:col-span-1 md:col-span-1">
            <ClonedDiscountAmountWidget />
          </div>
          
          {/* Row 3 - Spans all columns in lg, 2 in md, 1 in sm */}
          <div className="lg:col-span-3 md:col-span-2 col-span-1">
            <ClonedOrderTypesWidget />
          </div>
        </div>
      )}
      {/* TODO: Add content for other tabs (Branches, Inventory, Kitchen) */}
    </div>
  );
};

export default ClonedDashboardPage;

