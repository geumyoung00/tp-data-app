'use client';

import { useState } from 'react';
import Pagenation from './pagenation';
import TableTop from './tableTop';
import Link from 'next/link';
import Button from '../button';

interface dataInterface {
  agency: string;
  collectItem: string;
  schedule: string;
  root: string;
  type: string;
  state: string;
  log: string;
}

export default function ViewTable({ data }: { data: dataInterface[] }) {
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

  return (
    <div className='table'>
      <TableTop
        viewCountHandler={(e) => viewCountHandler(e)}
        pageInfo={{ page: page, totalPages: totalPages }}
      />
      <table>
        <thead>
          <tr>
            <th>기관</th>
            <th>수집내용</th>
            <th>수집형태</th>
            <th>수집폴더</th>
            <th>상태</th>
            <th>상세 로그</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((el, idx) => {
            return (
              <tr key={idx}>
                <td>{el.agency}</td>
                <td>{el.collectItem}</td>
                <td>{el.type}</td>
                <td>{el.root}</td>
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
                      href={`/view/${idx + 1}`}
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
        activePage={page}
        viewPageHandler={(e) => viewPageHandler(e)}
        searchPageHandler={(val) => searchPageHandler(val)}
      />
    </div>
  );
}
