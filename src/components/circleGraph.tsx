export default function CircleGraph() {
  return (
    <div className='graph-wrap'>
      <div className='graph'>
        <div className='contents'></div>
      </div>
      <div className='text-wrap'>
        <h3>국립해양조사원</h3>
        <ol>
          <li className='success'>
            <p className='count'>10</p>
            <p>수집성공</p>
          </li>
          <li className='faild'>
            <p className='count'>00</p>
            <p>수집실패</p>
          </li>
          <li className='pending'>
            <p className='count'>00</p>
            <p>수집 중</p>
          </li>
        </ol>
      </div>
    </div>
  );
}
