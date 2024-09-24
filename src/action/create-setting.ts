'use server';

import z from 'zod';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { postSettingAction } from './post-setting-action';

interface Errors {
  errors: ErrorsType | undefined;
}

export type ErrorsType = {
  agency?: string[];
  collectItem?: string[];
  root?: string[];
  collectSchedule?: string[];
  dailyTime?: string[];
  dailyMinutes?: string[];
  weeklyChecks?: string[];
  weeklyTime?: string[];
  weeklyMinutes?: string[];
  dayDate?: string[];
  dayTime?: string[];
  dayMinutes?: string[];
  inSchedule?: string[];
  startDate?: string[];
  endDate?: string[];
  periodChecks?: string[];
  periodTime?: string[];
  periodMinutes?: string[];
  collectType?: string[];
  apiKey?: string[];
  apiUrl?: string[];
  apiExp?: string[];
  apiParamsKey?: string[];
  isUsed?: string[];
  _form?: string;
};

export type parseType = {
  agency?: FormDataEntryValue | null;
  collectItem?: FormDataEntryValue | null;
  root?: FormDataEntryValue | null;
  collectSchedule?: FormDataEntryValue | null;
  dailyTime?: FormDataEntryValue | null;
  dailyMinutes?: FormDataEntryValue | null;
  weeklyChecks?: FormDataEntryValue[] | null;
  weeklyTime?: FormDataEntryValue | null;
  weeklyMinutes?: FormDataEntryValue | null;
  dayDate?: FormDataEntryValue | null;
  dayTime?: FormDataEntryValue | null;
  dayMinutes?: FormDataEntryValue | null;
  inSchedule?: FormDataEntryValue | null;
  startDate?: FormDataEntryValue | null;
  endDate?: FormDataEntryValue | null;
  periodChecks?: FormDataEntryValue[] | null;
  periodTime?: FormDataEntryValue | null;
  periodMinutes?: FormDataEntryValue | null;
  collectType?: FormDataEntryValue | null;
  apiKey?: FormDataEntryValue | null;
  apiUrl?: FormDataEntryValue | null;
  apiExp?: FormDataEntryValue | null;
  apiParamsKey?: FormDataEntryValue[] | null;
  apiParamsValue?: FormDataEntryValue[] | null;
  isUsed?: FormDataEntryValue | null;
};

const commonSchema = {
  agency: z.string().min(1, { message: '수집 기관을 선택하세요.' }),
  collectItem: z.string().min(1, { message: '수집 항목을 선택하세요.' }),
  root: z
    .string()
    .min(1, { message: '수집 폴더를 입력하세요.' })
    .regex(
      /^(?=.*[a-zA-Z])|(?=.*[/])|(?=.*[0-9])$/,
      '영문 또는 숫자만 입력가능합니다.'
    ),
  collectSchedule: z.string().min(1, { message: '수집 스케줄을 선택하세요.' }),
  collectType: z.string().min(1, { message: '수집 형태를 선택하세요.' }),
  isUsed: z.string({ message: '사용 여부를 반드시 선택하세요.' }),
};

const dailySchema = {
  dailyTime: z
    .string({ message: '수집 시간을 선택하세요.' })
    .min(1, { message: '수집 시간을 선택하세요.' }),
  dailyMinutes: z
    .string({ message: '수집 시간을 선택하세요.' })
    .min(1, { message: '수집 시간을 선택하세요.' }),
};

const weeklySchema = {
  weeklyChecks: z
    .string()
    .array()
    .nonempty({ message: '수집 요일을 선택하세요.' }),
  weeklyTime: z
    .string({ message: '수집 시간을 선택하세요.' })
    .min(1, { message: '수집 시간을 선택하세요.' }),
  weeklyMinutes: z
    .string({ message: '수집 시간을 선택하세요.' })
    .min(1, { message: '수집 시간을 선택하세요.' }),
};

const dateSchema = z.coerce.date({
  errorMap: (issue, { defaultError }) => ({
    message:
      issue.code === 'invalid_date' ? '수집 날짜를 선택하세요.' : defaultError,
  }),
});

const daySchema = {
  dayDate: dateSchema.min(new Date(), {
    message: '수집 날짜는 등록일 이후여야 합니다.',
  }),
  dayTime: z
    .string({ message: '수집 시간을 선택하세요.' })
    .min(1, { message: '수집 시간을 선택하세요.' }),
  dayMinutes: z
    .string({ message: '수집 시간을 선택하세요.' })
    .min(1, { message: '수집 시간을 선택하세요.' }),
};

