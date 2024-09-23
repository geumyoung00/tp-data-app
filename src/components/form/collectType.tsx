'use client';

import { useEffect, useRef, useState } from 'react';
import Button from '../button';
import InputText from './inputText';
import Select from './select';
import { ErrorsType } from '@/src/action/create-setting';

type apiParamsType = {
  id: number;
  key: string;
  value: string;
};

type AddErrorType = { key: string; value: string };

export default function CollectTypeForm({
  type,
  error,
}: {
  type: string;
  error: ErrorsType;
}) {
  switch (type) {
    case 'api':
      const [apiParams, setApiParams] = useState<apiParamsType[]>();
      const [addError, setAddError] = useState<AddErrorType>({
        key: '',
        value: '',
      });
      const addApiRefs = useRef<HTMLInputElement[]>([]);

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
          console.log(findSameKey);
          return setAddError({
            ...addError,
            key: '동일한 key를 가진 파라미터가 있습니다.',
          });
        } else if (findSameValue) {
          console.log(findSameKey);
          return setAddError({
            key: '',
            value: '동일한 value를 가진 파라미터가 있습니다.',
          });
        }

        if (!apiParams) {
          setApiParams([{ id: 0, key, value }]);
        } else {
          setApiParams([
            ...apiParams,
            { id: apiParams.length + 1, key, value },
          ]);
        }

        setAddError({ key: '', value: '' });
        addApiRefs.current[0].value = '';
        addApiRefs.current[1].value = '';
        error.apiParamsKey = undefined;
      };

      const removeParamsHandler = (e: React.FormEvent, id: number) => {
        e.preventDefault();
        const filterIdx = apiParams?.filter((obj) => obj.id !== id);
        setApiParams(filterIdx);
      };

      return (
        <>
          <div className='inner-form block'>
            <dl>
              <dt>KEY</dt>
              <dd>
                <InputText label='apiKey' hide='hide' size='wide'>
                  <input type='text' id='apiKey' name='apiKey' autoFocus />
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
                  <input type='text' id='apiUrl' name='apiUrl' />
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
                <Select label='apiExp' hide='hide'>
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
                  {apiParams?.map((el) => {
                    return (
                      <li key={el.id}>
                        <InputText label='apiParamsKey' hide='hide' size='min'>
                          <input
                            type='text'
                            id='apiParamsKey'
                            name='apiParamsKey'
                            defaultValue={el.key}
                            readOnly
                          />
                        </InputText>
                        <InputText
                          label='apiParamsValue'
                          hide='hide'
                          size='min'
                        >
                          <input
                            type='text'
                            id='apiParamsValue'
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
                          onClick={(e) => removeParamsHandler(e, el.id)}
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
