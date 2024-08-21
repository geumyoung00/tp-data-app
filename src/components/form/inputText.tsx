'use client';

import { useEffect, useState } from 'react';

export default function InputText({
  pending,
  label,
  size,
  hide,
  style,
  focus,
  value,
  disabled,
}: {
  pending?: string;
  label?: string;
  size?: string;
  hide?: string;
  style?: string;
  focus?: boolean;
  value?: string;
  disabled?: boolean;
}) {
  const [text, setText] = useState<string>();
  useEffect(() => {
    if (value) setText(value);
  }, []);

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
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
      <div
        className={`input-text${size ? ' ' + size : ''}${
          style ? ' ' + style : ''
        }`}
      >
        <input
          type='text'
          placeholder={pending}
          id={label}
          name={label}
          onChange={onChangeHandler}
          defaultValue={text}
          autoFocus={focus ? true : false}
          disabled={disabled}
        />
      </div>
    </>
  );
}
