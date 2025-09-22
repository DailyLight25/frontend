import React, { useState } from 'react';
import ProfileTab from './profile';
// import NotificationsTab from './NotificationsTab';
// import other tabs as needed

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications'>('profile');

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="flex space-x-4 bg-gray-100 p-4">
        <button
          className={activeTab === 'profile' ? 'font-bold text-blue-700' : ''}
          onClick={() => setActiveTab('profile')}
        >
          Profile
        </button>
        <button
          className={activeTab === 'notifications' ? 'font-bold text-blue-700' : ''}
          onClick={() => setActiveTab('notifications')}
        >
          Notifications
        </button>
        {/* Add more tabs as needed */}
      </nav>
      <main className="flex-1 p-6">
        {activeTab === 'profile' && <ProfileTab />}
        {/* {activeTab === 'notifications' && <NotificationsTab />} */}
        {/* Render other tabs as needed */}
      </main>
    </div>
  );
};

export default Dashboard;