// 날짜 데이터 타입 정의
const StartdateSchema = z.coerce.date({
  errorMap: (issue, { defaultError }) => ({
    message:
      issue.code === 'invalid_date'
        ? '수집 시작일을 선택하세요.'
        : defaultError,
  }),
});

const periodSchema = {
  inSchedule: z
    .string({ message: '기간내 수집 방법을 선택하세요.' })
    .min(1, { message: '기간내 수집 방법을 선택하세요.' }),
  startDate: StartdateSchema.min(new Date(), {
    message: '수집 시작일은 등록일 이후여야 합니다.',
  }),
  periodTime: z
    .string({ message: '기간 내 수집 시간을 선택하세요.' })
    .min(1, { message: '기간 내 수집 시간을 선택하세요.' }),
  periodMinutes: z
    .string({ message: '기간 내 수집 시간을 선택하세요.' })
    .min(1, { message: '기간 내 수집 시간을 선택하세요.' }),
};

const apiSchema = {
  apiKey: z.string().min(1, { message: 'API의 key를 입력하세요.' }),
  apiUrl: z.string().min(1, { message: 'API의 URL을 입력하세요.' }),
  apiExp: z.string().min(1, {
    message: 'API의 유효기간을 선택하세요. 대부분의 경우 유효기간은 1년입니다.',
  }),
  apiParamsKey: z
    .array(z.string())
    .min(1, { message: '하나 이상의 파라미터가 필요합니다.' }),
};

