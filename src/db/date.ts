const scheduleType = [
  { id: 'daily', name: '매일' },
  { id: 'weekly', name: '매주' },
  { id: 'day', name: '날짜 지정' },
  { id: 'period', name: '기간 지정' },
];

const times = [...new Array(25)].map((_, i) => {
  if (i < 10) return '0' + JSON.stringify(i * 1);
  return JSON.stringify(i * 1);
});

const minutes = [...new Array(12)].map((_, i) => {
  if (i * 5 < 10) return '0' + JSON.stringify(i * 5);
  return JSON.stringify(i * 5);
});

const weeks = [
  { id: 'mon', name: '월' },
  { id: 'tue', name: '화' },
  { id: 'wed', name: '수' },
  { id: 'thu', name: '목' },
  { id: 'fri', name: '금' },
  { id: 'sat', name: '토' },
  { id: 'sun', name: '일' },
];

export { scheduleType, times, minutes, weeks };
