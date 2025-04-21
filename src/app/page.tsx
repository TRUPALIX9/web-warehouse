// src/app/page.tsx
import React from 'react';
import InventoryList from './components/InventoryList';

const HomePage = () => {
  return (
    <div>
      <h1>Warehouse Inventory</h1>
      <InventoryList />
    </div>
  );
};

export default HomePage;
