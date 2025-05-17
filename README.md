# XB Dashboard

This is a comprehensive web dashboard application built with React, TypeScript, and Tailwind CSS. It includes navigation structure, KPI widgets, data visualization, and reporting features.

## Features

- **Navigation Structure**
  - Collapsible sidebar with hierarchical menu
  - Top navigation bar with user profile, notifications, and language switcher

- **Dashboard Components**
  - KPI Widgets (Orders Summary, Net Sales, Net Payments)
  - Order Types Chart with date filtering
  - Data tables with column visibility toggle and sorting

- **Reports**
  - Sales Report with filtering, sorting, and export capabilities
  - Date Range Picker component

- **Enhanced UI Components**
  - Responsive design for all screen sizes
  - Interactive data tables with advanced features

## Installation

1. Ensure you have Node.js (v16+) and npm/yarn installed

2. Extract the zip file to your local machine

3. Navigate to the project directory:
   ```
   cd xb_dashboard
   ```

4. Install dependencies:
   ```
   npm install
   # or
   yarn install
   ```

5. Navigate to the frontend app:
   ```
   cd apps/frontend
   ```

6. Install frontend dependencies:
   ```
   npm install
   # or
   yarn install
   ```

## Running the Application

1. From the frontend directory:
   ```
   npm start
   # or
   yarn start
   ```

2. The application will be available at http://localhost:3000

## Project Structure

- `/apps/frontend/` - Main React application
  - `/src/components/` - Reusable UI components
    - `/layout/` - Layout components (Sidebar, Topbar, etc.)
    - `/dashboard/` - Dashboard-specific components
    - `/common/` - Shared UI components
  - `/src/pages/` - Page components
    - `/dashboard/` - Dashboard pages
    - `/reports/` - Report pages
  - `/src/services/` - API services and data fetching
  - `/src/hooks/` - Custom React hooks

## Mock Data

The application currently uses mock data services that simulate backend API responses. These are located in the `/src/services/` directory.

## Notes

- This is a frontend-only package. The backend API is being developed separately.
- All data is currently mock data for demonstration purposes.
