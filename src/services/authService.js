import api from './api';

export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response;
};

export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response;
};

export const logout = async () => {
  const response = await api.get('/auth/logout');
  return response;
};

export const getMe = async () => {
  const response = await api.get('/auth/me');
  return response;
};

export const updateDetails = async (userData) => {
  const response = await api.put('/auth/updatedetails', userData);
  return response;
};

export const updatePassword = async (passwords) => {
  const response = await api.put('/auth/updatepassword', passwords);
  return response;
};