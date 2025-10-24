import React, { useEffect, useState } from 'react';
import apiService from '../../services/apiService';

interface User {
  username: string;
  email: string;
  // add other user fields if needed
}

const ProfileTab: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({ username: '', email: '' });
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    apiService.getCurrentUser().then((res: User) => {
      setUser(res);
      setFormData({ username: res.username, email: res.email });
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const res = await apiService.patchCurrentUser(formData);
    setUser(res);
    setEditMode(false);
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Profile</h2>
      {editMode ? (
        <>
          <input name="username" value={formData.username} onChange={handleChange} className="input-field mb-2" />
          <input name="email" value={formData.email} onChange={handleChange} className="input-field mb-2" />
          <button onClick={handleSave} className="btn-primary mr-2">Save</button>
          <button onClick={() => setEditMode(false)} className="btn-secondary">Cancel</button>
        </>
      ) : (
        <>
          <div className="mb-2"><b>Username:</b> {user.username}</div>
          <div className="mb-2"><b>Email:</b> {user.email}</div>
          <button onClick={() => setEditMode(true)} className="btn-primary">Edit Profile</button>
        </>
      )}
    </div>
  );
};

export default ProfileTab;