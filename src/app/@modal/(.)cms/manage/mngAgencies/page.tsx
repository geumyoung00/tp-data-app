'use client';

import Modal from '@/src/components/modal/modal';
import Button from '@/src/components/button';
import Checkbox from '@/src/components/form/checkbox';
import InputText from '@/src/components/form/inputText';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function MngAgenciesModal() {
  const [showAddForm, setShowAddForm] = useState(false);
  const router = useRouter();

  const addItemHandler = () => setShowAddForm(true);
  const applyFormHandler = () => router.replace('/cms/create');

  return (
    <Modal title='등록 기관 관리'>
      <div className='modal-table table'>
        <table>
          <colgroup>
            <col width='6%' />
            <col width='84%' />
            <col width='10%' />
          </colgroup>
          <thead>
            <tr>
              <th>
                <Checkbox>
                  <span>내용넣기</span>
                </Checkbox>
              </th>
              <th>기관</th>
              <th>기타</th>
            </tr>
          </thead>
          <tbody>
            {showAddForm ? (
              <tr>
                <td>
                  <Checkbox>
                    <span>선택</span>
                  </Checkbox>
                </td>
                <td className='center'>
                  <InputText
                    label='신규 등록 기관 입력'
                    style='inner'
                    size='min'
                    hide='hide'
                    focus={true}
                  />
                </td>
                <td>
                  <Button label='등록' style='line' size='min' />
                </td>
              </tr>
            ) : (
              ''
            )}
            <tr>
              <td>
                <Checkbox>
                  <span>내용넣기</span>
                </Checkbox>
              </td>
              <td className='center'>기관명</td>
              <td>
                <Button
                  label='수정'
                  style='line'
                  size='min'
                  state='secondary'
                />
              </td>
            </tr>
          </tbody>
        </table>
        <div className='btn-group'>
          <Button
            label='추가'
            size='min'
            state='secondary'
            onClick={addItemHandler}
          />
          <Button label='삭제' size='min' state='tertiary' />
          <Button label='저장' size='min' onClick={applyFormHandler} />
        </div>
      </div>
    </Modal>
  );
}
