'use client';

import Calendar from '@/public/calendar.svg';
import Select from './select';

export default function DatePicker({
  period,
  hide,
}: {
  period?: string;
  hide?: string;
}) {
  const timeArr = [...new Array(25)].map((_, i) => {
    if (i < 10) return '0' + JSON.stringify(i * 1);
    return JSON.stringify(i * 1);
  });

  const minuteArr = [...new Array(12)].map((_, i) => {
    if (i * 5 < 10) return '0' + JSON.stringify(i * 5);
    return JSON.stringify(i * 5);
  });

  return (
    <>
      {period === 'period' ? (
        <>
          <label className={hide ? 'hide' : ''} htmlFor='period'>
            기간 선택
          </label>
          <ul className='date-picker'>
            <li>
              <i className='icon'>
                <Calendar />
              </i>
              <input type='date' id='period' name='period' />
            </li>
            <li className='tide'>~</li>
            <li>
              <i className='icon'>
                <Calendar />
              </i>
              <input type='date' id='period' name='period' />
            </li>
          </ul>
        </>
      ) : period === 'date' ? (
        <>
          <label className={hide ? 'hide' : ''} htmlFor='date'>
            일자 선택
          </label>
          <ul className='date-picker'>
            <li>
              <input type='date' id='date' name='date' />
              <i className='icon'>
                <Calendar />
              </i>
            </li>
          </ul>
        </>
      ) : (
        <>
          <label className={hide ? 'hide' : ''} htmlFor='seperate'>
            일자 및 시간 지정
          </label>
          <ul className='date-picker time'>
            <li>
              <input type='date' id='seperate' />
              <i className='icon'>
                <Calendar />
              </i>
            </li>
            <li>
              <Select label='시간선택' options={timeArr} hide='hide' />
              <p>시</p>
            </li>
            <li>
              <Select label='분선택' options={minuteArr} hide='hide' />
              <p>분</p>
            </li>
          </ul>
        </>
      )}
    </>
  );
}
