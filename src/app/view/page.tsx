'use client';

import DatePicker from '@/src/components/form/date';
import Select from '@/src/components/form/select';
import Button from '@/src/components/button';
import Table from '@/src/components/table/table';
import TableTop from '@/src/components/table/top';
import CircleGraph from '@/src/components/circleGraph';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Pagenation from '@/src/components/table/pagenation';

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

const headItems = [
  '번호',
  '기관',
  '수집 내용',
  '수집 형태',
  '수집 폴더',
  '상태',
  '상태 로그',
];

export default function View() {
  const [datas, setDatas] = useState<dataInterface[] | null>(null);
  const [agencyList, setAgencyList] = useState<string[]>([]);
  const [viewNum, setViewNum] = useState<number>(5);
  const [currentPage, setCurrentPage] = useState<number>(1); //현재 페이지(선택된 페이지)
  const [startPage, setStartPage] = useState<number>(1);
  const totalPosts = datas?.length;
  const offset = (currentPage - 1) * viewNum; //현재 페이지의 첫 게시물 인덱스 (0, 10, 20, ...)
  const totalPage = Math.ceil(totalPosts! / viewNum); // 올림계산된 총 페이지 수
  const noPrev = startPage === 1; //이전 페이지가 없는 경우
  const noNext = startPage + viewNum - 1 >= totalPage;
  const currentPosts = datas?.slice(offset, offset + viewNum);

  const fetchData = () => {
    fetch('http://192.168.0.157:9999/dataList')
      .then((res) => res.json())
      .then((result) => {
        const filterAgency: string[] | [] = ['전체'];
        result.forEach((el: dataInterface) => {
          if (filterAgency.includes(el.agency)) {
            return;
          } else {
            return filterAgency.push(el.agency);
          }
        });
        return setAgencyList(filterAgency), setDatas(result);
      });
  };

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

  useEffect(() => {
    fetchData();
  }, []);

  //데이터 관리는 리덕스 써야 함 ***

  return (
    <div className='contain'>
      <form>
        <ul className='filter-bar'>
          <li>
            <Select label='기관 선택' options={agencyList!} />
          </li>
          <li>
            <DatePicker period='period' />
          </li>
          <li>
            <Button label='검색' />
          </li>
        </ul>
      </form>
      <div className='board'>
        <CircleGraph />
        <CircleGraph />
        <CircleGraph />
      </div>
      <div className='table'>
        <TableTop viewCountHandler={(e) => viewCountHandler(e)} />
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
            {datas ? (
              currentPosts!.map((data: dataInterface) => {
                return (
                  <tr key={data.id}>
                    <td>{data.agency}</td>
                    <td>{data.collectItem}</td>
                    <td>{data.type}</td>
                    <td>{data.root}</td>
                    <td>
                      <div className={`tag ${data.state}`}>
                        <span>
                          {data.state === 'success'
                            ? '수집성공'
                            : data.state === 'faild'
                            ? '수집 실패'
                            : '수집 중'}
                        </span>
                      </div>
                    </td>
                    <td>
                      {data.log ? (
                        <Link
                          href={`/view/${data.id}`}
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
              })
            ) : (
              <tr>
                <td colSpan={7}>내용없음</td>
              </tr>
            )}
          </tbody>
        </table>
        <Pagenation
          totalPosts={totalPosts!}
          totalPage={totalPage ? totalPage : 1}
          viewNum={viewNum}
          viewPageHandler={(e) => viewPageHandler(e)}
          activePage={currentPage}
        />
      </div>
    </div>
  );
}
