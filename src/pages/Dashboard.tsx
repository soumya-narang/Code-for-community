import React, { useState, useEffect } from 'react';
import Sidebar from '../components/dashboard/Sidebar';
import TopBar from '../components/dashboard/TopBar';
import PriorityList from '../components/dashboard/PriorityList';
import SubmissionsList from '../components/dashboard/SubmissionsList';
import type { Category } from '../store/useProjectStore';
import { useProjectStore } from '../store/useProjectStore';

interface DashboardProps {
  view?: 'priority' | 'submissions';
}

const Dashboard: React.FC<DashboardProps> = ({ view = 'priority' }) => {
  const fetchProjects = useProjectStore((s) => s.fetchProjects);
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

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
          {view === 'priority' ? (
            <PriorityList 
              activeCategory={activeCategory} 
              searchQuery={searchQuery} 
            />
          ) : (
            <SubmissionsList 
              activeCategory={activeCategory} 
              searchQuery={searchQuery} 
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
