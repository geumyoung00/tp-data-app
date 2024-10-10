'use client';

import { useEffect, useRef, useState } from 'react';
import Button from '../button';
import InputText from './inputText';
import Select from './select';
import { ErrorsType } from '@/src/action/setting-schema';
import { settingType } from '@/src/db/settings';

type apiParamsType = {
  key: string;
  value: string;
};

type AddErrorType = { key: string; value: string };

export default function CollectTypeForm({
  type,
  error,
  editFormData,
}: {
  type: string;
  error: ErrorsType;
  editFormData?: settingType;
}) {
  switch (type) {
    case 'api':
      const [apiParams, setApiParams] = useState<apiParamsType[]>();
      const [addError, setAddError] = useState<AddErrorType>({
        key: '',
        value: '',
      });
      const addApiRefs = useRef<HTMLInputElement[]>([]);

      useEffect(() => {
        if (editFormData) {
          setApiParams(editFormData.collectTypeInfo.apiPrmt);
        }
      }, []);

      const addParamsHandler = (e: React.FormEvent) => {
        e.preventDefault();
        const key = addApiRefs.current[0].value;
        const value = addApiRefs.current[1].value;
        const findSameKey = apiParams?.filter((el) => el.key === key).join();
        const findSameValue = apiParams
          ?.filter((el) => el.value === value)
          .join();

        if (!key) {
          return setAddError({ ...addError, key: 'key를 입력하세요.' });
        } else if (!value) {
          return setAddError({ key: '', value: 'value를 입력하세요.' });
        }

        if (findSameKey) {
          return setAddError({
            ...addError,
            key: '동일한 key를 가진 파라미터가 있습니다.',
          });
        } else if (findSameValue) {
          return setAddError({
            key: '',
            value: '동일한 value를 가진 파라미터가 있습니다.',
          });
        }

        if (!apiParams) {
          setApiParams([{ key, value }]);
        } else {
          setApiParams([...apiParams, { key, value }]);
        }

        setAddError({ key: '', value: '' });
        addApiRefs.current[0].value = '';
        addApiRefs.current[1].value = '';
        error.apiParamsKey = undefined;
      };

      const removeParamsHandler = (e: React.FormEvent, idx: number) => {
        e.preventDefault();
        const filterIdx = apiParams?.filter((obj, i) => i !== idx);
        setApiParams(filterIdx);
      };

      return (
        <>
          <div className='inner-form block'>
            <dl>
              <dt>KEY</dt>
              <dd>
                <InputText label='apiKey' hide='hide' size='wide'>
                  <input
                    type='text'
                    id='apiKey'
                    name='apiKey'
                    autoFocus={!editFormData ? true : false}
                    defaultValue={editFormData?.collectTypeInfo.apiKey}
                  />
                </InputText>
                {error?.apiKey ? (
                  <p className='valid-script'>{error.apiKey}</p>
                ) : (
                  ''
                )}
              </dd>
            </dl>
            <dl>
              <dt>URL</dt>
              <dd>
                <InputText label='apiUrl' hide='hide' size='wide'>
                  <input
                    type='text'
                    id='apiUrl'
                    name='apiUrl'
                    defaultValue={editFormData?.collectTypeInfo.apiUrl}
                  />
                </InputText>
                {error?.apiUrl ? (
                  <p className='valid-script'>{error.apiUrl}</p>
                ) : (
                  ''
                )}
              </dd>
            </dl>
            <dl>
              <dt>유효기간</dt>
              <dd>
                <Select label='apiExp' forLabel='apiExp' hide='hide'>
                  <select name='apiExp' id='apiExp'>
                    <option value='1year'>1년</option>
                  </select>
                </Select>
                {error?.apiExp ? (
                  <p className='valid-script'>{error.apiExp}</p>
                ) : (
                  ''
                )}
              </dd>
            </dl>
            <dl>
              <dt>파라미터</dt>
              <dd>
                <ul className='parameters'>
                  <li className='add-params'>
                    <InputText label='newApiParamsKey' hide='hide' size='min'>
                      <input
                        type='text'
                        id='newApiParamsKey'
                        name='newApiParamsKey'
                        ref={(el) => {
                          addApiRefs.current[0] = el as HTMLInputElement;
                        }}
                      />
                    </InputText>
                    <InputText label='newApiParamsValue' hide='hide' size='min'>
                      <input
                        type='text'
                        id='newApiParamsValue'
                        name='newApiParamsValue'
                        ref={(el) => {
                          addApiRefs.current[1] = el as HTMLInputElement;
                        }}
                      />
                    </InputText>
                    <Button
                      size='min'
                      label='추가'
                      icon='add'
                      type='icon-only'
                      onClick={(e) => addParamsHandler(e)}
                    />
                  </li>
                  {apiParams?.map((el, idx) => {
                    return (
                      <li key={el.key}>
                        <InputText
                          label={idx + 'apiParamsKey'}
                          hide='hide'
                          size='min'
                        >
                          <input
                            type='text'
                            id={idx + 'apiParamsKey'}
                            name='apiParamsKey'
                            defaultValue={el.key}
                            readOnly
                          />
                        </InputText>
                        <InputText
                          label={idx + 'apiParamsValue'}
                          hide='hide'
                          size='min'
                        >
                          <input
                            type='text'
                            id={idx + 'apiParamsValue'}
                            name='apiParamsValue'
                            defaultValue={el.value}
                            readOnly
                          />
                        </InputText>
                        <Button
                          size='min'
                          label='삭제'
                          icon='remove'
                          type='icon-only'
                          state='tertiary'
                          onClick={(e) => removeParamsHandler(e, idx)}
                        />
                      </li>
                    );
                  })}
                </ul>
                {addError.key || addError.value ? (
                  <p className='valid-script'>
                    {addError.key || addError.value}
                  </p>
                ) : error?.apiParamsKey ? (
                  <p className='valid-script'>{error.apiParamsKey}</p>
                ) : (
                  ''
                )}
              </dd>
            </dl>
          </div>
        </>
      );
  }
}
