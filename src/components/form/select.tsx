'use client';
import Arrow from '@/public/arrow.svg';

export default function Select({
  label,
  options,
  size,
  hide,
  disabled,
  onChangeHandler,
}: {
  label?: string;
  options: string[];
  size?: string;
  hide?: string;
  disabled?: boolean;
  onChangeHandler?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) {
  //  1. 부모 컴포넌트에서 리스트 전달
  //  2. 리스트를 옵션으로 맵핑
  //  3. 기능 정의
  //      -1. 키보드, 마우스 액션으로 옵션 리스트 영역을 열고 닫기
  //      -2. 리스트가 열려있는 상태일 때 선택 된 옵션에 포커스 되어있어야 하고 키보드로 옵션 탐색
  //      -3. 키보드 액션을 통해 선택

  return (
    <>
      <label htmlFor='test' className={hide ? ' ' + 'hide' : ''}>
        {label}
      </label>
      <div className={`select${size ? ' ' + size : ''}`}>
        <select
          onChange={onChangeHandler}
          id='test'
          name='test'
          disabled={disabled ? true : false}
        >
          {options!.map((option) => {
            return <option key={option}>{option}</option>;
          })}
        </select>
        <i className={`arrow`}>
          <Arrow />
        </i>
      </div>
    </>
  );
}
