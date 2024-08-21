import Modal from '@/src/components/modal/modal';

export default async function LogModal({ params }: { params: { id: string } }) {
  const res = await fetch('http://192.168.0.157:9999/dataList');
  const datas = await res.json();
  const findDataLog = datas.find(
    (data: { id: number }) => JSON.stringify(data.id) === params.id
  ).log;

  return (
    <Modal title={`${params.id} 상세 로그`}>
      <div className='modal-inner'>{findDataLog}</div>
    </Modal>
  );
}
