'use server';

export type settingType = {
  id: string;
  agency: string;
  collectItem: string;
  scheduleType: string;
  schedule: {
    hour: string;
    minutes: string;
    weeks?: [string];
    date?: string;
    endDate?: string;
  };
  root: string;
  collectType: string;
  collectTypeInfo: {
    apiKey?: string;
    apiUrl?: string;
    apiExperiod?: string;
    apiPrmt?: [{ id: number; key: string; value: string }];
  };
  isUsed: boolean;
};

export type radioType = {
  label: string;
  name: string;
  value: string;
  checked?: boolean;
  disabled?: boolean;
};

type SearchSettingErrors = {
  errors: undefined | { _form?: string };
  filterd?: settingType[];
};

async function fetchSettings() {
  const response = await fetch('http://localhost:9999/settings', {
    cache: 'no-store',
  });
  return response.json();
}

async function fetchSearchSettings(
  formstate: SearchSettingErrors,
  formData: FormData
): Promise<SearchSettingErrors> {
  const searchAgency = formData.get('searchAgency') as string;
  const searchKeyword = formData.get('searchKeyword') as string;
  let result: settingType[];

  switch (searchAgency) {
    case 'all':
      if (!searchKeyword) {
        result = await fetch(`http://localhost:9999/settings`, {
          cache: 'no-cache',
        }).then((res) => res.json());
        return { errors: undefined, filterd: result };
      }

      result = await fetch(
        `http://localhost:9999/settings/?q=${searchKeyword}`,
        {
          cache: 'no-cache',
        }
      ).then((res) => res.json());
      break;

    default:
      result = await fetch(
        `http://localhost:9999/settings/?agency=${searchAgency}${
          searchKeyword ? `&q=${searchKeyword}` : ''
        }`,
        {
          cache: 'no-cache',
        }
      ).then((res) => res.json());
      break;
  }

  if (result.length < 1) return { errors: { _form: '검색 결과가 없습니다.' } };

  return { errors: undefined, filterd: result };
}

export { fetchSettings, fetchSearchSettings };
