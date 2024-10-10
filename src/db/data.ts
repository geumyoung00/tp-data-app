'use server';

import { redirect } from 'next/navigation';

export type dataType = {
  id: number;
  settingId: number;
  agency: string;
  collectItem: string;
  root: string;
  collectType: string;
  date: string;
  time: string;
  state: string;
  log: string;
};

type SearchDataErrors = {
  errors: undefined | { _form?: string };
  filterd?: dataType[];
};

async function fetchData() {
  const response = await fetch('http://localhost:9999/data', {
    cache: 'no-store',
  });

  return response.json();
}

async function fetchSearchData(
  formstate: SearchDataErrors,
  formData: FormData
): Promise<SearchDataErrors> {
  const searchAgency = formData.get('searchAgency');
  const searchStartDate = formData.get('searchStartDate');
  const searchEndDate = formData.get('searchEndDate');
  let data: dataType[];

  switch (searchAgency) {
    case 'all':
      if (!searchStartDate) {
        data = await fetch(`http://localhost:9999/data`).then((res) =>
          res.json()
        );
        return { errors: undefined, filterd: data };
      }

      if (searchStartDate && !searchEndDate)
        return { errors: { _form: '검색 종료일은 오늘 날짜로 설정됩니다.' } };

      data = await fetch(
        `http://localhost:9999/data/?date_gte=${searchStartDate}&date_lte=${searchEndDate}`
      ).then((res) => res.json());

      if (data.length < 1)
        return { errors: { _form: '검색 결과가 없습니다.' } };

      return { errors: undefined, filterd: data };

    default:
      if (!searchStartDate) {
        data = await fetch(
          `http://localhost:9999/data/?agency=${searchAgency}`
        ).then((res) => res.json());
      } else {
        data = await fetch(
          `http://localhost:9999/data/?agency=${searchAgency}&date_gte=${searchStartDate}&date_lte=${searchEndDate}`
        ).then((res) => res.json());
      }

      if (data.length < 1)
        return { errors: { _form: '검색 결과가 없습니다.' } };

      return { errors: undefined, filterd: data };
  }
}

export { fetchData, fetchSearchData };
