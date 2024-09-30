import { dataType, fetchData } from '@/src/db/data';

export default async function LogPage({
  params: { id },
}: {
  params: { id: string };
}) {
  let nowData: dataType;
  await fetchData().then((data) => (nowData = data[parseInt(id) - 1]));
  const { agency, collectItem, time, state, log } = nowData!;
  const parseDate = new Date(time).toLocaleString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const parseTime = new Date(time).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false,
  });

  return (
    <div className='contain'>
      <h2 className='sub-title'>{nowData!.id} 수집 상세 정보</h2>
      <div className='data-info'>
        <dl>
          <dt>수집 기관</dt>
          <dd>{agency}</dd>
        </dl>
        <dl>
          <dt>수집 항목</dt>
          <dd>{collectItem}</dd>
        </dl>
        <dl>
          <dt>수집 시간</dt>
          <dd>
            {parseDate}
            {parseTime}
          </dd>
        </dl>
        <dl>
          <dt>수집 상태</dt>
          <dd>
            <div className={`tag ${state}`}>
              <span>
                {state === 'success'
                  ? '수집성공'
                  : state === 'faild'
                  ? '수집 실패'
                  : '수집 중'}
              </span>
            </div>
          </dd>
        </dl>
        <div className='logbox'>
          <textarea name='' id='' value={log!} readOnly></textarea>
        </div>
      </div>
    </div>
  );
}
