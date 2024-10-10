'use client';

import DatePicker from '@/src/components/form/datePicker';
import Select from '@/src/components/form/select';
import Button from '@/src/components/button';
import CircleGraph from '@/src/components/circleGraph';
import ViewTable from '@/src/components/table/viewTable';
import { useEffect, useRef, useState } from 'react';
import { agencyType, fetchAgencies } from '@/src/db/agencies';
import { dataType, fetchData, fetchSearchData } from '@/src/db/data';
import { useFormState } from 'react-dom';
import { useRouter, useSearchParams } from 'next/navigation';

export default function View() {
  const [datas, setDatas] = useState<dataType[]>([]);
  const [minDate, setMinDate] = useState<string>();
  const [agencies, setAgencies] = useState<agencyType[]>([]);
  const startRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLInputElement>(null);
  const selectRef = useRef<HTMLSelectElement>(null);
  const startDate = startRef.current?.value;
  const endDate = endRef.current?.value;
  const selectAgency = selectRef.current?.value;
  const today = new Date().toISOString().split('T')[0];
  const router = useRouter();

  const [formState, dataFormHandler] = useFormState(fetchSearchData, {
    errors: {},
  });

  const maxDate = new Date().toISOString().split('T')[0];
  const minDateHandler = (e: React.ChangeEvent<HTMLInputElement>) =>
    setMinDate(e.target.value);

  useEffect(() => {
    fetchAgencies().then((data) => {
      setAgencies([{ id: 'all', name: '전체' }, ...data]);
    });
    fetchData().then((data) => setDatas(data));
  }, []);

  useEffect(() => {
    if (formState.errors?._form) alert(formState.errors._form);
    if (formState.errors?._form && !endDate) endRef.current!.value = today;

    if (!formState.errors?._form && selectAgency)
      endDate && startDate
        ? router.push(
            `/view/?agency=${selectAgency}&startDate=${startDate}&endDate=${endDate}&page=1`
          )
        : router.push(`/view/?agency=${selectAgency}&page=1`);

    if (formState.filterd) setDatas(formState.filterd);
  }, [formState]);

  //데이터 관리는 리덕스 써야 함 ***
  return (
    <div className='contain'>
      <form action={dataFormHandler}>
        <ul className='filter-bar'>
          <li>
            <Select forLabel='searchAgency' label='기관 선택'>
              <select id={'searchAgency'} name={'searchAgency'} ref={selectRef}>
                {agencies?.map((item) => {
                  return (
                    <option key={item.id} value={item.id}>
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
              <input
                type='date'
                name='searchStartDate'
                id='searchStartDate'
                max={maxDate}
                ref={startRef}
                onChange={(e) => minDateHandler(e)}
              />
            </DatePicker>
            <p className='text'>~</p>
            <DatePicker hide='hide' label='searchEndDate'>
              <input
                type='date'
                name='searchEndDate'
                id='searchEndDate'
                max={maxDate}
                min={minDate}
                ref={endRef}
                defaultValue={endDate}
              />
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
      <ViewTable datas={datas} />
    </div>
  );
}
