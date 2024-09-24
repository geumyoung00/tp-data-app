'use server';

import { weeks } from '../db/date';
import { parseType } from './create-setting';

async function postSettingAction(parse: parseType) {
  let newSetting: any = {
    agency: parse.agency,
    collectItem: parse.collectItem,
    schedule: parse.collectSchedule,
    root: parse.root,
    type: parse.collectType,
    isUse: parse.isUsed,
  };

  switch (parse.collectSchedule) {
    case 'daily':
      newSetting = {
        ...newSetting,
        schedule: {
          type: parse.collectSchedule,
          time: parse.dailyMinutes + ':' + parse.dailyMinutes,
        },
      };
    case 'weekly':
      newSetting = {
        ...newSetting,
        schedule: {
          type: parse.collectSchedule,
          weeks: parse.weeklyChecks,
          time: parse.weeklyTime + ':' + parse.weeklyMinutes,
        },
      };
    case 'day':
      newSetting = {
        ...newSetting,
        schedule: {
          type: parse.collectSchedule,
          date: parse.dayDate,
          time: parse.dayTime + ':' + parse.dayMinutes,
        },
      };

    case 'period':
      newSetting = {
        ...newSetting,
        schedule: {
          type: parse.inSchedule,
          weeks: parse.periodChecks,
          date: parse.startDate + '~' + parse.endDate,
          time: parse.periodTime + ':' + parse.periodMinutes,
        },
      };
  }

  if (parse.collectType === 'api') {
    const keys = parse.apiParamsValue;
    const vals = parse.apiParamsValue;
    let newParams: { id: number; key: string; value: string }[] = [];

    keys?.forEach((key, i) => {
      newParams.push({
        id: i + 1,
        key: key as string,
        value: vals![i] as string,
      });
    });

    newSetting = {
      ...newSetting,
      apiKey: parse.apiKey,
      apiUrl: parse.apiUrl,
      apiExperiod: parse.apiExp,
      apiPrmt: newParams,
    };
  }

  const addSettingOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newSetting),
  };

  try {
    await fetch(`http://localhost:9999/settings`, addSettingOptions)
      .then((res) => res.json())
      .then((res) => console.log(res));
  } catch (error) {
    if (error instanceof Error) {
      return { errors: { _form: error.message } };
    } else {
      return { errors: { _form: '잠시 후 다시 시도해주세요.' } };
    }
  }
}

export { postSettingAction };
