'use client';

import Select from '@/src/components/form/select';
import Button from '@/src/components/button';
import Add from '@/public/btnIcon/add.svg';
import Link from 'next/link';
import InputText from '@/src/components/form/inputText';
import { useEffect, useState } from 'react';
import { redirect, useRouter } from 'next/navigation';
import CmsTable from '@/src/components/table/cmsTable';
import { agencyType, fetchAgencies } from '@/src/db/agencies';
import { fetchSettings, settingsType } from '@/src/db/settings';
import { revalidatePath } from 'next/cache';
import { settingRemoveHandler } from '@/src/action/setting-form-action';

export default function Cms() {
  const [agencies, setAgencies] = useState<agencyType[]>([]);
  const [settings, setSettings] = useState<settingsType[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchAgencies().then((data) =>
      setAgencies([{ id: 'all', name: '전체' }, ...data])
    );
    fetchSettings().then((data) => setSettings(data));
  }, []);

  const settingHandler = (
    e: React.MouseEvent<HTMLElement, MouseEvent>,
    id: string
  ) => {
    const target = e.target as HTMLElement;
    const type = target.innerText === '수정' ? 'edit' : 'delete';

    switch (type) {
      case 'edit':
        router.push(`/cms/edit/${id}`);
        break;

      case 'delete':
        if (confirm(`정말 ${id} 설정을 삭제하시겠습니까?`))
          settingRemoveHandler(id);
        window.location.reload();
        break;

      default:
        break;
    }
  };

  return (
    <div className='contain'>
      <form>
        <ul className='filter-bar'>
          <li>
            <Select label='기관 선택'>
              <select name='searchAgency' id='searchAgency'>
                {agencies.map((item) => {
                  return <option key={item.id}>{item.name}</option>;
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
      <CmsTable
        data={settings}
        settingHandler={(e, id) => settingHandler(e, id)}
      />
    </div>
  );
}
