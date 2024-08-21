'use client';

import Select from '@/src/components/form/select';
import Button from '@/src/components/button';
import DatePicker from '@/src/components/form/date';
import InputText from '@/src/components/form/inputText';
import Radio from '@/src/components/form/radio';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface dataInterface {
  id: number;
  agency: string;
  collectItem: string;
  schedule: string;
  root: string;
  type: string;
  apiKey?: string;
  apiUrl?: string;
  apiExperiod?: string;
  apiPrmt?: [string];
  isUse: boolean;
  time: string;
  state: string;
  log: string;
}

export default function Create() {
  const [datas, setDatas] = useState<dataInterface[]>([]);
  const [selectedAgency, setSelectedAgency] = useState<string | null>(null);
  const [collections, setCollections] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch('http://192.168.0.157:9999/dataList')
      .then((res) => res.json())
      .then((data) => setDatas(data));
  }, []);

  datas.forEach((data) => {
    if (!collections.includes(data.collectItem)) {
      setCollections([data.collectItem, ...collections]);
    }
    return;
  });

  // *** 데이터 관리는 리덕스 써야 함 ***
  // SELECT Options

  const agengies: string[] = ['전체']; //기관
  datas.forEach((data: dataInterface) => {
    if (!agengies.includes(data.agency)) {
      agengies.push(data.agency);
    }
    return;
  });

  const getAgencyHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target as HTMLSelectElement;
    setSelectedAgency(value);

    const filterAgencies = datas.filter((data) => data.agency === value);
    const filterAgenciesCollections = filterAgencies.forEach((data) => {
      console.log(data);
      setCollections([]);
    });
    console.log(collections);
    // collections.filter((item) => {
    //   setCollections([]);
    //   console.log(collections);
    // });
  };

  let schedule = ['']; // 수집 스케줄 타입
  let collectType = []; //수집 형태
  let exp = []; //API 유효기간
  let parameters: any[] = [];
  let isUsing = [
    {
      label: '사용',
      name: 'isDataUse',
      value: 'able',
      checked: true,
    },
    {
      label: '미사용',
      name: 'isDataUse',
      value: 'diable',
      checked: false,
    },
  ];

  return (
    <div className='contain'>
      <h2 className='sub-title'>수집 데이터 등록</h2>
      <div className='form-area'>
        <form>
          <div className='row'>
            <Select
              label='기관'
              options={agengies}
              onChangeHandler={(e) => getAgencyHandler(e)}
            />
            <Link
              href={'/cms/manage/mngAgencies'}
              className='btn secondary'
              scroll={false}
            >
              <span>등록 기관 관리</span>
            </Link>
          </div>
          <div className='row'>
            <Select label='수집 항목' options={collections} />
            <Link
              href={`/cms/manage/mngContents`}
              className='btn secondary'
              scroll={false}
            >
              <span>수집 항목 관리</span>
            </Link>
          </div>
          <div className='row'>
            <Select label='수집 스케줄' options={[]} />
            <DatePicker period='time' hide='hide' />
          </div>
          <div className='row'>
            <InputText label='수집 폴더' size='wide' />
          </div>
          <div className='row'>
            <Select label='수집형태' options={[]} />
            <ul className='inner-form'>
              <li>
                <InputText label='KEY' />
              </li>
              <li>
                <InputText label='URL' />
              </li>
              <li>
                <Select label='유효기간' options={[]} />
              </li>
              <li>
                <p className='label'>파라미터</p>
                <ul className='parameter-group'>
                  {/* 등록 폼 default*/}
                  <li className='apply'>
                    <InputText
                      size='min key'
                      label='parameterKey'
                      hide='hide'
                    />
                    <InputText
                      size='min value'
                      label='parameterValue'
                      hide='hide'
                    />
                    <Button
                      label='추가'
                      icon='add'
                      type='icon-only'
                      size='min'
                    />
                  </li>
                  {/* 지금 등록한 목록 보여주기 */}
                  {parameters ? (
                    ''
                  ) : (
                    <li className='delete'>
                      <InputText
                        size='min key'
                        label='parameterKey'
                        hide='hide'
                      />
                      <InputText
                        size='min value'
                        label='parameterValue'
                        hide='hide'
                      />
                      <Button
                        label='삭제'
                        icon='remove'
                        type='icon-only'
                        size='min'
                        state='tertiary'
                      />
                    </li>
                  )}
                </ul>
              </li>
            </ul>
          </div>
          <div className='row'>
            <p className='label'>사용 여부</p>
            <Radio options={isUsing} />
          </div>
          <div className='row apply-btn'>
            <Button
              label='목록'
              state='secondary'
              onClick={(e) => {
                e.preventDefault();
                router.back();
              }}
            />
            <Button
              onClick={(e) => {
                e.preventDefault();
                router.back();
              }}
              label='등록'
            />
          </div>
        </form>
      </div>
    </div>
  );
}
