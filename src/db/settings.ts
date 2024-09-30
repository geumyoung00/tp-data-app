type settingsType = {
  id: string;
  agency: string;
  collectItem: string;
  scheduleType: string;
  schedule: {
    time: string;
    minutes: string;
    weeks?: [string];
    date?: string;
    endDate?: string;
  };
  root: string;
  collectType: string;
  collectTypeInfo: {
    apiKey?: string;
    apiUrl?: string;
    apiExperiod?: string;
    apiPrmt?: [{ id: number; key: string; value: string }];
  };
  isUsed: boolean;
};

type radioType = {
  label: string;
  name: string;
  value: string;
  checked?: boolean;
  disabled?: boolean;
};

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

async function fetchSettings() {
  const response = await fetch('http://localhost:9999/settings', {
    cache: 'no-store',
  });
  return response.json();
}

export { fetchSettings, useOption, unuseOption };
export type { settingsType, radioType };
