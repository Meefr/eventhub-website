import api from "./api";

export const getEvents = async (params = {}) => {
  const response = await api.get("/events", { params });
  return response;
};

export const getEvent = async (id) => {
  const response = await api.get(`/events/event/${id}`);
  return response.data;
};

export const createEvent = async (eventData) => {
  try {
    const response = await api.post('/events', eventData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true,
    });
    return response;
  } catch (error) {
    console.error('Event creation error:', error.response?.data || error.message);
    throw error;
  }
};

export const updateEvent = async (id, eventData) => {
  try {
    const response = await api.put(`/events/${id}`, eventData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true,
    });
    return response;
  } catch (error) {
    console.error('Event update error:', error.response?.data || error.message);
    throw error;
  }
};

export const deleteEvent = async (id) => {
  const response = await api.delete(`/events/${id}`);
  return response;
};

export const uploadEventImage = async (id, imageFile) => {
  const formData = new FormData();
  formData.append("image", imageFile);

  const response = await api.put(`/events/${id}/image`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
};

export const getFeaturedEvents = async (page = 1, limit = 6) => {
  const response = await api.get("/events/featured", {
    params: { page, limit }
  });
  return response.data;
};

export const getUpcomingEvents = async (page = 1, limit = 10) => {
  const response = await api.get("/events/upcoming", {
    params: { page, limit }
  });
  return response.data;
};

export const getEventsByOrganizer = async (organizerId) => {
  const response = await api.get(`/events/organizer/${organizerId}`);
  return response.data;
};

export const getEventCategories = async () => {
  const response = await api.get(`/events/categories`);
  return response.data;
};

export const createCategory = async (categoryData) => {
  console.log("categoryData", categoryData);
  console.log("url", `${api.defaults.baseURL}/events/categories`);

  const response = await api.post(`/events/categories`, categoryData);
  return response;
};

export const deleteCategory = async (id) => {
  console.log("deleteCategory", id);
  const response = await api.delete(`/events/categories/${id}`);
  return response;
}