export async function createSetting(
  formState: Errors,
  formData: FormData
): Promise<Errors> {
  let result;
  const agency = formData.get('agency');
  const collectItem = formData.get('collectItem');
  const root = formData.get('root');
  const collectSchedule = formData.get('collectSchedule');
  const collectType = formData.get('collectType');
  const startDate = formData.get('startDate');
  const inSchedule = formData.get('inSchedule');
  const isUsed = formData.get('isUsed');

  const apiKey = formData.get('apiKey');
  const apiUrl = formData.get('apiUrl');
  const apiExp = formData.get('apiExp');
  const apiParamsKey = formData.getAll('apiParamsKey') as string[];
  const apiParamsValue = formData.getAll('apiParamsValue') as string[];

  const commonParse = {
    agency,
    collectItem,
    root,
    collectSchedule,
    collectType,
    isUsed,
  };
  const apiParse = { apiKey, apiExp, apiUrl, apiParamsKey, apiParamsValue };

  const startDateSchema = z.coerce.date({
    errorMap: (issue, { defaultError }) => ({
      message:
        issue.code === 'invalid_date'
          ? '수집 종료일을 선택하세요.'
          : defaultError,
    }),
  });
  const startDateParse = new Date(startDate as string);

  const periodDailySchema = {
    ...periodSchema,
    endDate: startDateSchema.min(startDateParse, {
      message: '수집 종료 날짜는 수집 시작 날짜보다 빠를 수 없습니다.',
    }),
  };

  const periodWeeklySchema = {
    ...periodSchema,
    endDate: startDateSchema.min(startDateParse, {
      message: '수집 종료 날짜는 수집 시작 날짜보다 빠를 수 없습니다.',
    }),
    periodChecks: z
      .string()
      .array()
      .nonempty({ message: '기간 내 수집 요일을 선택하세요.' }),
  };

  const checkType = (
    collectType: FormDataEntryValue | null,
    parse?: parseType | undefined
  ) => {
    const scheduleParse = {
      ...commonParse,
      ...parse,
    };

    if (!collectSchedule && !collectType) {
      return (result = z.object(commonSchema).safeParse(commonParse));
    }

    if (collectSchedule && !collectType) {
      const scheduleSchema =
        collectSchedule === 'daily'
          ? z.intersection(z.object(commonSchema), z.object(dailySchema))
          : collectSchedule === 'weekly'
          ? z.intersection(z.object(commonSchema), z.object(weeklySchema))
          : collectSchedule === 'day'
          ? z.intersection(z.object(commonSchema), z.object(daySchema))
          : collectSchedule === 'period' && inSchedule === 'periodDaily'
          ? z.intersection(z.object(commonSchema), z.object(periodDailySchema))
          : collectSchedule === 'period' && inSchedule === 'periodWeekly'
          ? z.intersection(z.object(commonSchema), z.object(periodWeeklySchema))
          : z.object(commonSchema);
      return (result = scheduleSchema.safeParse(scheduleParse));
    }

    if (!collectSchedule && collectType) {
      const typeSchema =
        collectType === 'api'
          ? z.intersection(z.object(commonSchema), z.object(apiSchema))
          : z.object(commonSchema);

      const typeParse = {
        ...commonParse,
        apiExp,
        apiKey,
        apiUrl,
        apiParamsKey,
      };

      return (result = typeSchema.safeParse(typeParse));
    }

    if (collectSchedule && collectType === 'api') {
      const scheduleApiSchema =
        collectSchedule === 'daily'
          ? z.intersection(
              z.object(commonSchema),
              z.object({ ...dailySchema, ...apiSchema })
            )
          : collectSchedule === 'weekly'
          ? z.intersection(
              z.object(commonSchema),
              z.object({ ...weeklySchema, ...apiSchema })
            )
          : collectSchedule === 'day'
          ? z.intersection(
              z.object(commonSchema),
              z.object({ ...daySchema, ...apiSchema })
            )
          : collectSchedule === 'period' && inSchedule === 'periodDaily'
          ? z.intersection(
              z.object(commonSchema),
              z.object({ ...periodDailySchema, ...apiSchema })
            )
          : collectSchedule === 'period' && inSchedule === 'periodWeekly'
          ? z.intersection(
              z.object(commonSchema),
              z.object({ ...periodWeeklySchema, ...apiSchema })
            )
          : z.object(commonSchema);

      const scheduleApiParse = {
        ...scheduleParse,
        ...apiParse,
      };

      return (result = scheduleApiSchema.safeParse({
        ...scheduleApiParse,
      }));
    }
  };

  let mergeParse: parseType = {};

  switch (collectSchedule) {
    default:
      // 모든 항복이 들어가지 않았음
      result = checkType(collectType);
      if (!result?.success) {
        return { errors: result?.error.flatten().fieldErrors };
      }

      break;

    case 'daily':
      const dailyTime = formData.get('dailyTime');
      const dailyMinutes = formData.get('dailyMinutes');
      const dailyParse = { ...commonParse, dailyTime, dailyMinutes };

      result = checkType(collectType, dailyParse);

      if (!result?.success) {
        return { errors: result?.error.flatten().fieldErrors };
      }

      mergeParse = { ...commonParse, ...apiParse, ...dailyParse };
      postSettingAction(mergeParse);

      break;

    case 'weekly':
      const weeklyChecks = formData.getAll('weeklyChecks');
      const weeklyTime = formData.get('weeklyTime');
      const weeklyMinutes = formData.get('weeklyMinutes');
      const weeklyParse = {
        ...commonParse,
        weeklyChecks,
        weeklyTime,
        weeklyMinutes,
      };
      result = checkType(collectType, weeklyParse);

      if (!result?.success) {
        return { errors: result?.error.flatten().fieldErrors };
      }

      mergeParse = { ...commonParse, ...apiParse, ...weeklyParse };
      postSettingAction(mergeParse);

      break;

    case 'day':
      const dayDate = formData.get('dayDate');
      const dayTime = formData.get('dayTime');
      const dayMinutes = formData.get('dayMinutes');
      const dayParse = { ...commonParse, dayDate, dayTime, dayMinutes };

      result = checkType(collectType, dayParse);

      if (!result?.success) {
        return { errors: result?.error.flatten().fieldErrors };
      }

      mergeParse = { ...commonParse, ...apiParse, ...dayParse };
      postSettingAction(mergeParse);

      break;

    case 'period':
      const endDate = formData.get('endDate');
      const periodChecks = formData.getAll('periodChecks');
      const periodTime = formData.get('periodTime');
      const periodMinutes = formData.get('periodMinutes');
      const periodParse = {
        ...commonParse,
        inSchedule,
        startDate,
        endDate,
        periodTime,
        periodMinutes,
      };

      let periodWeeklyParse = { ...periodParse, periodChecks };

      result =
        inSchedule === 'periodDaily'
          ? checkType(collectType, periodParse)
          : checkType(collectType, periodWeeklyParse);

      if (!result?.success) {
        return { errors: result?.error.flatten().fieldErrors };
      }

      inSchedule === 'periodDaily'
        ? (mergeParse = { ...commonParse, ...apiParse, ...periodParse })
        : (mergeParse = { ...commonParse, ...apiParse, ...periodWeeklyParse });

      postSettingAction(mergeParse);

      break;
  }

  console.log(formData);

  try {
  } catch (error) {
    if (error instanceof Error) {
      return { errors: { _form: error.message } };
    } else {
      return { errors: { _form: '잠시 후 다시 시도해주세요.' } };
    }
  }

  revalidatePath('/cms/create');
  redirect('/cms/create');
}
