'use client';

import { useEffect, useRef, useState } from 'react';
import Button from '../button';
import Checkbox from '../form/checkbox';
import InputText from '../form/inputText';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  agenciesUpdateHandler,
  mngDataType,
} from '@/src/action/form/mng-update';
import { fetchAgencies } from '@/src/db/agencies';
import { fetchCollectItems } from '@/src/db/collectItems';

export default function MngTable() {
  const [mngData, setMngData] = useState<mngDataType[]>([]);
  const [checkedList, setCheckedList] = useState<string[]>([]);
  const pathname = usePathname();
  const nowData = pathname.includes('agencies')
    ? 'agencies'
    : pathname.includes('collectItems')
    ? 'collectItems'
    : '';

  const checkPath = pathname.includes('agencies')
    ? '기관'
    : pathname.includes('collectItems')
    ? '수집 항목'
    : '';

  const editIdRefs = useRef<HTMLInputElement[]>([]);
  const editNameRefs = useRef<HTMLInputElement[]>([]);
  const addRefs = useRef<HTMLInputElement[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (pathname.includes('agencies')) {
      fetchAgencies().then((data) => {
        let newDatas: mngDataType[] = [];
        data.forEach((el: { id: string; name: string }) =>
          newDatas.push({ id: el.id, name: el.name, isEdit: false })
        );
        setMngData(newDatas);
      });
    }
    if (pathname.includes('collectItems')) {
      fetchCollectItems().then((data) => {
        let newDatas: mngDataType[] = [];
        data.forEach((el: { id: string; name: string }) =>
          newDatas.push({ id: el.id, name: el.name, isEdit: false })
        );
        setMngData(newDatas);
      });
    }
  }, []);

  const checkedHandler = (checked: boolean, id: string) => {
    if (checked) {
      return setCheckedList((prev) => [...prev, id]);
    } else {
      return setCheckedList(checkedList.filter((el) => el !== id));
    }
  };

  const allCheckedHandler = (checked: boolean) => {
    if (checked) {
      const getAllId: string[] = [];
      mngData!.forEach((el) => getAllId.push(el.id));
      return setCheckedList(getAllId);
    } else {
      return setCheckedList([]);
    }
  };

  const updateHandler = (
    type: string,
    e?: React.MouseEvent<HTMLElement, MouseEvent>,
    id?: string
  ) => {
    e!.preventDefault();
    const nowIdx = mngData.findLastIndex((el) => el.id === id);
    const selectNameInput = editNameRefs.current[nowIdx];
    const selectIdInput = editIdRefs.current[nowIdx];
    const selectNameText = selectNameInput?.value;
    const selectIdText = selectIdInput?.value;
    let changeData = { id: selectIdText, name: selectNameText, isEdit: true };
    let changeArr = [...mngData];

    switch (type) {
      case 'add':
        const addIdInput = addRefs.current[0];
        const addNameInput = addRefs.current[1];
        const addNameValue = addNameInput.value;
        const addIdValue = addIdInput.value;
        const notKor = /^[a-zA-z0-9]+$/;

        const compareName = mngData.filter(
          (el) =>
            el.name.toLocaleLowerCase() ===
              addNameInput.value.toLocaleLowerCase() ||
            el.name.trim().split(' ').join('') ===
              addNameInput.value.trim().split(' ').join('')
        );

        const compareId = mngData.filter(
          (el) =>
            el.id.toLocaleLowerCase() ===
              addIdInput.value.toLocaleLowerCase() ||
            el.id.trim().split(' ').join('') ===
              addIdInput.value.trim().split(' ').join('')
        );

        if (!addNameInput.value || compareName.length > 0) {
          !addNameInput.value
            ? alert(checkPath + ' 이름을 입력하세요.')
            : alert('동일한 이름이 있습니다.');
          addNameInput.focus();
          return;
        }

        if (!addIdInput.value || compareId.length > 0) {
          !addIdInput.value
            ? alert(checkPath + ' 아이디를 입력하세요.')
            : alert('동일한 아이디가 있습니다.');
          addIdInput.focus();
          return;
        }

        if (!notKor.test(addIdValue)) {
          alert('영문 대소문자와 숫자만 입력할 수 있습니다.');
          addIdInput.value = '';
          addIdInput.focus();
          return;
        }

        const newData = {
          type,
          data: nowData,
          item: { id: addIdValue, name: addNameValue },
        };

        agenciesUpdateHandler(newData);
        setMngData((prev) => [
          ...prev,
          {
            id: addIdValue,
            name: addNameValue,
            isEdit: false,
          },
        ]);

        addNameInput.value = '';
        addIdInput.value = '';
        break;

      case 'delete':
        const selectItems = mngData.filter((el) => checkedList.includes(el.id));

        if (checkedList.length < 1) {
          alert('선택된 항목이 없습니다.');
          return;
        }

        if (checkedList.length === mngData.length) {
          if (confirm(`전체 항목을 삭제하시나요?`)) {
            agenciesUpdateHandler({ type, data: nowData, item: checkedList });

            setMngData([]);
            return;
          } else return;
        }

        if (checkedList.length >= 1) {
          const filterNames = new Array();
          selectItems.forEach((el) => filterNames.push(el.name));
          if (
            confirm(`선택된 항목을 확인해주세요.\n\n - ${filterNames.join(
              '\n - '
            )}\n\n위 항목을 삭제할까요?
            `)
          ) {
            agenciesUpdateHandler({ type, data: nowData, item: checkedList });
            setMngData(
              mngData.filter((item) => !filterNames.includes(item.name))
            );
          } else setCheckedList([]);
        }

        break;

      case 'edit':
        selectNameInput.removeAttribute('readOnly');
        selectNameInput.focus();
        selectNameInput.value = '';
        selectNameInput.value = selectNameText;

        changeArr[nowIdx] = changeData;

        setMngData(changeArr);

        break;

      case 'save':
        const prevName = mngData[nowIdx].name
          .trim()
          .split(' ')
          .join('')
          .toUpperCase();

        const nowName = selectNameText;

        if (prevName === nowName) {
          if (
            confirm(
              `수정된 내용이 없습니다.\n확인을 누르시면 수정창이 닫힙니다.`
            )
          ) {
            return (
              selectNameInput.setAttribute('readOnly', 'true'),
              (changeData = { id: selectIdText, name: nowName, isEdit: false }),
              (changeArr[nowIdx] = changeData),
              setMngData(changeArr)
            );
          } else return selectNameInput.focus();
        }

        if (prevName !== nowName.trim().split(' ').join('').toUpperCase())
          agenciesUpdateHandler({
            type,
            data: nowData,
            item: { id: selectIdText, name: nowName },
          });

        changeData = { id: selectIdText, name: nowName, isEdit: false };
        changeArr[nowIdx] = changeData;

        selectNameInput.setAttribute('readOnly', 'true');
        selectIdInput.setAttribute('readOnly', 'true');
        setMngData(changeArr);

        break;
    }
  };

  return (
    <div className='table'>
      <table>
        <colgroup>
          <col width='6%' />
          <col width='43%' />
          <col width='43%' />
          <col width='8%' />
        </colgroup>
        <thead>
          <tr>
            <th>
              <Checkbox
                name='all'
                value='all'
                onChangeHandler={(e: React.ChangeEvent<HTMLInputElement>) =>
                  allCheckedHandler(e.target.checked)
                }
                checked={checkedList.length === mngData.length}
              >
                <span>전체 선택</span>
              </Checkbox>
            </th>
            <th>{checkPath} 아이디</th>
            <th>{checkPath} 이름</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          {!mngData ? (
            <tr>
              <td colSpan={3}>등록된 데이터가 없습니다.</td>
            </tr>
          ) : (
            <>
              <tr>
                <td>
                  <Checkbox name='sample' value='sample' disabled>
                    <span>선택</span>
                  </Checkbox>
                </td>
                <td>
                  <InputText
                    label={`신규 등록 ${checkPath} 입력`}
                    size='min'
                    hide='hide'
                  >
                    <input
                      type='text'
                      name='newAgencyName'
                      id={`신규 등록 ${checkPath} 입력`}
                      ref={(el: HTMLInputElement) => {
                        addRefs.current[0] = el;
                      }}
                    />
                  </InputText>
                </td>
                <td>
                  <InputText
                    label={`신규 등록 ${checkPath} 아이디 입력`}
                    size='min'
                    hide='hide'
                  >
                    <input
                      type='text'
                      name='newAgencyId'
                      autoFocus
                      id={`신규 등록 ${checkPath} 아이디 입력`}
                      ref={(el: HTMLInputElement) => {
                        addRefs.current[1] = el;
                      }}
                    />
                  </InputText>
                </td>
                <td>
                  <Button
                    label='등록'
                    style='line'
                    size='min'
                    onClick={(e) => updateHandler('add', e)}
                  />
                </td>
              </tr>
              {mngData.map((item, idx) => {
                return (
                  <tr key={idx}>
                    <td>
                      <Checkbox
                        name={item.name}
                        value={JSON.stringify(item.id)}
                        onChangeHandler={(
                          e: React.ChangeEvent<HTMLInputElement>
                        ) => checkedHandler(e.target.checked, item.id)}
                        checked={checkedList.includes(item.id)}
                      >
                        <span>{item.name}</span>
                      </Checkbox>
                    </td>
                    <td>
                      <InputText label={item.name} size='min' hide='hide'>
                        <input
                          type='text'
                          name={item.id + 'Id'}
                          id={item.name}
                          readOnly
                          defaultValue={item.id}
                          ref={(el) => {
                            (editIdRefs.current![
                              idx
                            ] as unknown as HTMLInputElement | null) = el;
                          }}
                        />
                      </InputText>
                    </td>
                    <td>
                      <InputText label={item.name} size='min' hide='hide'>
                        <input
                          type='text'
                          name={item.id + 'Name'}
                          readOnly
                          defaultValue={item.name}
                          ref={(el) => {
                            (editNameRefs.current![
                              idx
                            ] as unknown as HTMLInputElement | null) = el;
                          }}
                        />
                      </InputText>
                    </td>
                    <td>
                      {item.isEdit ? (
                        <Button
                          label='저장'
                          style='line'
                          size='min'
                          onClick={(e) => updateHandler('save', e, item.id)}
                        />
                      ) : (
                        <Button
                          label='수정'
                          style='line'
                          size='min'
                          state='secondary'
                          onClick={(e) => updateHandler('edit', e, item.id)}
                        />
                      )}
                    </td>
                  </tr>
                );
              })}
            </>
          )}
        </tbody>
      </table>
      <div className='btn-group in-modal'>
        <Button
          label='삭제'
          state='tertiary'
          onClick={(e) => updateHandler('delete', e)}
        />
        <Button label='이전' state='secondary' onClick={() => router.back()} />
      </div>
    </div>
  );
}
