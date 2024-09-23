export type settingsType = {
  id: string;
  agency: string;
  collectItem: string;
  schedule: {
    type: string;
    time: string;
    weeks?: [string];
    date?: string;
    startDate?: string;
    endDate?: string;
  };
  root: string;
  type: string;
  apiKey?: string;
  apiUrl?: string;
  apiExperiod?: string;
  apiPrmt?: [{ id: number; key: string; value: string }];
  isUsed: boolean;
};

export async function fetchSettings() {
  const response = await fetch('http://localhost:9999/settings', {
    cache: 'no-store',
  });
  return response.json();
}
