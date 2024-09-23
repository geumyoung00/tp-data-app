export default function Radio({
  options,
}: {
  options: {
    label: string;
    name: string;
    value: string;
    checked?: boolean;
    disabled?: boolean;
  }[];
}) {
  return (
    <>
      <div className='radio'>
        {options.map((option) => {
          return (
            <label key={option.name + option.value}>
              <input
                type='radio'
                id={option.name}
                name={option.name}
                value={option.value}
                defaultChecked={option.checked}
                disabled={option.disabled}
              />
              <span>{option.label}</span>
            </label>
          );
        })}
      </div>
    </>
  );
}
