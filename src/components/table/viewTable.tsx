'use client';

import { useEffect, useState } from 'react';
import Pagenation from './pagenation';
import TableTop from './tableTop';
import Link from 'next/link';
import Button from '../button';
import { dataType } from '@/src/db/data';
import { usePathname, useSearchParams } from 'next/navigation';

export default function ViewTable({ data }: { data: dataType[] }) {
  const [resultData, setResultData] = useState<dataType[]>([]);
  const [postCount, setPostCount] = useState<number>(1); //보여줄 게시글 수
  const [now, setNow] = useState<number>(1); // 선택된 페이지(현재)
  let startIdx: number = (now - 1) * postCount; //선택 페이지의 시작 게시글의 인덱스
  const posts = resultData.slice(startIdx, startIdx + postCount); // 선택된 갯수만큼 보여질 게시글 목록
  const totalPages = Math.ceil(data.length / postCount);

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const page = searchParams.get('page') || searchParams.get('detail');

  useEffect(() => setResultData(data), []);
  useEffect(() => setNow(parseInt(page!)), [page]);

  const viewCountHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const changeTotalPages = Math.ceil(data.length / parseInt(e.target.value));
    if (changeTotalPages < now) setNow(changeTotalPages);
    setPostCount(parseInt(e.target.value));
  };

  const searchPageHandler = (val: string) => {
    setNow(parseInt(val));
  };

  return (
    <div className='table'>
      <TableTop
        viewCountHandler={(e) => viewCountHandler(e)}
        pageInfo={{ page: now, totalPages: totalPages }}
      />
      <table>
        <thead>
          <tr>
            <th>기관</th>
            <th>수집내용</th>
            <th>수집형태</th>
            <th>수집폴더</th>
            <th>수집시간</th>
            <th>상태</th>
            <th>상세 로그</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((el, idx) => {
            const day = new Date(el.time).toLocaleString('kr-Ko', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            });
            const time = new Date(el.time).toLocaleString('kr-Ko', {
              hour: 'numeric',
              minute: 'numeric',
            });
            return (
              <tr key={idx}>
                <td>{el.agency}</td>
                <td>{el.collectItem}</td>
                <td>{el.collectType}</td>
                <td>{el.root}</td>
                <td>
                  {day}
                  <br />
                  {time}
                </td>
                <td>
                  <div className={`tag ${el.state}`}>
                    <span>
                      {el.state === 'success'
                        ? '수집성공'
                        : el.state === 'faild'
                        ? '수집 실패'
                        : '수집 중'}
                    </span>
                  </div>
                </td>
                <td>
                  {el.log ? (
                    <Link
                      href={`/view/${el.id}`}
                      className='btn min secondary'
                      scroll={false}
                    >
                      <span>확인하기</span>
                    </Link>
                  ) : (
                    <Button label='확인하기' state='disabled' size='min' />
                  )}
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
        pathname={pathname}
        page={page!}
        searchPageHandler={(val) => searchPageHandler(val)}
      />
    </div>
  );
}
