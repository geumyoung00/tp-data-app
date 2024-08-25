'use client';

import Select from '@/src/components/form/select';
import Button from '@/src/components/button';
import Add from '@/public/btnIcon/add.svg';
import Link from 'next/link';
import InputText from '@/src/components/form/inputText';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import CmsTable from '@/src/components/table/cmsTable';

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

interface agencyInterface {
  id: number | string;
  name: string;
}

export default function Cms() {
  const [agencyList, setAgencyList] = useState<string[]>([]);
  const [datas, setDatas] = useState<dataInterface[]>([]);
  const [viewNum, setViewNum] = useState<number>(5);
  const [currentPage, setCurrentPage] = useState<number>(1); //현재 페이지(선택된 페이지)
  const [startPage, setStartPage] = useState<number>(1);
  const totalPosts = datas?.length;
  const offset = (currentPage - 1) * viewNum; //현재 페이지의 첫 게시물 인덱스 (0, 10, 20, ...)
  const totalPage = Math.ceil(totalPosts! / viewNum); // 올림계산된 총 페이지 수
  const noPrev = startPage === 1; //이전 페이지가 없는 경우
  const noNext = startPage + viewNum - 1 >= totalPage;
  const currentPosts = datas?.slice(offset, offset + viewNum);

  const router = useRouter();

  const fetchAgencyList = () => {
    fetch('http://localhost:9999/dataList')
      .then((res) => res.json())
      .then((result) => {
        const filterAgency: string[] = ['전체'];
        result.forEach((el: dataInterface) => {
          if (filterAgency.includes(el.agency)) {
            return;
          } else {
            return filterAgency.push(el.agency);
          }
        });
        return setDatas(result), setAgencyList(filterAgency);
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
    fetchAgencyList();
  }, []);

  return (
    <div className='contain'>
      <form>
        <ul className='filter-bar'>
          <li>
            <Select label='기관 선택' options={agencyList} />
          </li>
          <li>
            <InputText pending='검색어를 입력해주세요.' />
          </li>
          <li>
            <Button label='검색' />
          </li>
          <li className='last'>
            <Link href='/cms/create' className='btn icon-with add line'>
              <span>수집 데이터 신규 등록</span>
              <i>
                <Add />
              </i>
            </Link>
          </li>
        </ul>
      </form>
      <CmsTable data={datas} />
    </div>
  );
}
