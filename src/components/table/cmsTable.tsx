'use client';

import React, { useEffect, useState } from 'react';
import Pagenation from './pagenation';
import TableTop from './tableTop';
import Button from '../button';
import { settingType } from '@/src/db/settings';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { settingRemoveAction } from '@/src/action/setting-form-action';
import Link from 'next/link';
import { agencyType, fetchAgencies } from '@/src/db/agencies';

export default function CmsTable({ settings }: { settings: settingType[] }) {
  const [agencies, setAgencies] = useState<agencyType[]>();
  const [postCount, setPostCount] = useState<number>(5); //보여줄 게시글 수
  const [now, setNow] = useState<number>(1); // 선택된 페이지(현재)
  const router = useRouter();
  const pathname = usePathname();
  const page = useSearchParams().get('page');
  let startIdx: number = (now - 1) * postCount; //선택 페이지의 시작 게시글의 인덱스
  const posts = settings.slice(startIdx, startIdx + postCount); // 선택된 갯수만큼 보여질 게시글 목록
  const totalPages = Math.ceil(settings.length / postCount);

  useEffect(() => {
    if (!page) setNow(1);
    else if (parseInt(page) > totalPages) {
      router.push(`/cms`);
    } else setNow(parseInt(page));
  }, [page]);

  useEffect(() => {
    fetchAgencies().then((res) => setAgencies(res));
  }, []);

  const viewCountHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const changeTotalPages = Math.ceil(
      settings.length / parseInt(e.target.value)
    );
    if (changeTotalPages < now) setNow(changeTotalPages);
    setPostCount(parseInt(e.target.value));
  };

  const removeSettingHandler = (id: string) => {
    if (confirm(`정말 ${id} 설정을 삭제하시겠습니까?`)) settingRemoveAction(id);
    window.location.reload();
    router.push(`/cms?page=${id}`);
    return;
  };

  let itemIdx = startIdx;

  return (
    <div className='table'>
      <TableTop
        viewCountHandler={(e) => viewCountHandler(e)}
        pageInfo={{ page: now, totalPages: totalPages }}
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
            const { hour, date, endDate, minutes } = schedule;
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
                <td>
                  {agencies?.find((agency) => agency.id === el.agency)?.name}
                </td>
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
                  ${hour}:${minutes}`}
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
                    <Link
                      href={`/cms/edit/${el.id}`}
                      className='btn min secondary'
                    >
                      <span>수정</span>
                    </Link>
                    <Button
                      label='삭제'
                      state='tertiary'
                      size='min'
                      onClick={() => removeSettingHandler(el.id)}
                    />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <Pagenation
        totalPost={settings.length}
        totalPages={totalPages}
        postCount={postCount}
        pathname={pathname}
        page={!page ? '1' : page}
      />
    </div>
  );
}
