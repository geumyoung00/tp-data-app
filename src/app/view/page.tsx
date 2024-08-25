'use client';

import DatePicker from '@/src/components/form/date';
import Select from '@/src/components/form/select';
import Button from '@/src/components/button';
import CircleGraph from '@/src/components/circleGraph';
import { useEffect, useState } from 'react';
import ViewTable from '@/src/components/table/viewTable';

interface dataInterface {
  id: number;
  agency: string;
  collectItem: string;
  schedule: string;
  root: string;
  type: string;
  state: string;
  log: string;
}

export default function View() {
  const [datas, setDatas] = useState<dataInterface[] | null>(null);
  const [agencyList, setAgencyList] = useState<string[]>([]);
  const [viewNum, setViewNum] = useState<number>(5);
  const [currentPage, setCurrentPage] = useState<number>(1); //현재 페이지(선택된 페이지)
  const [startPage, setStartPage] = useState<number>(1);
  const totalPosts = datas?.length;
  const offset = (currentPage - 1) * viewNum; //현재 페이지의 첫 게시물 인덱스 (0, 10, 20, ...)
  const totalPage = Math.ceil(totalPosts! / viewNum); // 올림계산된 총 페이지 수
  const currentPosts = datas?.slice(offset, offset + viewNum);

  const fetchData = () => {
    fetch('http://localhost:9999/dataList')
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
      {/* <div className='board'>
        <CircleGraph />
        <CircleGraph />
        <CircleGraph />
      </div> */}
      {datas ? <ViewTable data={datas} /> : <div>데이터가 없습니다.</div>}
    </div>
  );
}
