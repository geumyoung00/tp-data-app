'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import {
  apiSchema,
  dailyschema,
  dateInvalid,
  daySchema,
  endDateInvalid,
  scheduleSchema,
  schema,
  weeklySchema,
} from './setting-schema';
import { Errors } from './setting-schema';
import { z } from 'zod';

async function settingRemoveAction(id: string) {
  const deleteOptions = { method: 'DELETE' };
  await fetch(`http://localhost:9999/settings/${id}`, deleteOptions).then(
    (res) => res.json()
  );
}

async function settingFormHandler(
  { type, id }: { type: string; id?: string },
  formState: Errors,
  formData: FormData
): Promise<Errors> {
  const agency = formData.get('agency');
  const collectItem = formData.get('collectItem');
  const root = formData.get('root');
  const collectSchedule = formData.get('collectSchedule');
  const time = formData.get('time');
  const minutes = formData.get('minutes');
  const weeks = formData.getAll('weeks');
  const date = formData.get('date');
  const endDate = formData.get('endDate');
  const inSchedule = formData.get('inSchedule');
  const collectType = formData.get('collectType');
  const apiKey = formData.get('apiKey');
  const apiUrl = formData.get('apiUrl');
  const apiExperiod = formData.get('apiExp');
  const apiParamsKey = formData.getAll('apiParamsKey');
  const apiParamsValue = formData.getAll('apiParamsValue');
  const isUsed = formData.get('isUsed');

  let result: any = z.object({ ...schema }).safeParse({
    agency,
    collectItem,
    scheduleType: collectSchedule,
    root,
    collectType,
    isUsed,
  });

  let parse: any = {
    agency,
    collectItem,
    scheduleType: collectSchedule,
    root,
    isUsed: isUsed === 'use' ? true : false,
    collectType,
    schedule: { time, minutes },
  };

  let newSetting: any = {
    ...parse,
  };

  const checkSchedule = (typeParse?: any) => {
    const today = new Date();
    const yesterday = new Date(today.setDate(today.getDate() - 1));

    if (!collectSchedule) {
      result;
    } else if (collectSchedule === 'daily') {
      newSetting = {
        ...newSetting,
        collectTypeInfo: { ...typeParse },
      };

      result = z
        .intersection(z.object({ ...dailyschema }), z.object({ ...apiSchema }))
        .safeParse({ ...newSetting });
    } else if (collectSchedule === 'weekly') {
      newSetting = {
        ...newSetting,
        schedule: {
          time,
          minutes,
          weeks,
        },
        collectTypeInfo: { ...typeParse },
      };

      result = z
        .intersection(z.object({ ...weeklySchema }), z.object({ ...apiSchema }))
        .safeParse({ ...newSetting });
    } else if (collectSchedule === 'day') {
      newSetting = {
        ...newSetting,
        schedule: {
          time,
          minutes,
          date,
        },
        collectTypeInfo: { ...typeParse },
      };
      result = z
        .intersection(z.object({ ...daySchema }), z.object({ ...apiSchema }))
        .safeParse({ ...newSetting });
    } else if (inSchedule && inSchedule === 'periodDaily') {
      const periodDaily = {
        ...schema,
        schedule: z.object({
          date: dateInvalid.min(yesterday, {
            message: '선택된 수집일은 오늘 이후여야 합니다.',
          }),
          endDate: endDateInvalid.min(new Date(date as string), {
            message: '수집 종료일은 수집 시작일보다 빠를 수 없습니다.',
          }),
          ...scheduleSchema,
        }),
      };

      newSetting = {
        ...newSetting,
        schedule: {
          time,
          minutes,
          date,
          endDate,
        },
        collectTypeInfo: { ...typeParse },
      };

      result = z
        .intersection(z.object({ ...periodDaily }), z.object({ ...apiSchema }))
        .safeParse({ ...newSetting });
    } else if (inSchedule && inSchedule === 'periodWeekly') {
      newSetting = {
        ...newSetting,
        schedule: {
          time,
          minutes,
          date,
          endDate,
          weeks,
        },
        collectTypeInfo: { ...typeParse },
      };

      const periodWeekly = {
        ...schema,
        schedule: z.object({
          date: dateInvalid.min(yesterday, {
            message: '선택된 수집일은 오늘 이후여야 합니다.',
          }),
          endDate: dateInvalid.min(new Date(date as string), {
            message: '수집 종료일은 수집 시작일보다 빠를 수 없습니다.',
          }),
          weeks: z
            .string()
            .array()
            .nonempty({ message: '수집 요일을 선택하세요.' }),
          ...scheduleSchema,
        }),
      };

      result = z
        .intersection(z.object({ ...periodWeekly }), z.object({ ...apiSchema }))
        .safeParse({ ...newSetting });
    }
  };

  switch (collectType) {
    default:
      checkSchedule();
      break;

    case 'api':
      let parmters: { key: string; value: string }[] = [];
      const apiParse = { apiKey, apiUrl, apiExperiod, apiPrmt: parmters };
      apiParamsKey.forEach((el, idx) =>
        parmters.push({
          key: el as string,
          value: apiParamsValue[idx] as string,
        })
      );

      checkSchedule(apiParse);
      break;
  }

  // 수정사항비교
  if (type === 'edit') {
    // 1. 객체의 key 순서를 동일하게 맞춰주기
    newSetting = { ...newSetting, id: parseInt(id as string) };
    let newSettingsSort = Object.keys(newSetting)
      .sort()
      .reduce((obj: any, key) => ((obj[key] = newSetting[key]), obj), {});
    newSettingsSort.schedule = Object.keys(newSetting.schedule)
      .sort()
      .reduce(
        (obj: any, key) => ((obj[key] = newSetting.schedule[key]), obj),
        {}
      );
    newSettingsSort.collectTypeInfo = Object.keys(newSetting.collectTypeInfo)
      .sort()
      .reduce(
        (obj: any, key) => ((obj[key] = newSetting.collectTypeInfo[key]), obj),
        {}
      );

    const prevSetting = await fetch(
      `http://localhost:9999/settings/${id}`
    ).then((res) => res.json());
    let prevSettingSort = Object.keys(prevSetting)
      .sort()
      .reduce((obj: any, key) => ((obj[key] = prevSetting[key]), obj), {});
    prevSettingSort.schedule = Object.keys(prevSetting.schedule)
      .sort()
      .reduce(
        (obj: any, key) => ((obj[key] = prevSetting.schedule[key]), obj),
        {}
      );
    prevSettingSort.collectTypeInfo = Object.keys(prevSetting.collectTypeInfo)
      .sort()
      .reduce(
        (obj: any, key) => ((obj[key] = prevSetting.collectTypeInfo[key]), obj),
        {}
      );

    const compareSetting =
      JSON.stringify(prevSettingSort) === JSON.stringify(newSettingsSort);

    if (compareSetting) return { errors: { _form: '수정된 사항이 없습니다.' } };
  }

  if (!result?.success) {
    return { errors: result?.error.flatten().fieldErrors };
  }

  try {
    if (type === 'create') {
      const addSettingOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSetting),
      };
      await fetch(`http://localhost:9999/settings`, addSettingOptions).then(
        (res) => res.json()
      );
    }

    if (type === 'edit') {
      const editSettingOptions = {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSetting),
      };

      await fetch(
        `http://localhost:9999/settings/${id}`,
        editSettingOptions
      ).then((res) => res.json());
    }
  } catch (error) {
    if (error instanceof Error) {
      return { errors: { _form: error.message } };
    } else {
      return { errors: { _form: '잠시 후 다시 시도해주세요.' } };
    }
  }

  revalidatePath('/cms');
  redirect('/cms');
}

export { settingFormHandler, settingRemoveAction };
