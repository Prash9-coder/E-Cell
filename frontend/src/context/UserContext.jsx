import { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

// Create the context
const UserContext = createContext();

// Helper function to get users from localStorage
const getStoredUsers = () => {
  try {
    const storedUsers = localStorage.getItem('ecell_users');
    if (storedUsers) {
      return JSON.parse(storedUsers);
    }
  } catch (error) {
    console.error('Error retrieving stored users:', error);
  }
  
  // Default users if none are stored
  return [
    {
      id: 1,
      name: 'Nimmala Prashanth',
      email: 'nimmalaprashanth9@gmail.com',
      role: 'Admin',
      status: 'Active',
      joinedAt: '2025-05-22',
      avatar: '/images/users/admin1.jpg'
    },
    {
      id: 2,
      name: 'Rahul Verma',
      email: 'rahul.verma@example.com',
      role: 'Admin',
      status: 'Active',
      joinedAt: '2023-01-20',
      avatar: '/images/users/admin2.jpg'
    },
    {
      id: 3,
      name: 'Ananya Patel',
      email: 'ananya.patel@example.com',
      role: 'Editor',
      status: 'Active',
      joinedAt: '2023-02-05',
      avatar: '/images/users/editor1.jpg'
    },
    {
      id: 4,
      name: 'Vikram Reddy',
      email: 'vikram.reddy@example.com',
      role: 'Editor',
      status: 'Active',
      joinedAt: '2023-02-15',
      avatar: '/images/users/editor2.jpg'
    },
    {
      id: 5,
      name: 'Zara Khan',
      email: 'zara.khan@example.com',
      role: 'User',
      status: 'Active',
      joinedAt: '2023-03-10',
      avatar: '/images/users/user1.jpg'
    },
    {
      id: 6,
      name: 'Arjun Singh',
      email: 'arjun.singh@example.com',
      role: 'User',
      status: 'Inactive',
      joinedAt: '2023-03-20',
      avatar: '/images/users/user2.jpg'
    }
  ];
};

// Helper function to save users to localStorage
const saveUsersToStorage = (users) => {
  try {
    localStorage.setItem('ecell_users', JSON.stringify(users));
    console.log('Users saved to localStorage:', users);
  } catch (error) {
    console.error('Error saving users to localStorage:', error);
  }
};

// Provider component
export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState(() => getStoredUsers());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Save users to localStorage whenever they change
  useEffect(() => {
    saveUsersToStorage(users);
  }, [users]);

  // Function to fetch all users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real app, this would call the API
      // const response = await api.users.getAll();
      // const fetchedUsers = response.users;
      
      // For now, we'll use the stored users or default mock data
      const storedUsers = getStoredUsers();
      
      setUsers(storedUsers);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load users. Please try again later.');
      setLoading(false);
    }
  };

  // Function to add a new user
  const addUser = async (userData) => {
    try {
      setLoading(true);
      
      // In a real app, this would call the API
      // const newUser = await api.users.create(userData);
      
      // For now, we'll create a mock user
      const newId = Math.max(...users.map(u => u.id), 0) + 1;
      const newUser = {
        id: newId,
        ...userData,
        joinedAt: new Date().toISOString().split('T')[0],
        avatar: userData.avatar || '/images/users/default.jpg'
      };
      
      const updatedUsers = [...users, newUser];
      setUsers(updatedUsers);
      
      // Save to localStorage
      saveUsersToStorage(updatedUsers);
      
      setLoading(false);
      return newUser;
    } catch (error) {
      console.error('Error adding user:', error);
      setError('Failed to add user. Please try again later.');
      setLoading(false);
      throw error;
    }
  };

  // Function to update a user
  const updateUser = async (id, userData) => {
    try {
      setLoading(true);
      
      // In a real app, this would call the API
      // const updatedUser = await api.users.update(id, userData);
      
      // For now, we'll update the user in our local state
      const updatedUsers = users.map(user => 
        user.id === id ? { ...user, ...userData } : user
      );
      
      setUsers(updatedUsers);
      
      // Save to localStorage
      saveUsersToStorage(updatedUsers);
      
      setLoading(false);
      
      // Return the updated user
      return updatedUsers.find(user => user.id === id);
    } catch (error) {
      console.error('Error updating user:', error);
      setError('Failed to update user. Please try again later.');
      setLoading(false);
      throw error;
    }
  };

  // Function to delete a user
  const deleteUser = async (id) => {
    try {
      setLoading(true);
      
      // In a real app, this would call the API
      // await api.users.delete(id);
      
      // For now, we'll just remove the user from our local state
      const filteredUsers = users.filter(user => user.id !== id);
      setUsers(filteredUsers);
      
      // Save to localStorage
      saveUsersToStorage(filteredUsers);
      
      setLoading(false);
      
      return { success: true, message: 'User deleted successfully' };
    } catch (error) {
      console.error('Error deleting user:', error);
      setError('Failed to delete user. Please try again later.');
      setLoading(false);
      throw error;
    }
  };

  // Get recent users (for dashboard)
  const getRecentUsers = (limit = 4) => {
    // Sort users by joined date (newest first) and take the specified limit
    return [...users]
      .sort((a, b) => new Date(b.joinedAt) - new Date(a.joinedAt))
      .slice(0, limit);
  };

  return (
    <UserContext.Provider 
      value={{ 
        users,
        loading,
        error,
        fetchUsers,
        addUser,
        updateUser,
        deleteUser,
        getRecentUsers
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the user context
export const useUsers = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUsers must be used within a UserProvider');
  }
  return context;
};