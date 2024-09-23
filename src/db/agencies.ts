export type agencyType = {
  id: string;
  name: string;
};

export async function fetchAgencies() {
  const response = await fetch('http://localhost:9999/agencies', {
    cache: 'no-store',
  });
  return response.json();
}
