import { ArrowUpTrayIcon } from "@heroicons/react/20/solid";
import { FC } from "react";

import { BigNumber } from "@ethersproject/bignumber";

export const AmountInput: FC<{
  amount: string;
  max?: string;
  setAmount: (v: string) => void;
  setAmountInt: (v: BigNumber) => void;
}> = ({ amount, max, setAmount, setAmountInt }) => {
  return (
    <div>
      <div className="mt-2 flex rounded-md shadow-sm">
        <div className="relative flex flex-grow items-stretch focus-within:z-10">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <ArrowUpTrayIcon
              className="h-5 w-5 text-slate-500"
              aria-hidden="true"
            />
          </div>
          <input
            value={amount}
            onChange={(e) => setAmount(e.currentTarget.value)}
            type="text"
            name="amount"
            id="amount"
            className="block w-full rounded-none rounded-l-md border-0 py-2 pl-11 bg-slate-800 text-slate-200 ring-1 ring-inset ring-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-inset focus:ring-slate-500 sm:text-sm sm:leading-6 text-base"
            placeholder="0.000"
          />
        </div>
        <button
          onClick={() => max && setAmountInt(BigNumber.from(max))}
          type="button"
          className="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 py-2 text-sm text-slate-400 ring-1 ring-inset ring-slate-700 hover:bg-slate-700 hover:text-slate-300"
        >
          {max ? (parseInt(max) / 1e6).toFixed(3) : "0.000"} Max
        </button>
      </div>
    </div>
  );
};
