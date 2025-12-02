import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load user from localStorage
    const savedUser = localStorage.getItem('safariUser');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (error) {
        localStorage.removeItem('safariUser');
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      console.log('AuthContext login called with:', email, password);
      // Simulate user data - create demo accounts for testing
      const demoUsers = [
        {
          id: 1,
          email: 'admin@safari.com',
          password: 'admin123',
          firstName: 'Admin',
          lastName: 'User',
          role: 'admin'
        },
        {
          id: 2,
          email: 'user@safari.com',
          password: 'user123',
          firstName: 'John',
          lastName: 'Doe',
          role: 'visitor'
        }
      ];

      console.log('Looking for user in demo users:', demoUsers);
      const foundUser = demoUsers.find(u => u.email === email && u.password === password);
      console.log('Found user:', foundUser);
      
      if (foundUser) {
        const userData = {
          id: foundUser.id,
          email: foundUser.email,
          firstName: foundUser.firstName,
          lastName: foundUser.lastName,
          role: foundUser.role,
          name: `${foundUser.firstName} ${foundUser.lastName}`,
          avatar: `https://ui-avatars.com/api/?name=${foundUser.firstName}+${foundUser.lastName}&background=059669&color=fff`,
          token: 'demo-token-' + foundUser.id
        };
        
        setUser(userData);
        localStorage.setItem('safariUser', JSON.stringify(userData));
        
        return { success: true, user: userData };
      } else {
        return { success: false, error: 'Invalid email or password' };
      }
    } catch (error) {
      return { success: false, error: error.message || 'Login failed' };
    }
  };

  const register = async (userData) => {
    try {
      // Simulate registration - create new user
      const newUser = {
        id: Date.now(), // Simple ID generation
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: 'visitor',
        name: `${userData.firstName} ${userData.lastName}`,
        avatar: `https://ui-avatars.com/api/?name=${userData.firstName}+${userData.lastName}&background=059669&color=fff`,
        token: 'demo-token-' + Date.now()
      };
      
      setUser(newUser);
      localStorage.setItem('safariUser', JSON.stringify(newUser));
      
      return { success: true, user: newUser };
    } catch (error) {
      return { success: false, error: error.message || 'Registration failed' };
    }
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem('safariUser');
    // Navigate to home page with logout success message
    window.location.href = '/?logout=success';
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};