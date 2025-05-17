import React from 'react';

interface SidebarProps {
  // Define props if any, e.g., menu items, user info
}

const Sidebar: React.FC<SidebarProps> = () => {
  // Based on /home/ubuntu/foodics_dashboard_sidebar_actual_structure.md
  const menuItems = [
    { name: 'Inventory', icon: 'box-icon', path: '/inventory' },
    { name: 'Menu', icon: 'menu-icon', path: '/menu' },
    {
      name: 'Manage',
      icon: 'settings-icon',
      path: '/manage',
      subItems: [
        { name: 'Users', path: '/manage/users' },
        { name: 'Roles', path: '/manage/roles' },
        { name: 'Branches', path: '/manage/branches' },
        { name: 'Devices', path: '/manage/devices' },
        { name: 'Discounts', path: '/manage/discounts' },
        { name: 'Coupons', path: '/manage/coupons' },
        { name: 'Promotions', path: '/manage/promotions' },
        { name: 'Timed Events', path: '/manage/timed-events' },
        { name: 'More', path: '/manage/more' }, // This will link to a page with more options
      ],
    },
    { name: 'Marketplace', icon: 'grid-icon', path: '/marketplace' },
    { name: 'Help Center', icon: 'help-icon', path: '/help' },
  ];

  // Placeholder for logo - awaiting user input
  const logoUrl = "/placeholder-logo.png"; // Replace with actual logo path or prop

  return (
    <div className="bg-gray-800 text-white w-64 min-h-screen p-4 space-y-6">
      <div className="flex items-center justify-center mb-6">
        {/* Placeholder for Logo - Awaiting user input */}
        <img src={logoUrl} alt="XB Dashboard Logo" className="h-10 w-auto" />
      </div>
      <nav>
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.name}>
              <a
                href={item.path}
                className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-700 transition-colors duration-200"
              >
                {/* Placeholder for actual icons - Awaiting user input */}
                <span className={`icon-${item.icon} w-5 h-5`}></span>
                <span>{item.name}</span>
              </a>
              {item.subItems && (
                <ul className="pl-6 mt-1 space-y-1">
                  {item.subItems.map((subItem) => (
                    <li key={subItem.name}>
                      <a
                        href={subItem.path}
                        className="block p-2 rounded-md hover:bg-gray-600 transition-colors duration-200 text-sm"
                      >
                        {subItem.name}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;

