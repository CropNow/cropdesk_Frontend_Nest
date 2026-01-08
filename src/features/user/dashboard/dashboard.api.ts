// import { http } from '@/services/http';

export const getDashboardData = async () => {
  // Placeholder for backend API
  // return http.get('/dashboard');
  return Promise.resolve({
    weather: {},
    iot: [],
    insights: [],
  });
};
