'use client';

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

export default function TextPage() {
  //totalCount =  전체 게시물 수
  const totalCount = lists.length;

  //countPosts = 한 페이지에 출력될 게시물 수
  const [countPost, setCountPost] = useState<number>(parseInt('3'));
  const viewCountHandler = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setCountPost(parseInt(e.target.value));

  return (
    <div className='contain test'>
      <select
        name='view'
        id='view'
        onChange={(e) => {
          viewCountHandler(e);
        }}
        defaultValue={countPost}
      >
        <option value='3'>3</option>
        <option value='5'>5</option>
        <option value='10'>10</option>
        <option value='15'>15</option>
      </select>

      <div className='list'>
        <ul>
          <li>
            <h3>name</h3>
            <p>contents</p>
          </li>
        </ul>
      </div>

      <div className='pagenation'>
        <ol>
          <li>
            <button>처음</button>
          </li>
          <li>
            <button>이전</button>
          </li>

          <li>
            <button>1</button>
          </li>

          <li>
            <button>다음</button>
          </li>
          <li>
            <button>마지막</button>
          </li>
        </ol>
      </div>
    </div>
  );
}
