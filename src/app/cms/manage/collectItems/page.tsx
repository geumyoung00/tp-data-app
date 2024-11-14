'use client';

import { useEffect, useState } from 'react';
import MngTable from '@/src/components/table/mngTable';
import { mngDataType } from '@/src/action/form/mng-update';
import { fetchCollectItems } from '@/src/db/collectItems';

export default function MngCollectItems() {
  const [collectItems, setCollectItems] = useState<mngDataType[]>([]);
  useEffect(() => {
    fetchCollectItems().then((data) => setCollectItems(data));
  }, []);

  return (
    <div className='contain'>
      <h2 className='sub-title'>수집 데이터 관리</h2>
      <div className='form-area'>
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
    </div>
  );
}
