'use client';

import DatePicker from '@/src/components/form/datePicker';
import Select from '@/src/components/form/select';
import Button from '@/src/components/button';
import CircleGraph from '@/src/components/circleGraph';
import ViewTable from '@/src/components/table/viewTable';
import { dataType, fetchData } from '@/src/db/data';
import React, { useEffect, useState } from 'react';
import { agencyType, fetchAgencies } from '@/src/db/agencies';
import { redirect } from 'next/navigation';

export default function View() {
  const [datas, setDatas] = useState<dataType[]>();
  const [agencies, setAgencies] = useState<agencyType[]>([]);

  useEffect(() => {
    fetchData().then((data) => setDatas(data));
    fetchAgencies().then((data) => {
      setAgencies([{ id: 'all', name: '전체' }, ...data]);
    });
  }, []);

  //데이터 관리는 리덕스 써야 함 ***
  return (
    <div className='contain'>
      <form onSubmit={(e: React.FormEvent) => {}}>
        <ul className='filter-bar'>
          <li>
            <Select label='기관 선택'>
              <select id={'agency'} name={'agency'}>
                {agencies?.map((item) => {
                  return (
                    <option key={item.id} value={item.name}>
                      {item.name}
                    </option>
                  );
                })}
              </select>
            </Select>
          </li>
          <li>
            <p className='label'>기간 선택</p>
            <DatePicker hide='hide' label='searchStartDate'>
              <input type='date' name='searchStartDate' />
            </DatePicker>
            <p className='text'>~</p>
            <DatePicker hide='hide' label='searchEndDate'>
              <input type='date' name='searchEndDate' />
            </DatePicker>
          </li>
          <li>
            <Button label='검색' />
          </li>
        </ul>
      </form>
      {/* <div className='board'>
        <CircleGraph />
        <CircleGraph />
        <CircleGraph />
      </div> */}
      {datas ? <ViewTable data={datas} /> : <div>데이터가 없습니다.</div>}
    </div>
  );
}
