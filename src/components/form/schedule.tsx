'use client';

import { timeArr, minuteArr, weekArr } from '@/src/db/date';
import Select from './select';
import Checkbox from './checkbox';
import DatePicker from './datePicker';
import { useEffect, useState } from 'react';
import { ErrorsType } from '@/src/action/setting-schema';
import { settingType } from '@/src/db/settings';

type refsType = HTMLSelectElement | HTMLInputElement | HTMLDivElement;

export default function ScheduleForm({
  type,
  formRefHandler,
  errors,
  editFormData,
}: {
  type: string;
  formRefHandler: (id: string, ref: refsType) => void;
  errors?: ErrorsType;
  editFormData?: settingType;
}) {
  const [periodType, setPeriodType] = useState<string>('periodDaily');
  const scheduleType = editFormData?.scheduleType;
  const schedule = editFormData?.schedule;
  const time = schedule?.hour,
    minutes = schedule?.minutes,
    weeks = schedule?.weeks,
    date = schedule?.date,
    endDate = schedule?.endDate;

  useEffect(() => {
    if (scheduleType === 'period' && !weeks) setPeriodType('periodDaily');
    else if (scheduleType === 'period' && weeks) setPeriodType('periodWeekly');
  }, []);

  const periodForm = (
    <div className='inner-form'>
      <p className='label'>
        {periodType === 'periodWeekly' ? ' 요일/' : ' '}
        시간
      </p>
      {periodType === 'periodWeekly' ? (
        <div className='checkbox-group'>
          {weekArr!.map((item) => {
            if (scheduleType === 'period' && weeks?.includes(item.id)) {
              return (
                <Checkbox
                  key={item.id}
                  showLabel
                  name='weeks'
                  value={item.id}
                  checked
                >
                  <span>{item.name}</span>
                </Checkbox>
              );
            } else {
              return (
                <Checkbox key={item.id} showLabel name='weeks' value={item.id}>
                  <span>{item.name}</span>
                </Checkbox>
              );
            }
          })}
        </div>
      ) : (
        ''
      )}
      <Select label='time' forLabel='time' hide='hide'>
        <select name='time' id='time' defaultValue={time}>
          <option value='' hidden></option>
          {timeArr.map((num) => {
            return (
              <option value={num} key={num}>
                {num}
              </option>
            );
          })}
        </select>
      </Select>
      <p className='text'>시</p>
      <Select label='minutes' forLabel='minutes' hide='hide'>
        <select name='minutes' id='minutes' defaultValue={minutes}>
          <option value='' hidden></option>
          {minuteArr.map((n) => {
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
            <Select label='time' forLabel='time' hide='hide'>
              <select
                name='time'
                id='time'
                ref={(ref: HTMLSelectElement) => formRefHandler('time', ref)}
                defaultValue={time}
              >
                <option value='' hidden></option>
                {timeArr.map((num) => {
                  return (
                    <option value={num} key={num}>
                      {num}
                    </option>
                  );
                })}
              </select>
            </Select>
            <p className='text'>시</p>
            <Select label='minutes' forLabel='minutes' hide='hide'>
              <select
                name='minutes'
                id='minutes'
                ref={(ref: HTMLSelectElement) => formRefHandler('minutes', ref)}
                defaultValue={minutes}
              >
                <option value='' hidden></option>
                {minuteArr.map((n) => {
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
              {weekArr!.map((item) => {
                if (weeks?.includes(item.id)) {
                  return (
                    <Checkbox
                      key={item.id}
                      showLabel
                      name='weeks'
                      value={item.id}
                      checked
                    >
                      <span>{item.name}</span>
                    </Checkbox>
                  );
                } else {
                  return (
                    <Checkbox
                      key={item.id}
                      showLabel
                      name='weeks'
                      value={item.id}
                    >
                      <span>{item.name}</span>
                    </Checkbox>
                  );
                }
              })}
            </div>
            <Select label='time' forLabel='time' hide='hide'>
              <select
                name='time'
                id='time'
                ref={(ref: HTMLSelectElement) => formRefHandler('time', ref)}
                defaultValue={time}
              >
                <option value='' hidden></option>
                {timeArr.map((num) => {
                  return (
                    <option value={num} key={num}>
                      {num}
                    </option>
                  );
                })}
              </select>
            </Select>
            <p className='text'>시</p>
            <Select label='minutes' forLabel='minutes' hide='hide'>
              <select
                name='minutes'
                id='minutes'
                ref={(ref: HTMLSelectElement) => formRefHandler('minutes', ref)}
                defaultValue={minutes}
              >
                <option value='' hidden></option>
                {minuteArr.map((n) => {
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
        </>
      );

    case 'day':
      return (
        <>
          <div className='schedule-form'>
            <DatePicker hide='hide' label='date'>
              <input
                type='date'
                name='date'
                ref={(ref: HTMLInputElement) => formRefHandler('date', ref)}
                defaultValue={date}
              />
            </DatePicker>
            <Select label='time' forLabel='time' hide='hide'>
              <select
                name='time'
                id='time'
                ref={(ref: HTMLSelectElement) => formRefHandler('time', ref)}
                defaultValue={time}
              >
                <option value='' hidden></option>
                {timeArr.map((num) => {
                  return (
                    <option value={num} key={num}>
                      {num}
                    </option>
                  );
                })}
              </select>
            </Select>
            <p className='text'>시</p>
            <Select label='minutes' forLabel='minutes' hide='hide'>
              <select
                name='minutes'
                id='minutes'
                ref={(ref: HTMLSelectElement) => formRefHandler('minutes', ref)}
                defaultValue={minutes}
              >
                <option value='' hidden></option>
                {minuteArr.map((n) => {
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
        </>
      );

    case 'period':
      return (
        <>
          <div className='schedule-form'>
            <DatePicker hide='hide' label='date'>
              <input
                type='date'
                name='date'
                ref={(ref: HTMLInputElement) => formRefHandler('date', ref)}
                defaultValue={date}
              />
            </DatePicker>
            <p className='text'>~</p>
            <DatePicker hide='hide' label='endDate'>
              <input
                type='date'
                name='endDate'
                ref={(ref: HTMLInputElement) => formRefHandler('endDate', ref)}
                defaultValue={endDate}
              />
            </DatePicker>
            <Select label='inSchedule' forLabel='inSchedule' hide='hide'>
              <select
                name='inSchedule'
                id='inSchedule'
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setPeriodType(e.target.value)
                }
                ref={(ref: HTMLSelectElement) =>
                  formRefHandler('inSchedule', ref)
                }
                defaultValue={!weeks ? 'periodDaily' : 'periodWeekly'}
              >
                <option value='periodDaily'>매일</option>
                <option value='periodWeekly'>매주</option>
              </select>
            </Select>
          </div>

          {periodForm}
        </>
      );
  }
}
