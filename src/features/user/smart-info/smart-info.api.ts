// import { http } from '@/services/http';

export interface DailyStatus {
  date: string; // YYYY-MM-DD
  status: 'Good' | 'Average' | 'Bad';
}

export const getSmartInfoData = async () => {
  // Placeholder for backend API
  // return http.get('/smart-info');
  return Promise.resolve({
    calendar: [],
    alerts: [],
    waterSavings: {},
  });
};

export const getCalendarStatus = async (
  year: number,
  month: number
): Promise<DailyStatus[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  const today = new Date();
  // Normalize today to start of day for accurate comparison
  const todayStart = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  const statuses: DailyStatus[] = [];
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let d = 1; d <= daysInMonth; d++) {
    const currentIterDate = new Date(year, month, d);

    // Only generate/return data for PAST dates (< todayStart)
    if (currentIterDate < todayStart) {
      // Mock logic: Randomly assign status to simulate fetching from DB
      const rand = Math.random();
      let status: 'Good' | 'Average' | 'Bad' = 'Good';

      // Weighted random for realism
      if (rand > 0.85) status = 'Bad';
      else if (rand > 0.65) status = 'Average';

      statuses.push({
        date: `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
        status,
      });
    }
  }
  return statuses;
};
