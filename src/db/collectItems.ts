export type collectItemsType = {
  id: string;
  name: string;
};

export async function fetchCollectItems() {
  const response = await fetch('http://localhost:9999/collectItems', {
    cache: 'no-store',
  });
  return response.json();
}
