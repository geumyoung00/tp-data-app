const scheduleType = [
  { id: 'daily', name: '매일' },
  { id: 'weekly', name: '매주' },
  { id: 'day', name: '날짜 지정' },
  { id: 'period', name: '기간 지정' },
];

const timeArr = [...new Array(25)].map((_, i) => {
  if (i < 10) return '0' + JSON.stringify(i * 1);
  return JSON.stringify(i * 1);
});

const minuteArr = [...new Array(12)].map((_, i) => {
  if (i * 5 < 10) return '0' + JSON.stringify(i * 5);
  return JSON.stringify(i * 5);
});

const weekArr = [
  { id: 'mon', name: '월' },
  { id: 'tue', name: '화' },
  { id: 'wed', name: '수' },
  { id: 'thu', name: '목' },
  { id: 'fri', name: '금' },
  { id: 'sat', name: '토' },
  { id: 'sun', name: '일' },
];

const useOption = [
  {
    label: '사용',
    name: 'isUsed',
    value: 'use',
    checked: true,
  },
  {
    label: '미사용',
    name: 'isUsed',
    value: 'unused',
    checked: false,
  },
];

const unuseOption = [
  {
    label: '사용',
    name: 'isUsed',
    value: 'use',
    checked: false,
  },
  {
    label: '미사용',
    name: 'isUsed',
    value: 'unused',
    checked: true,
  },
];

export { scheduleType, timeArr, minuteArr, weekArr, useOption, unuseOption };
