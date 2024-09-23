'use client';

import Select from '@/src/components/form/select';
import Button from '@/src/components/button';
import DatePicker from '@/src/components/form/datePicker';
import InputText from '@/src/components/form/inputText';
import Radio from '@/src/components/form/radio';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface dataInterface {
  id: number;
  agency: string;
  collects: string;
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

export default function Edit() {
  return (
    <div className='contain'>
      <h2 className='sub-title'>수집 설정 수정</h2>
    </div>
  );
}
