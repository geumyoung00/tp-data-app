'use client';

import Select from '@/src/components/form/select';
import Button from '@/src/components/button';
import Add from '@/public/btnIcon/add.svg';
import Link from 'next/link';
import InputText from '@/src/components/form/inputText';
import { useEffect, useRef, useState } from 'react';
import CmsTable from '@/src/components/table/cmsTable';
import { agencyType, fetchAgencies } from '@/src/db/agencies';
import { useFormState } from 'react-dom';
import {
  fetchSearchSettings,
  fetchSettings,
  settingType,
} from '@/src/db/settings';
import { useRouter } from 'next/navigation';

export default function Cms() {
  const [settings, setSettings] = useState<settingType[]>([]);
  const [agencies, setAgencies] = useState<agencyType[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const selectRef = useRef<HTMLSelectElement>(null);
  const [formState, settingFormHandler] = useFormState(fetchSearchSettings, {
    errors: {},
  });
  const router = useRouter();
  const agency = selectRef.current?.value;
  const keyword = inputRef.current?.value;

  useEffect(() => {
    fetchAgencies().then((data) =>
      setAgencies([{ id: 'all', name: '전체' }, ...data])
    );
  }, []);

  useEffect(() => {
    if (formState.errors?._form) alert(formState.errors._form);
    if (!formState.filterd) fetchSettings().then((data) => setSettings(data));

    if (!formState.filterd && inputRef.current && inputRef.current.value) {
      inputRef.current.value = '';
      inputRef.current.focus();
    }

    if (formState.filterd) {
      router.push(`/cms?agency=${agency}&keyword=${keyword}`);
      setSettings(formState.filterd);
    }
  }, [formState]);

  return (
    <div className='contain'>
      <form action={settingFormHandler}>
        <ul className='filter-bar'>
          <li>
            <Select label='기관 선택' forLabel='searchAgency'>
              <select name='searchAgency' id='searchAgency' ref={selectRef}>
                {agencies.map((item) => {
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
            <InputText label='searchKeyword' hide='hide'>
              <input
                type='text'
                name='searchKeyword'
                placeholder='검색어를 입력하세요.'
                ref={inputRef}
              />
            </InputText>
          </li>
          <li>
            <Button label='검색' />
          </li>
          <li className='last'>
            <Link href='/cms/create' className='btn icon-with add line'>
              <span>수집 데이터 신규 등록</span>
              <i>
                <Add />
              </i>
            </Link>
          </li>
        </ul>
      </form>
      <CmsTable settings={settings} />
    </div>
  );
}
