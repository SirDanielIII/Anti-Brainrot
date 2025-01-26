import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleUserType } from '../services/api';
import { setAuth } from '../store/authSlice';

const Profile = () => {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);

  const handleToggle = async () => {
    try {
      const { data } = await toggleUserType(token);
      dispatch(setAuth({ user: data.user, token }));
    } catch (error) {
      console.error('Error toggling userType:', error);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="profile-container bg-white p-5 shadow-lg rounded-lg">
        <h2 className="text-3xl font-bold mb-5">Profile</h2>
        <p className="mb-2"><strong>Username:</strong> {user.username}</p>
        <p className="mb-2"><strong>Email:</strong> {user.email}</p>
        <p className="mb-4"><strong>User Type:</strong> {user.userType}</p>
        <button onClick={handleToggle} className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors">
          Toggle User Type
        </button>
      </div>
    </div>
  );
};

export default Profile;
