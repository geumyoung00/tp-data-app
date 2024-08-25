'use client';

import Button from '@/src/components/button';
import Checkbox from '@/src/components/form/checkbox';
import InputText from '@/src/components/form/inputText';
import Table from '@/src/components/table/table';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

interface agencyInterface {
  id: number;
  name: string;
  isEdit: boolean;
}

export default function MngAgencies() {
  const [agencyList, setAgencyList] = useState<agencyInterface[] | null>(null);
  const [checkedList, setCheckedList] = useState<number[]>([]);
  const router = useRouter();
  const refs = useRef<any>({});
  const addRef = useRef<HTMLTableCellElement | null>(null);

  const fetchList = () => {
    fetch('http://localhost:9999/agencies')
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 1) {
          let newData: agencyInterface[] = [];
          data.forEach((el: agencyInterface) => {
            newData.push({ ...el, isEdit: false });
          });
          return setAgencyList(newData);
        } else setAgencyList(null);
      });
  };

  const allCheckedHandler = (checked: boolean) => {
    // checkedList에서 상태관리
    if (checked) {
      console.log('전체 선택');
      const getAllId: number[] = [];
      agencyList!.forEach((el) => getAllId.push(el.id));
      setCheckedList(getAllId);
    } else {
      setCheckedList([]);
    }
  };

  const checkedHandler = (checked: boolean, id: number) => {
    // checkedList에서 상태관리
    if (checked) {
      setCheckedList((prev) => [...prev, id]);
      return;
    } else {
      setCheckedList(checkedList.filter((el) => el !== id));
      return;
    }
  };

  //데이터 관리는 리덕스 써야 함 ***
  const formHandler = (type: string, id?: number) => {
    let refCurrent = refs.current[id!];
    const input = refCurrent?.querySelector('td.center input');

    switch (type) {
      case 'add':
        const getAddValue = addRef.current
          ?.querySelector('input')
          ?.getAttribute('value');

        const addOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: getAddValue }),
        };

        if (getAddValue) {
          fetch('http://localhost:9999/agencies', addOptions)
            .then((res) => res.json())
            .then(() => fetchList());
        } else alert('내용을 입력하세요.');
        break;

      case 'edit':
        refCurrent!
          .querySelector('td.center .input-text')
          .classList.add('active');
        input.removeAttribute('disabled');
        input.focus();

        let newAgencyList = [...agencyList!];
        newAgencyList[id! - 1] = { ...newAgencyList[id! - 1], isEdit: true };
        setAgencyList(newAgencyList);

        break;

      case 'save':
        const editedValue = input.value;
        const existValue = agencyList![id! - 1].name;

        const SavOptions = {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: editedValue }),
        };

        if (editedValue === existValue) {
          alert('수정된 내용이 없습니다. 다시 확인해주세요.');
        } else {
          let allItem: string[] = [];

          fetch(`http://localhost:9999/agencies/${id}`, SavOptions)
            .then((res) => res.json())
            .then(() => fetchList());
          refCurrent!
            .querySelector('td.center .input-text')
            .classList.remove('active');
          input.setAttribute('disabled', true);
        }

        break;

      case 'delete':
        let checkedListLength = checkedList?.length;
        const removeOptions = { method: 'DELETE' };

        if (!checkedListLength) {
          alert('선택된 항목이 없습니다.');
          break;
        } else {
          checkedList.forEach((idx) => {
            fetch(`http://localhost:9999/agencies/${idx}`, removeOptions)
              .then((res) => res.json())
              .then(() => {});
          });
          fetchList();
          break;
        }
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className='contain'>
      <h2 className='sub-title'>등록 기관 관리</h2>
      <div className='form-area'>
        <div className='table'>
          <table>
            <colgroup>
              <col width='6%' />
              <col width='84%' />
              <col width='10%' />
            </colgroup>
            <thead>
              <tr>
                <th>
                  <Checkbox
                    id='all'
                    onChangeHandler={(e: React.ChangeEvent<HTMLInputElement>) =>
                      allCheckedHandler(e.target.checked)
                    }
                  >
                    <span>내용넣기</span>
                  </Checkbox>
                </th>
                <th>기관</th>
                <th>기타</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <Checkbox disabled>
                    <span>선택</span>
                  </Checkbox>
                </td>
                <td className='center' ref={addRef}>
                  <InputText
                    label='신규 등록 기관 입력'
                    style='inner'
                    size='min'
                    hide='hide'
                    focus
                  />
                </td>
                <td>
                  <Button
                    label='등록'
                    style='line'
                    size='min'
                    onClick={() => formHandler('add')}
                  />
                </td>
              </tr>
              {agencyList ? (
                agencyList!.map(({ id, name, isEdit }) => {
                  return (
                    <tr
                      key={id}
                      ref={(el) => {
                        refs.current[id] = el;
                      }}
                    >
                      <td>
                        <Checkbox
                          id={`${id}`}
                          onChangeHandler={(
                            e: React.ChangeEvent<HTMLInputElement>
                          ) => checkedHandler(e.target.checked, id)}
                          checked={checkedList.includes(id) ? true : false}
                        >
                          <span>내용넣기</span>
                        </Checkbox>
                      </td>
                      <td className='center'>
                        <InputText
                          label={name}
                          style='inner'
                          size='min'
                          hide='hide'
                          value={name}
                          disabled={true}
                        />
                      </td>
                      <td>
                        {isEdit ? (
                          <Button
                            label='저장'
                            style='line'
                            size='min'
                            onClick={() => formHandler('save', id)}
                          />
                        ) : (
                          <Button
                            label='수정'
                            style='line'
                            size='min'
                            state='secondary'
                            onClick={() => formHandler('edit', id)}
                          />
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={3}>내용없음</td>
                </tr>
              )}
            </tbody>
          </table>
          <div className='btn-group'>
            <Button
              label='이전'
              state='secondary'
              onClick={() => router.back()}
            />
            <Button
              label='삭제'
              state='tertiary'
              onClick={() => formHandler('delete')}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
