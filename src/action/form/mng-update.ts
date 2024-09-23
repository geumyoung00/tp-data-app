'use server';

type mngDataType = {
  id: string;
  name: string;
  isEdit: boolean;
};

type mngUpdateDataType = {
  type: string;
  item: { id: string; name: string };
};

export type mngRemoveDataType = {
  type: string;
  item: string[];
};

async function mngUpdateHandler(el: mngUpdateDataType | mngRemoveDataType) {
  if (el.type === 'add') {
    const { item } = el as mngUpdateDataType;

    const addDataOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: item.name, id: item.id }),
    };

    await fetch(`http://localhost:9999/agencies`, addDataOptions).then((res) =>
      res.json()
    );
  }

  if (el.type === 'delete') {
    const deleteDataOptions = { method: 'DELETE' };
    let deleteItem: string[] = [...(el.item as string[])];
    if (deleteItem.length === 1) {
      await fetch(
        `http://localhost:9999/agencies/${deleteItem[0]}`,
        deleteDataOptions
      )
        .then((res) => res.json())
        .then(() => {});
      return;
    } else {
      deleteItem.forEach((n: any) => {
        fetch(`http://localhost:9999/agencies/${n}`, deleteDataOptions)
          .then((res) => res.json())
          .then(() => {});
      });
    }
  }

  if (el.type === 'save') {
    const { item } = el as mngUpdateDataType;

    const SaveDataOptions = {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: item.id, name: item.name }),
    };

    await fetch(`http://localhost:9999/agencies/${item.id}`, SaveDataOptions)
      .then((res) => res.json())
      .then(() => {});
  }
}

export { mngUpdateHandler };
export type { mngDataType, mngUpdateDataType };
