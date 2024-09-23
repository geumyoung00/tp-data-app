'use client';

import MngTable from '@/src/components/table/mngTable';
import { mngDataType } from '@/src/action/form/mng-update';
import { useEffect, useState } from 'react';
import { fetchAgencies, agencyType } from '@/src/db/agencies';

export default function MngAgencies() {
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
    <div className='contain'>
      <h2 className='sub-title'>등록 기관 관리</h2>
      <div className='form-area'>
        <MngTable />
      </div>
    </div>
  );
}
