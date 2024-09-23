'use client';

import { minutes, times, weeks } from '@/src/db/date';
import Select from './select';
import Checkbox from './checkbox';
import DatePicker from './datePicker';
import { useContext, useState } from 'react';
import { ErrorsType } from '@/src/action/create-setting';

type refsType = HTMLSelectElement | HTMLInputElement | HTMLDivElement;

export default function ScheduleForm({
  type,
  formRefHandler,
  errors,
}: {
  type: string;
  formRefHandler: (id: string, ref: refsType) => void;
  errors?: ErrorsType;
}) {
  const [periodType, setPeriodType] = useState<string>('periodDaily');

  const periodForm = (
    <div className='inner-form'>
      <p className='label'>
        {periodType === 'periodWeekly' ? ' 요일/' : ' '}
        시간
      </p>
      {periodType === 'periodWeekly' ? (
        <div className='checkbox-group'>
          {weeks.map((item) => {
            return (
              <Checkbox
                key={item.id}
                showLabel
                name='periodChecks'
                value={item.id}
              >
                <span>{item.name}</span>
              </Checkbox>
            );
          })}
        </div>
      ) : (
        ''
      )}
      <Select label='periodTime' hide='hide'>
        <select name='periodTime' id='periodTime'>
          <option value='' hidden></option>
          {times.map((num) => {
            return (
              <option value={num} key={num}>
                {num}
              </option>
            );
          })}
        </select>
      </Select>
      <p className='text'>시</p>
      <Select label='periodMinutes' hide='hide'>
        <select name='periodMinutes' id='periodMinutes'>
          <option value='' hidden></option>
          {minutes.map((n) => {
            return (
              <option value={n} key={n}>
                {n}
              </option>
            );
          })}
        </select>
      </Select>
      <p className='text'>분</p>
    </div>
  );
  switch (type) {
    default:
      break;

    case 'daily':
      return (
        <>
          <div className='schedule-form'>
            <Select label='dailyTime' hide='hide'>
              <select
                name='dailyTime'
                id='dailyTime'
                ref={(ref: HTMLSelectElement) =>
                  formRefHandler('dailyTime', ref)
                }
              >
                <option value='' hidden></option>
                {times.map((num) => {
                  return (
                    <option value={num} key={num}>
                      {num}
                    </option>
                  );
                })}
              </select>
            </Select>
            <p className='text'>시</p>
            <Select label='dailyMinutes' hide='hide'>
              <select
                name='dailyMinutes'
                id='dailyMinutes'
                ref={(ref: HTMLSelectElement) =>
                  formRefHandler('dailyMinutes', ref)
                }
              >
                <option value='' hidden></option>
                {minutes.map((n) => {
                  return (
                    <option value={n} key={n}>
                      {n}
                    </option>
                  );
                })}
              </select>
            </Select>
            <p className='text'>분</p>
          </div>
          {errors?.dailyTime || errors?.dailyMinutes ? (
            <p className='valid-script'>
              {errors.dailyTime || errors.dailyMinutes}
            </p>
          ) : (
            ''
          )}
        </>
      );

    case 'weekly':
      return (
        <>
          <div className='schedule-form'>
            <div
              className='checkbox-group'
              ref={(ref: HTMLDivElement) => formRefHandler('weeklyChecks', ref)}
            >
              {weeks.map((item) => {
                if (item.id === 'mon') {
                  return (
                    <Checkbox
                      key={item.id}
                      showLabel
                      name='weeklyChecks'
                      value={item.id}
                    >
                      <span>{item.name}</span>
                    </Checkbox>
                  );
                } else {
                  return (
                    <Checkbox
                      key={item.id}
                      showLabel
                      name='weeklyChecks'
                      value={item.id}
                    >
                      <span>{item.name}</span>
                    </Checkbox>
                  );
                }
              })}
            </div>
            <Select label='weeklyTime' hide='hide'>
              <select
                name='weeklyTime'
                id='weeklyTime'
                ref={(ref: HTMLSelectElement) =>
                  formRefHandler('weeklyTime', ref)
                }
              >
                <option value='' hidden></option>
                {times.map((num) => {
                  return (
                    <option value={num} key={num}>
                      {num}
                    </option>
                  );
                })}
              </select>
            </Select>
            <p className='text'>시</p>
            <Select label='weeklyMinutes' hide='hide'>
              <select
                name='weeklyMinutes'
                id='weeklyMinutes'
                ref={(ref: HTMLSelectElement) =>
                  formRefHandler('weeklyMinutes', ref)
                }
              >
                <option value='' hidden></option>
                {minutes.map((n) => {
                  return (
                    <option value={n} key={n}>
                      {n}
                    </option>
                  );
                })}
              </select>
            </Select>
            <p className='text'>분</p>
          </div>
          {errors?.weeklyChecks ||
          errors?.weeklyTime ||
          errors?.weeklyMinutes ? (
            <p className='valid-script'>
              {errors.weeklyChecks || errors.weeklyTime || errors.weeklyMinutes}
            </p>
          ) : (
            ''
          )}
        </>
      );

    case 'day':
      return (
        <>
          <div className='schedule-form'>
            <DatePicker hide='hide' label='dayDate'>
              <input
                type='date'
                name='dayDate'
                ref={(ref: HTMLInputElement) => formRefHandler('dayDate', ref)}
              />
            </DatePicker>
            <Select label='dayTime' hide='hide'>
              <select
                name='dayTime'
                id='dayTime'
                ref={(ref: HTMLSelectElement) => formRefHandler('dayTime', ref)}
              >
                <option value='' hidden></option>
                {times.map((num) => {
                  return (
                    <option value={num} key={num}>
                      {num}
                    </option>
                  );
                })}
              </select>
            </Select>
            <p className='text'>시</p>
            <Select label='dayMinutes' hide='hide'>
              <select
                name='dayMinutes'
                id='dayMinutes'
                ref={(ref: HTMLSelectElement) =>
                  formRefHandler('dayMinutes', ref)
                }
              >
                <option value='' hidden></option>
                {minutes.map((n) => {
                  return (
                    <option value={n} key={n}>
                      {n}
                    </option>
                  );
                })}
              </select>
            </Select>
            <p className='text'>분</p>
          </div>
          {errors?.dayDate || errors?.dayTime || errors?.dayMinutes ? (
            <p className='valid-script'>
              {errors.dayDate?.join(' ') || errors.dayTime || errors.dayMinutes}
            </p>
          ) : (
            ''
          )}
        </>
      );

    case 'period':
      return (
        <>
          <div className='schedule-form'>
            <DatePicker hide='hide' label='startDate'>
              <input
                type='date'
                name='startDate'
                ref={(ref: HTMLInputElement) =>
                  formRefHandler('startDate', ref)
                }
              />
            </DatePicker>
            <p className='text'>~</p>
            <DatePicker hide='hide' label='endDate'>
              <input
                type='date'
                name='endDate'
                ref={(ref: HTMLInputElement) => formRefHandler('endDate', ref)}
              />
            </DatePicker>
            <Select label='inSchedule' hide='hide'>
              <select
                name='inSchedule'
                id='inSchedule'
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setPeriodType(e.target.value)
                }
                ref={(ref: HTMLSelectElement) =>
                  formRefHandler('inSchedule', ref)
                }
              >
                <option value='periodDaily'>매일</option>
                <option value='periodWeekly'>매주</option>
              </select>
            </Select>
          </div>
          {errors?.startDate || errors?.endDate ? (
            <p className='valid-script'>
              {errors.startDate?.join(' ') || errors.endDate?.join(' ')}
            </p>
          ) : (
            ''
          )}

          {periodForm}

          {errors?.periodChecks ||
          errors?.periodTime ||
          errors?.periodMinutes ? (
            <p className='valid-script'>
              {errors.periodChecks ||
                errors.periodTime?.join(' ') ||
                errors.periodMinutes?.join(' ')}
            </p>
          ) : (
            ''
          )}
        </>
      );
  }
}
