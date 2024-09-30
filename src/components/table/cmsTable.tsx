'use client';

import React, { useState } from 'react';
import Pagenation from './pagenation';
import TableTop from './tableTop';
import Button from '../button';
import { settingsType } from '@/src/db/settings';

export default function CmsTable({
  data,
  settingHandler,
}: {
  data: settingsType[];
  settingHandler?: (
    e: React.MouseEvent<HTMLElement, MouseEvent>,
    id: string
  ) => void;
}) {
  const [postCount, setPostCount] = useState<number>(5); //보여줄 게시글 수
  const [page, setPage] = useState<number>(1); // 선택된 페이지(현재)
  let startIdx: number = (page - 1) * postCount; //선택 페이지의 시작 게시글의 인덱스
  const posts = data.slice(startIdx, startIdx + postCount); // 선택된 갯수만큼 보여질 게시글 목록
  const totalPages = Math.ceil(data.length / postCount);

  const viewCountHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const changeTotalPages = Math.ceil(data.length / parseInt(e.target.value));
    if (changeTotalPages < page) setPage(changeTotalPages);
    setPostCount(parseInt(e.target.value));
  };

  const viewPageHandler = ({ value }: EventTarget & HTMLButtonElement) => {
    switch (value) {
      case 'first':
        setPage(1);
        break;

      case 'prev':
        setPage(page - 1);
        break;

      case 'last':
        setPage(totalPages);
        break;

      case 'next':
        setPage(page + 1);
        break;

      default:
        setPage(parseInt(value));
        break;
    }
  };

  const searchPageHandler = (val: string) => {
    setPage(parseInt(val));
  };

  let itemIdx = startIdx;

  return (
    <div className='table'>
      <TableTop
        viewCountHandler={(e) => viewCountHandler(e)}
        pageInfo={{ page: page, totalPages: totalPages }}
      />
      <table>
        <colgroup>
          <col width={60} />
        </colgroup>
        <thead>
          <tr>
            <th>번호</th>
            <th>기관</th>
            <th>수집내용</th>
            <th>수집형태</th>
            <th>수집 스케줄</th>
            <th>수집폴더</th>
            <th>사용여부</th>
            <th>더보기</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((el, idx) => {
            const { schedule } = el;
            const { time, date, endDate, minutes } = schedule;
            let weeks: string[] = [];
            schedule.weeks?.forEach((el) => {
              el === 'mon'
                ? weeks.push('월')
                : el === 'tue'
                ? weeks.push('화')
                : el === 'wed'
                ? weeks.push('수')
                : el === 'thu'
                ? weeks.push('목')
                : el === 'fri'
                ? weeks.push('금')
                : el === 'sat'
                ? weeks.push('토')
                : el === 'sun'
                ? weeks.push('일')
                : '';
            });

            const scheduleType =
              el.scheduleType === 'daily' ||
              (el.scheduleType === 'period' && !schedule.weeks)
                ? '매일'
                : el.scheduleType === 'weekly'
                ? '매주'
                : '';

            itemIdx++;

            return (
              <tr key={idx}>
                <td>{itemIdx}</td>
                <td>{el.agency}</td>
                <td>{el.collectItem}</td>
                <td>{el.collectType}</td>
                <td>
                  {date && !endDate ? (
                    <p>
                      {new Date(date).toLocaleDateString('kr-Ko', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  ) : (
                    ''
                  )}

                  {date && endDate ? (
                    <p>
                      {new Date(date).toLocaleDateString('kr-Ko', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                      ~{' '}
                      {new Date(endDate!).toLocaleDateString('kr-Ko', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  ) : (
                    ''
                  )}
                  {`${scheduleType}
                  ${weeks ? ' ' + weeks.join(', ') : ''}
                  ${time}:${minutes}`}
                </td>
                <td>{el.root}</td>
                <td>
                  {el.isUsed ? (
                    <div className={`tag`}>
                      <span>사용중</span>
                    </div>
                  ) : (
                    <div className={`tag stop`}>
                      <span>사용중지</span>
                    </div>
                  )}
                </td>
                <td>
                  <div className='btn-group'>
                    <Button
                      label='수정'
                      state='secondary'
                      size='min'
                      onClick={(e) => settingHandler!(e, el.id)}
                    />
                    <Button
                      label='삭제'
                      state='tertiary'
                      size='min'
                      onClick={(e) => settingHandler!(e, el.id)}
                    />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <Pagenation
        totalPost={data.length}
        totalPages={totalPages}
        postCount={postCount}
        activePage={page}
        viewPageHandler={(e) => viewPageHandler(e)}
        searchPageHandler={(val) => searchPageHandler(val)}
      />
    </div>
  );
}
