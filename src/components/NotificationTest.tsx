import React from 'react';
import { useNotification } from '../contexts/NotificationContext';

const NotificationTest: React.FC = () => {
  const { showNotification } = useNotification();

  const showSuccess = () => {
    showNotification({
      type: 'success',
      title: 'Success!',
      message: 'This is a success notification with a loading bar.',
      duration: 3000
    });
  };

  const showError = () => {
    showNotification({
      type: 'error',
      title: 'Error!',
      message: 'This is an error notification with a loading bar.',
      duration: 5000
    });
  };

  const showWarning = () => {
    showNotification({
      type: 'warning',
      title: 'Warning!',
      message: 'This is a warning notification with a loading bar.',
      duration: 4000
    });
  };

  const showInfo = () => {
    showNotification({
      type: 'info',
      title: 'Information',
      message: 'This is an info notification with a loading bar.',
      duration: 3500
    });
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Notification Test</h2>
      
      <div className="space-y-4">
        <button
          onClick={showSuccess}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded transition"
        >
          Show Success Notification
        </button>
        
        <button
          onClick={showError}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition"
        >
          Show Error Notification
        </button>
        
        <button
          onClick={showWarning}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded transition"
        >
          Show Warning Notification
        </button>
        
        <button
          onClick={showInfo}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition"
        >
          Show Info Notification
        </button>
      </div>
    </div>
  );
};

export default NotificationTest;
