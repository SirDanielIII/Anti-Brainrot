import axios from "axios";

// Create an axios instance with the base URL for the auth API
const API = axios.create({ baseURL: "http://localhost:3000/api" });

export const register = async (formData) => {
  try {
    const response = await API.post("/auth/register", formData);
    return response;
  } catch (error) {
    throw error;
  }
};

export const login = async (formData) => {
  try {
    const response = await API.post("/auth/login", formData);
    return response;
  } catch (error) {
    throw error;
  }
};

export const toggleUserType = async (token) => {
  const response = await API.post("/user/toggle-userType", {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response;
};

export const createRequest = async (requestData, token) => {
  const response = await API.post("/request", requestData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response;
};

export const createSkill = async (skillData, token) => {
  const response = await API.post("/skill", skillData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response;
};

export const fetchSkills = async (token) => {
  const response = await API.get("/skill", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response;
};

export const fetchUserRequests = async (userId, token) => {
  const response = await API.get(`/request/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response;
};


export const updateStatusRequests = async (userId, token) => {
  const response = await API.get(`/request/${userId}/status`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response;
};

export const fetchRequests = async (token) => {
  const response = await API.get("/request", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};


export const updateRequestStatus = async (requestId, newStatus, token) => {
  const response = await API.patch(`/requests/${requestId}/status`, { status: newStatus }, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response;
};

export const sendMessage = async (messageData, token) => {
  const response = await API.post("/message", messageData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response;
};

export const fetchMessages = async (token) => {
  const response = await API.get("/message", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response;
};


