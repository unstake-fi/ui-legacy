import { useEffect, useState } from "react";
import { AmountInput } from "./AmountInput";
import { SwapDetails } from "./SwapDetails";
import { TokenSelect } from "./TokenSelect";

const QUERY =
  "https://lcd-kujira.mintthemoon.xyz/cosmwasm/wasm/v1/contract/kujira1n3fr5f56r2ce0s37wdvwrk98yhhq3unnxgcqus8nzsfxvllk0yxquurqty/smart/eyJzdGF0ZSI6e319";

type State = {
  data: {
    total_ustake: string;
    total_utoken: string;
    exchange_rate: string;
    unlocked_coins: [
      {
        denom: string;
        amount: string;
      },
      {
        denom: string;
        amount: string;
      }
    ];
    unbonding: string;
    available: string;
    tvl_utoken: string;
  };
};

export default function App() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex">
          <img
            src="/unstake.png"
            alt="UNSTAKE.fi Logo"
            className="block h-20"
          />
        </div>
        <Content />
      </div>
    </div>
  );
}

const Content = () => {
  const [state, setState] = useState<State>();
  useEffect(() => {
    fetch(QUERY)
      .then((res) => res.json())
      .then(setState);
  }, []);
  const [amount, setAmount] = useState("");
  return (
    <div className="">
      <h1 className="text-slate-100 mt-8 mb-2 text-center text-4xl font-light">
        Don't Wait. <span className="text-red-600 font-bold">Unstake.</span>
      </h1>

      <TokenSelect />
      <AmountInput amount={amount} setAmount={setAmount} />
      <SwapDetails
        protocolRate={parseFloat(state?.data.exchange_rate || "0")}
        amount={amount}
      />

      <div className="text-center mt-4">
        <button
          disabled
          type="button"
          className="py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-slate-200 hover:bg-slate-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-slate-200 dark:focus:ring-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-600 dark:hover:text-white dark:hover:bg-slate-700"
        >
          Unstake
        </button>
      </div>
    </div>
  );
};
