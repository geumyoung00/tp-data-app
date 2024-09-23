'use client';

import Modal from '@/src/components/modal/modal';
import MngTable from '@/src/components/table/mngTable';
import { mngDataType } from '@/src/action/form/mng-update';
import { useEffect, useState } from 'react';
import { agencyType, fetchAgencies } from '@/src/db/agencies';

export default function MngAgenciesModal() {
  const [agencies, setAgencies] = useState<mngDataType[]>([]);

  useEffect(() => {
    fetchAgencies().then((data) => {
      let result: mngDataType[] = [];
      data.forEach((item: agencyType) => {
        result.push({
          ...item,
          isEdit: false,
        });
      });

      return setAgencies(result);
    });
  }, []);

  return (
    <Modal title='등록 기관 관리'>
      <div className='modal-table'>
        {agencies ? (
          <MngTable data={agencies} />
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
