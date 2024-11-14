'use client';

import MngTable from '@/src/components/table/mngTable';
import { mngDataType } from '@/src/action/form/mng-update';
import { useEffect, useState } from 'react';
import { fetchAgencies } from '@/src/db/agencies';

export default function MngAgencies() {
  const [agencies, setAgencies] = useState<mngDataType[]>([]);
  useEffect(() => {
    fetchAgencies().then((data) => setAgencies(data));
  }, []);

  return (
    <div className='contain'>
      <h2 className='sub-title'>등록 기관 관리</h2>
      <div className='form-area'>
        {agencies ? (
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
