'use client';

import Link from 'next/link';
import '@/src/scss/_common.scss';
import '@/src/scss/_pagenation.scss';
import First from '@/public/btnIcon/first.svg';
import Last from '@/public/btnIcon/last.svg';
import Prev from '@/public/btnIcon/prev.svg';
import Next from '@/public/btnIcon/next.svg';
import Dotted from '@/public/btnIcon/dotted.svg';
import { useEffect, useState } from 'react';

export default function Pagenation({
  totalPosts, //데이터의 총 갯수
  viewNum, // 페이지 당 보여줄 데이터 갯수
  totalPage, // 보여줄 페이지의 총 갯수
  activePage, // 현재 페이지
  viewPageHandler, // 페이지 이동을 위한 핸들러 함수
}: {
  totalPosts: number;
  totalPage: number;
  viewPageHandler: (e: EventTarget & HTMLButtonElement) => void;
  activePage: number;
  viewNum: number;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const showedPageNum: number[] = new Array(totalPage).fill(0);

  return (
    <div className='pagenation'>
      <ul className='prev-group'>
        {totalPage < 5 ? (
          ''
        ) : (
          <li>
            <button
              className='btn min icon-only'
              title='처음으로'
              value='first'
              onClick={(e) => viewPageHandler(e.currentTarget)}
            >
              <span>처음으로</span>
              <i>
                <First />
              </i>
            </button>
          </li>
        )}
        <li>
          <button
            className='btn min icon-only'
            title='이전 페이지'
            value='prev'
            onClick={(e) => viewPageHandler(e.currentTarget)}
          >
            <span>prev</span>
            <i>
              <Prev />
            </i>
          </button>
        </li>
      </ul>

      <ul className='number-group'>
        {showedPageNum.map((item, i) => {
          return (
            <li key={item + i}>
              <button
                className={`min icon-only${
                  activePage === i + 1 ? ' active' : ''
                }`}
                title={`${i + 1} 페이지로`}
                value={i + 1}
                onClick={(e) => viewPageHandler(e.currentTarget)}
              >
                <span>{i + 1}</span>
              </button>
            </li>
          );
        })}

        {/* {totalPage < 5 ? (
          ''
        ) : (
          <li>
            <button
              className={`min icon-only${isOpen ? ' open' : ''}`}
              title='페이지 검색'
              value='search'
              onClick={(e) => {
                viewPageHandler(e.currentTarget);
                setIsOpen((prev) => !prev);
              }}
            >
              <span className='hide'>페이지 검색</span>
              <i className='icon'>
                <Dotted />
              </i>
            </button>
            <div className={`search-page-modal open`}>
              <div>search page modal</div>
            </div>
          </li>
        )} */}
      </ul>

      <ul className='next-group'>
        <li>
          <button
            className='btn min icon-only'
            title='다음 페이지'
            value='next'
            onClick={(e) => viewPageHandler(e.currentTarget)}
          >
            <span>next</span>
            <i>
              <Next />
            </i>
          </button>
        </li>
        {totalPage < 5 ? (
          ''
        ) : (
          <li>
            <button
              className='btn min icon-only'
              title='마지막 페이지'
              value='last'
              onClick={(e) => viewPageHandler(e.currentTarget)}
            >
              <span>last</span>
              <i>
                <Last />
              </i>
            </button>
          </li>
        )}
      </ul>
    </div>
  );
}
