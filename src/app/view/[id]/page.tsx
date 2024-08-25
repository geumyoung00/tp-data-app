export default async function LogPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const res = await fetch('http://localhost:9999/dataList');
  const datas = await res.json();

  const findDataLog = datas.find(
    (data: { id: number }) => JSON.stringify(data.id) === id
  ).dataLog;

  return <div>{findDataLog}</div>;
}
