'use client';
import Arrow from '@/public/arrow.svg';

export default function Select({
  label,
  size,
  hide,
  disabled,
  children,
  init,
  readOnly,
}: {
  label?: string;
  size?: string;
  hide?: string;
  disabled?: boolean;
  children?: React.ReactNode;
  init?: string;
  readOnly?: boolean;
}) {
  return (
    <>
      <label htmlFor={label} className={hide ? ' ' + 'hide' : ''}>
        {label}
      </label>
      <div
        className={`select${size ? ' ' + size : ''}${init ? ' ' + init : ''}${
          readOnly ? ' read-only' : ''
        }`}
      >
        {children ? children : <option>내용 없음</option>}
        <i className={`arrow`}>
          <Arrow />
        </i>
      </div>
    </>
  );
}
