'use client';

import { useState, useRef, useEffect } from 'react';
import '@/src/scss/_modal.scss';
import Button from '../button';
import Alarm from '@/public/alarm.svg';

export default function AlarmModal() {
  const modalRef = useRef<any>(null);
  const [isShowModal, setIsShowModal] = useState<boolean>(false);
  const [newNotice, setNewNotice] = useState<number | null>(2);

  const showModalHandler = (e: MouseEvent) => {
    // useRef current 밖을 클릭 시 드롭메뉴 닫힘
    e.preventDefault();
    if (isShowModal && !modalRef.current!.contains(e.target)) {
      setIsShowModal(false);
      return;
    } else return;
  };

  useEffect(() => {
    if (isShowModal) {
      document.addEventListener('mousedown', showModalHandler);
      return () => document.removeEventListener('mousedown', showModalHandler);
    } else return;
  }, [modalRef, isShowModal]);

  return (
    <li ref={modalRef} className={`alarm${newNotice ? ' new' : ''}`}>
      <button className='menu-btn' onClick={() => setIsShowModal(!isShowModal)}>
        <p className='hide'>알림</p>
        <i>
          <Alarm />
        </i>
      </button>
      <div ref={modalRef} className={`modal${isShowModal ? ' open' : ''}`}>
        <div className='contents'>
          <div className='top'>
            <h5>Modal Title</h5>
            <Button
              onClick={() => setIsShowModal(false)}
              label='닫기'
              icon='cross'
              size='min'
              state='secondary'
              type='icon-only'
            />
          </div>
          <ul>
            <li></li>
          </ul>
        </div>
        <div className='modal-bg'></div>
      </div>
    </li>
  );
}
