'use client';

import { settingFormHandler } from '@/src/action/setting-form-action';
import { scheduleType } from '@/src/db/date';
import {
  fetchSettings,
  settingsType,
  useOption,
  radioType,
  unuseOption,
} from '@/src/db/settings';
import { useParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { useFormState } from 'react-dom';
import CollectTypeForm from '@/src/components/form/collectType';
import InputText from '@/src/components/form/inputText';
import Radio from '@/src/components/form/radio';
import ScheduleForm from '@/src/components/form/schedule';
import Select from '@/src/components/form/select';
import Link from 'next/link';
import Button from '@/src/components/button';
import { useRouter } from 'next/navigation';

type refsType = HTMLSelectElement | HTMLInputElement | HTMLDivElement;
interface refsInterface {
  id: string;
  ref: refsType;
}

export default function EditPage() {
  const [nowSetting, setNowSetting] = useState<settingsType>();
  const [selectSchedule, setSelectSchedule] = useState<string>('');
  const [selectType, setSelectType] = useState<string>('');
  const [isUsed, setIsUsed] = useState<radioType[]>();
  const router = useRouter();
  const { id } = useParams();

  const [formState, editFormAction] = useFormState(
    settingFormHandler.bind(null, { type: 'edit', id: id as string }),
    {
      errors: {},
    }
  );

  let formRefs = useRef<refsInterface[]>([]);
  const errors = formState?.errors;

  useEffect(() => {
    fetchSettings().then((res) => {
      const filterItem = res.filter(
        (item: settingsType) => JSON.stringify(item.id) === id
      );

      const option = filterItem[0].isUsed ? useOption : unuseOption;

      return (
        setNowSetting(filterItem[0]),
        setSelectSchedule(filterItem[0].scheduleType),
        setSelectType(filterItem[0].collectType),
        setIsUsed(option)
      );
    });
  }, []);

  const formRefHandler = (id: string, ref: refsType) => {
    let idx = formRefs.current.length;
    let refkeys: string[] = [];
    formRefs.current.forEach((el) => refkeys.push(el.id));
    if (ref && idx < 1) {
      formRefs.current[0] = { id, ref };
      return;
    } else if (ref && idx >= 1) {
      const item = { id, ref };
      formRefs.current.forEach((el) => {
        if (el === item) return;
        else formRefs.current[idx] = item;
      });
    }
    return;
  };

  if (
    errors?._form &&
    confirm(
      `${errors._form} 수정을 계속 하시려면 취소를 눌러주세요.\n확인을 누르시면 목록으로 돌아갑니다.`
    )
  ) {
    router.push('/cms');
  }

  console.log(errors);

  return (
    <div className='contain'>
      <h2 className='sub-title'>수집 설정 수정</h2>
      <div className='form-area'>
        <form action={editFormAction}>
          <dl>
            <dt>기관</dt>
            <dd>
              <Select hide='hide' label='agency' readOnly>
                <select id={'agency'} name={'agency'}>
                  <option value={nowSetting?.agency}>
                    {nowSetting?.agency}
                  </option>
                </select>
              </Select>
              <Link
                href={'/cms/manage/agencies'}
                className='btn secondary'
                scroll={false}
              >
                <span>등록 기관 관리</span>
              </Link>
            </dd>
          </dl>
          <dl>
            <dt>수집 항목</dt>
            <dd>
              <Select hide='hide' label='collectItem' readOnly>
                <select name='collectItem' id='collectItem'>
                  <option value={nowSetting?.collectItem}>
                    {nowSetting?.collectItem}
                  </option>
                </select>
              </Select>
              <Link
                href={`/cms/manage/collectItems`}
                className='btn secondary'
                scroll={false}
              >
                <span>수집 항목 관리</span>
              </Link>
            </dd>
          </dl>
          <dl>
            <dt>수집 스케줄</dt>
            <dd>
              <Select label='collectSchedule' hide='hide'>
                <select
                  name='collectSchedule'
                  id='collectSchedule'
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    setSelectSchedule(e.target.value);
                  }}
                >
                  {scheduleType.map((item) => {
                    if (item.id === nowSetting?.scheduleType) {
                      return (
                        <option key={item.id} value={item.id} selected>
                          {item.name}
                        </option>
                      );
                    } else {
                      return (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      );
                    }
                  })}
                </select>
              </Select>
              {selectSchedule ? (
                <ScheduleForm
                  type={selectSchedule}
                  formRefHandler={formRefHandler}
                  editFormData={nowSetting}
                  errors={errors}
                />
              ) : (
                ''
              )}
            </dd>
          </dl>
          <dl>
            <dt>수집 폴더</dt>
            <dd>
              <InputText label='root' hide='hide' size='wide'>
                <input
                  type='text'
                  id='root'
                  name='root'
                  defaultValue={nowSetting?.root}
                />
              </InputText>
            </dd>
          </dl>
          <dl>
            <dt>수집 형태</dt>
            <dd>
              <Select label='collectType' hide='hide'>
                <select
                  name='collectType'
                  id='collectType'
                  ref={(ref: HTMLSelectElement) => {
                    formRefHandler('collectType', ref);
                  }}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    setSelectType(e.target.value);
                  }}
                >
                  <option value={nowSetting?.collectType}>
                    {nowSetting?.collectType.toUpperCase()}
                  </option>
                </select>
              </Select>
              {selectType ? (
                <CollectTypeForm
                  type={selectType}
                  error={errors!}
                  editFormData={nowSetting}
                />
              ) : (
                ''
              )}
            </dd>
          </dl>
          <dl>
            <dt>사용 여부</dt>
            <dd>
              <Radio options={isUsed!} />
            </dd>
          </dl>
          <div className='apply-btn'>
            <Link href={'/cms'} className='btn secondary'>
              <span>취소</span>
            </Link>
            <Button label='저장' />
          </div>
        </form>
      </div>
    </div>
  );
}
