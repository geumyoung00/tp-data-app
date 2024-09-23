export type dataType = {
  id: number | string;
  agency: string;
  collectItems: string;
  schedule: string;
  root: string;
  type: string;
  apiKey: string;
  apiUrl: string;
  apiExperiod: string;
  apiPrmt: { id: number; key: string; value: string }[];
  isUse: boolean;
  time: string;
  state: string;
  log: null | string;
};

export async function fetchData() {
  const response = await fetch('http://localhost:9999/data', {
    cache: 'no-store',
  });
  return response.json();
}
