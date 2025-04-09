import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE = 'http://localhost:3000/api';

export const login = async (email: string, password: string) => {
  const res = await axios.post(`${API_BASE}/auth/login`, { email, password });
  Cookies.set('token', res.data.token);
  return res.data;
};

export const register = async (email: string, password: string) => {
  const res = await axios.post(`${API_BASE}/auth/register`, { email, password });
  return res.data;
};

export const getToken = () => Cookies.get('token');

export const authHeader = () => ({
  headers: { Authorization: `Bearer ${getToken()}` },
});

export const bookEvent = async (eventId: number) => {
  const token = getToken();
  return axios.post(
    `${API_BASE}/bookings`,
    { eventId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};