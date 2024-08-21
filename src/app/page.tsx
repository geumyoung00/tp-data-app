import Link from 'next/link';

export default function Home() {
  return (
    <>
      <div className='contain login'>
        <h3>로그인페이지</h3>
        <Link href='/view'>자료수집현황</Link>
        <Link href='/cms'>자료수집시스템</Link>
      </div>
    </>
  );
}
