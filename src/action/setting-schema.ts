import { string, z } from 'zod';

export interface Errors {
  errors: ErrorsType | undefined;
}

export type ErrorsType = {
  agency?: string[];
  collectItem?: string[];
  root?: string[];
  scheduleType?: string[];
  schedule?: string[];
  collectSchedule?: string[];
  collectType?: string[];
  apiKey?: string[];
  apiUrl?: string[];
  apiExp?: string[];
  apiParamsKey?: string[];
  isUsed?: string[];
  _form?: string;
};

const schema = {
  agency: z.string().min(1, { message: '수집 기관을 선택하세요.' }),
  collectItem: z.string().min(1, { message: '수집 항목을 선택하세요.' }),
  scheduleType: z.string().min(1, { message: '수집 스케줄을 선택하세요.' }),
  root: z
    .string()
    .min(1, { message: '수집 폴더를 입력하세요.' })
    .regex(
      /^(?=.*[a-zA-Z])|(?=.*[/])|(?=.*[0-9])$/,
      '영문 또는 숫자만 입력가능합니다.'
    ),
  collectType: z.string().min(1, { message: '수집 형태를 선택하세요.' }),
};

const scheduleSchema = {
  time: z.string().min(1, { message: '수집 시간을 선택하세요.' }),
  minutes: z.string().min(1, { message: '수집 분을 선택하세요.' }),
};

const dateInvalid = z.coerce.date({
  errorMap: (issue, { defaultError }) => ({
    message:
      issue.code === 'invalid_date' ? '수집 날짜를 선택하세요.' : defaultError,
  }),
});

const endDateInvalid = z.coerce.date({
  errorMap: (issue, { defaultError }) => ({
    message:
      issue.code === 'invalid_date'
        ? '수집 종료일을 선택하세요.'
        : defaultError,
  }),
});

const today = new Date();
const yesterday = new Date(today.setDate(today.getDate() - 1));

const dailyschema = {
  schedule: z.object(scheduleSchema),
  ...schema,
};

const weeklySchema = {
  schedule: z.object({
    weeks: z.array(z.string()).nonempty({ message: '요일을 선택하세요.' }),
    ...scheduleSchema,
  }),
  ...schema,
};

const daySchema = {
  ...schema,
  schedule: z.object({
    date: dateInvalid.min(yesterday, {
      message: '선택된 수집일은 오늘 이후여야 합니다.',
    }),
    ...scheduleSchema,
  }),
};

const apiSchema = {
  collectTypeInfo: z.object({
    apiKey: z.string().min(1, { message: 'API의 key를 입력하세요.' }),
    apiUrl: z.string().min(1, { message: 'API의 URL을 입력하세요.' }),
    apiExperiod: z.string().min(1, { message: 'API의 유효기간을 선택하세요.' }),
    apiPrmt: z
      .object({ key: z.string(), value: z.string() })
      .array()
      .nonempty({ message: '파라미터는 반드시 하나 이상 등록되어야 합니다.' }),
  }),
};

export {
  schema,
  dailyschema,
  weeklySchema,
  daySchema,
  scheduleSchema,
  apiSchema,
  dateInvalid,
  endDateInvalid,
};
