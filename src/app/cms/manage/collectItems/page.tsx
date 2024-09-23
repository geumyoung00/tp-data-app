import MngTable from '@/src/components/table/mngTable';
import { mngDataType, mngUpdateDataType } from '@/src/action/form/mng-update';

export default async function MngCollectItems() {
  const response = await fetch('http://localhost:9999/collectItems', {
    cache: 'no-store',
  });
  const result = await response.json();
  let agencyList: mngDataType[] = [];

  if (result.length > 1) {
    const data = [...result];
    data.forEach((el) => {
      return agencyList.push({ ...el, isEdit: false });
    });
  }

  async function formHandler(el: mngUpdateDataType) {
    'use server';

    if (el.type === 'add') {
      const addOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: el.item }),
      };

      await fetch(`http://localhost:9999/collectItems`, addOptions)
        .then((res) => res.json())
        .then(() => {});
    }

    if (el.type === 'save') {
      const SavOptions = {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: el.item }),
      };

      await fetch(`http://localhost:9999/collectItems/${el.id}`, SavOptions)
        .then((res) => res.json())
        .then(() => {});
    }

    if (el.type === 'delete') {
      const deleteOptions = { method: 'DELETE' };
      let deleteItem = el.item;
      if (deleteItem.length === 1) {
        await fetch(
          `http://localhost:9999/collectItems/${deleteItem[0]}`,
          deleteOptions
        )
          .then((res) => res.json())
          .then(() => {});
        return;
      } else {
        deleteItem.forEach((n) => {
          fetch(`http://localhost:9999/collectItems/${n}`, deleteOptions)
            .then((res) => res.json())
            .then(() => {});
        });
      }
    }
  }

  return (
    <div className='contain'>
      <h2 className='sub-title'>등록 기관 관리</h2>
      <div className='form-area'>
        {agencyList ? (
          <MngTable data={agencyList} />
        ) : (
          <table className='empty'>
            <tbody>
              <tr>
                <td>등록된 데이터가 없습니다.</td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
