'use client';

import Modal from '@/src/components/modal/modal';
import MngTable from '@/src/components/table/mngTable';
import { mngDataType, mngUpdateDataType } from '@/src/action/form/mng-update';
import { useEffect, useState } from 'react';
import { fetchCollectItems } from '@/src/db/collectItems';

export default function MngcollectItemsModal() {
  const [collectItems, setCollectItems] = useState<mngDataType[]>([]);
  useEffect(() => {
    fetchCollectItems().then((data) => setCollectItems(data));
  }, []);

  return (
    <Modal title='수집 데이터 관리'>
      <div className='modal-table'>
        {collectItems ? (
          <MngTable />
        ) : (
          <table className='empty'>
            <tbody>
              <tr>
                <td>등록된 데이터가 없습니다.</td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
    </Modal>
  );
}
