'use client';

import { off } from 'process';
import { useState } from 'react';
const lists = [
  { id: 0, name: '하나', contents: '하나의 내용' },
  { id: 2, name: '둘', contents: '둘의 내용' },
  { id: 3, name: '셋', contents: '셋의 내용' },
  { id: 4, name: '넷', contents: '넷의 내용' },
  { id: 5, name: '다섯', contents: '다섯의 내용' },
  { id: 6, name: '여섯', contents: '여섯의 내용' },
  { id: 7, name: '일곱', contents: '일곱의 내용' },
  { id: 8, name: '여덟', contents: '여덟의 내용' },
  { id: 9, name: '아홉', contents: '아홉의 내용' },
  { id: 10, name: '열', contents: '열의 내용' },
  { id: 11, name: '열하나', contents: '열하나의 내용' },
  { id: 12, name: '열둘', contents: '열둘의 내용' },
  { id: 13, name: '열셋', contents: '열셋의 내용' },
  { id: 14, name: '열넷', contents: '열넷의 내용' },
  { id: 15, name: '열다섯', contents: '열다섯의 내용' },
  { id: 16, name: '열여섯', contents: '열여섯의 내용' },
  { id: 17, name: '열일곱', contents: '열일곱의 내용' },
  { id: 18, name: '열여덟', contents: '열여덟의 내용' },
  { id: 19, name: '열아홉', contents: '열아홉의 내용' },
  { id: 20, name: '스물', contents: '스물의 내용' },
  { id: 21, name: '스물하나', contents: '스물하나의 내용' },
  { id: 22, name: '스물둘', contents: '스물둘의 내용' },
  { id: 23, name: '스물셋', contents: '스물셋의 내용' },
  { id: 24, name: '스물넷', contents: '스물넷의 내용' },
  { id: 25, name: '스물다섯', contents: '스물다섯의 내용' },
  { id: 26, name: '스물여섯', contents: '스물여섯의 내용' },
  { id: 27, name: '스물일곱', contents: '스물일곱의 내용' },
];

interface dataInterface {
  id: number;
  name: string;
  contents: string;
}

export default function TextPage() {
  const [selectedOption, setSelectedOption] = useState<string>('3');
  const [page, setPage] = useState<number>(1); //현재 페이지(선택된 페이지) : 초기 상태값 = 1로 시작할 것

  const viewCount = parseInt(selectedOption);

  const viewCountHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    return setSelectedOption(e.target.value);
  };

  const total = lists.length; //총 게시물 수
  let offset = (page - 1) * viewCount; // 현재 페이지에서 첫 게시물의 인덱스 : 초기 상태값 = 0; (인덱스 시작은 0부터)
  const totalPage = Math.ceil(total / viewCount); // 총 페이지 수

  // 1. 3개씩 보이는 페이지 구현 : 1page = 0 ~ 9
  let filterArr = lists.slice(offset, offset + viewCount);

  //2. 클릭시 다음 목록 보여주기
  const totalPageBtn: number[] = new Array(totalPage).fill(0);

  return (
    <div className='contain test'>
      <select
        name='view'
        id='view'
        onChange={(e) => {
          viewCountHandler(e);
        }}
        defaultValue={selectedOption}
      >
        <option value='3'>3</option>
        <option value='5'>5</option>
        <option value='10'>10</option>
        <option value='15'>15</option>
      </select>

      <div className='list'>
        <ul>
          {filterArr.map(({ id, name, contents }) => {
            return (
              <li key={id}>
                <h3>{name}</h3>
                <p>{contents}</p>
              </li>
            );
          })}
        </ul>
      </div>

      <div className='pagenation'>
        <ol>
          {totalPage === 1 ? (
            ''
          ) : (
            <>
              <li>
                <button onClick={() => setPage(1)}>처음</button>
              </li>
              <li>
                <button onClick={() => setPage(page - 1)} disabled={page === 1}>
                  이전
                </button>
              </li>
            </>
          )}

          {totalPageBtn.map((item, i) => (
            <li key={i + 1 + 'page'}>
              <button
                onClick={() => setPage(i + 1)}
                className={i + 1 === page ? 'active' : ''}
              >
                {i + 1}
              </button>
            </li>
          ))}

          {totalPage === 1 ? (
            ''
          ) : (
            <>
              <li>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPage}
                >
                  다음
                </button>
              </li>
              <li>
                <button onClick={() => setPage(totalPage)}>마지막</button>
              </li>
            </>
          )}
        </ol>
      </div>
    </div>
  );
}
