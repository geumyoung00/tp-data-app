import Check from '@/public/checkbox.svg';

export default function Checkbox({
  children,
  id,
  disabled,
  onChangeHandler,
  checked,
}: {
  children: React.ReactNode;
  id?: string;
  disabled?: boolean;
  onChangeHandler?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  checked?: boolean;
}) {
  return (
    <div className='check center'>
      <input
        type='checkbox'
        id={id}
        disabled={disabled ? true : false}
        onChange={onChangeHandler}
        checked={checked}
      />
      <label className={`hide`} htmlFor={id}>
        {children}
        <i className='icon'>
          <Check />
        </i>
      </label>
    </div>
  );
}
