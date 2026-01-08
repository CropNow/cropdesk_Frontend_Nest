// import { http } from '@/services/http';

export const getUserProfile = async () => {
  // Placeholder for backend API
  // return http.get('/user/profile');
  const storedUser = localStorage.getItem('registeredUser');
  return Promise.resolve(storedUser ? JSON.parse(storedUser) : null);
};

export const updateUserProfile = async (data: any) => {
  // Placeholder for backend API
  // return http.put('/user/profile', data);
  const storedUserStr = localStorage.getItem('registeredUser');
  const storedUser = storedUserStr ? JSON.parse(storedUserStr) : {};
  const updated = { ...storedUser, ...data };
  localStorage.setItem('registeredUser', JSON.stringify(updated));
  return Promise.resolve(updated);
};
