'use client';

import TableTop from './top';
import Pagenation from './pagenation';
import Link from 'next/link';
import Button from '../button';
import { useRouter } from 'next/navigation';
import '@/src/scss/_table.scss';
import { useState } from 'react';

interface dataInterface {
  id: number;
  agency: string;
  collectItem: string;
  schedule: string;
  root: string;
  type: string;
  apiKey?: string;
  apiUrl?: string;
  apiExperiod?: string;
  apiPrmt?: [string];
  isUse: boolean;
  time: string;
  state: string;
  log: string;
}

export default function Table({
  datas,
  head,
  children,
}: {
  datas: dataInterface[] | [];
  head: string[] | [];
  children: React.ReactNode;
}) {
  const [viewNum, setViewNum] = useState<number>(5);
  const [currentPage, setCurrentPage] = useState<number>(1); //현재 페이지(선택된 페이지)
  const [startPage, setStartPage] = useState<number>(1);
  const totalPosts = datas?.length;
  const offset = (currentPage - 1) * viewNum; //현재 페이지의 첫 게시물 인덱스 (0, 10, 20, ...)
  const totalPage = Math.ceil(totalPosts / viewNum); // 올림계산된 총 페이지 수
  const router = useRouter();
  const noPrev = startPage === 1; //이전 페이지가 없는 경우
  const noNext = startPage + viewNum - 1 >= totalPage;

  let i = 0;

  const currentPosts = datas?.slice(offset, offset + viewNum);

  const viewCountHandler = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setViewNum(parseInt(e.target.value));

  const viewPageHandler = ({ value }: EventTarget & HTMLButtonElement) => {
    switch (value) {
      case 'first':
        setCurrentPage(1);
        break;

      case 'prev':
        if (currentPage === 1) {
          return;
        }
        setCurrentPage(currentPage - 1);
        break;

      case 'next':
        if (currentPage === totalPage) {
          return;
        }
        setCurrentPage(currentPage + 1);
        break;

      case 'last':
        setCurrentPage(totalPage);
        break;

      case 'search':
        console.log(value + ' is search');
        break;

      default:
        setCurrentPage(parseInt(value));
        break;
    }
  };

  return (
    <>
      <div className='table'>
        <TableTop viewCountHandler={(e) => viewCountHandler(e)} />
        <table>
          <thead>
            <tr>
              {head.map((item, idx) => {
                return <th key={idx + 1}>{item}</th>;
              })}
            </tr>
          </thead>
          <tbody>{children}</tbody>
        </table>
        <Pagenation
          totalPosts={totalPosts}
          totalPage={totalPage ? totalPage : 1}
          viewNum={viewNum}
          viewPageHandler={(e) => viewPageHandler(e)}
          activePage={currentPage}
        />
      </div>
    </>
  );
}
