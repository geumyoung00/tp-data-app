'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import '@/src/scss/_header.scss';
import Setting from '@/public/setting.svg';
import Auth from '@/public/singout.svg';
import View from '@/public/view.svg';
import AlarmModal from './modal/alarmModal';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  const [haveNew, setHaveNew] = useState(true);
  const [token, setToken] = useState(true);

  return (
    <div className='header'>
      <h1>
        <Link href={'/'}>자료 수집 현황</Link>
      </h1>
      <ol className='user-menu'>
        <AlarmModal />
        {token ? (
          <li className='setting'>
            {pathname.includes('/cms') ? (
              <Link
                className='menu-btn'
                href={'/view'}
                title='자료 수집 시스템 바로가기'
              >
                <p className='hide'>자료 수집 시스템</p>
                <i>
                  <View />
                </i>
              </Link>
            ) : (
              <Link
                className='menu-btn'
                href={'/cms'}
                title='자료 수집 설정 바로가기'
              >
                <p className='hide'>자료 수집 설정</p>
                <i>
                  <Setting />
                </i>
              </Link>
            )}
          </li>
        ) : (
          ''
        )}
        <li className='auth '>
          <button className='menu-btn'>
            <p>사용자명</p>
            <i>
              <Auth />
            </i>
          </button>
        </li>
      </ol>
    </div>
  );
}
