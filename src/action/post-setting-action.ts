'use server';

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

  if (parse.collectSchedule === 'daily') {
    newSetting = {
      ...newSetting,
      schedule: {
        type: parse.collectItem,
        time: parse.dailyMinutes + ':' + parse.dailyMinutes,
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

    console.error();
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
