import classNames from "classnames";
import { FC, SyntheticEvent, useState } from "react";
import { useFormContext, useController } from "react-hook-form";

const NumberIncrementor: FC<{ name: string, max?: number }> = ({ name, max = 5 }) => {
  const { control } = useFormContext();

  const { field: { value, onChange }, fieldState, formState } = useController({
    name,
    control,
    defaultValue: 0,
  });

  const decrementNumber = (e: SyntheticEvent) => {
    e.preventDefault();
    if (value <= 1) {
      onChange(0);
    } else {
      onChange(value - 1);
    }
  };

  const incrementNumber = (e: SyntheticEvent) => {
    e.preventDefault();
    if (value === max) {
      return
    } else {
      onChange(value + 1);
    }
  };


  return (
    <>
      <div className="border-solid border-black rounded border-[0.0625rem] flex w-[130px] overflow-hidden relative">
        <button
          onClick={decrementNumber}
          className="transition ease-in-out hover:bg-white hover:text-black border-solid border-black border-r-[0.0625rem] px-3 py-1 bg-black text-white font-bold w-10 text-md">
          -
        </button>
        <div className="w-full flex justify-center items-center">
          <h3>{value}</h3>
        </div>
        <button
          onClick={incrementNumber}
          disabled={value === max}
          className={classNames("transition ease-in-out hover:bg-white hover:text-black border-solid border-black border-l-[0.0625rem] px-3 py-1.5 bg-black text-white font-bold w-10 text-md", value === 5 ? "bg-gray-400 text-gray-400 hover:bg-gray-400" : "")}>
          +
        </button>
      </div>
      {value === max && (<p className="text-red-500 relative bottom-8">*&nbsp;Max {max} 😉</p>)}
    </>
  );
};

export default NumberIncrementor;
