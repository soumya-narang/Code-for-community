import React, { useState } from 'react';
import Sidebar from '../components/dashboard/Sidebar';
import TopBar from '../components/dashboard/TopBar';
import PriorityList from '../components/dashboard/PriorityList';
import type { Category } from '../store/useProjectStore';

const Dashboard: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-paper flex flex-col md:flex-row font-sans">
      <Sidebar />
      
      <main className="flex-grow flex flex-col">
        <TopBar 
          activeCategory={activeCategory} 
          setActiveCategory={setActiveCategory} 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        <div className="flex-grow">
          <PriorityList 
            activeCategory={activeCategory} 
            searchQuery={searchQuery} 
          />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
