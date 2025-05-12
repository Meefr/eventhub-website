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
    console.log(eventData);
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

// export const createEvent = async (eventData) => {
//   const response = await api.post('/events', eventData);
//   return response;
// };
// export const createEvent = async (eventData) => {
//   const formData = new FormData();

//   // Append all fields
//   for (const key in eventData) {
//     // For tags (array), append each one
//     if (Array.isArray(eventData[key])) {
//       eventData[key].forEach((item) => formData.append(key, item));
//     } else {
//       formData.append(key, eventData[key]);
//     }
//   }
//   for (let pair of formData.entries()) {
//     console.log(pair[0] + ": " + pair[1]);
//   }
//   const response = await api.post(
//     "/events",
//     formData,
//     {
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//     },
//     { withCredentials: true }
//   );

//   return response;
// };

// export const updateEvent = async (id, eventData) => {
//   const response = await api.put(`/events/${id}`, eventData);
//   return response;
// };

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

export const getFeaturedEvents = async () => {
  const response = await api.get("/events/featured");

  return response.data;
};

export const getUpcomingEvents = async () => {
  const response = await api.get("/events/upcoming");
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
