'use client';

import { useEffect, useState } from 'react';

export default function InputText({
  pending,
  label,
  size,
  hide,
  focus,
  value,
  type,
  disabled,
  getValue,
}: {
  pending?: string;
  label?: string;
  size?: string;
  hide?: string;
  focus?: boolean;
  value?: string;
  type?: string;
  disabled?: boolean;
  getValue?: (value: string) => void;
}) {
  const [text, setText] = useState<string>();

  useEffect(() => {
    if (value) setText(value);
  }, [value]);

  const changHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    getValue!(e.target.value);
  };

  return (
    <>
      {label ? (
        <label htmlFor={label} className={hide ? hide : ''}>
          {label}
        </label>
      ) : (
        ''
      )}
      <div className={`input-text${size ? ' ' + size : ''}`}>
        <input
          type={type ? type : 'text'}
          placeholder={pending}
          id={label}
          name={label}
          onChange={changHandler}
          defaultValue={text}
          autoFocus={focus ? true : false}
          disabled={disabled}
        />
      </div>
    </>
  );
}
