import api from './api';

export const getUsers = async () => {
  const response = await api.get('/users');
  return response;
};

export const getUser = async (id) => {
  const response = await api.get(`/users/${id}`);
  return response;
};

export const updateUser = async (id, userData) => {
  const response = await api.put(`/users/${id}`, userData);
  return response;
};

export const deleteUser = async (id) => {
  const response = await api.delete(`/users/${id}`);
  return response;
};

export const uploadProfileImage = async (imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);
  
  const response = await api.put('/users/me/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response;
};