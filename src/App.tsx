import { HttpBatchClient, Tendermint37Client } from "@cosmjs/tendermint-rpc";
import { KujiraQueryClient, RPCS, TESTNET, kujiraQueryClient } from "kujira.js";
import { useEffect, useState } from "react";
import { AmountInput } from "./AmountInput";
import { SwapDetails } from "./SwapDetails";
import { TokenSelect } from "./TokenSelect";

const toClient = async (endpoint: string): Promise<Tendermint37Client> => {
  const c = await Tendermint37Client.create(
    new HttpBatchClient(endpoint, {
      dispatchInterval: 100,
      batchSizeLimit: 200,
    })
  );
  await c.status();
  return c;
};

export type Controller = {
  address: string;
  config: ControllerConfig;
  rates: ControllerRates;
  status: ControllerStatus;
};

export type ControllerConfig = {
  owner: string;
  protocol_fee: string;
  delegate_code_id: number;
  vault_address: string;
  offer_denom: string;
  ask_denom: string;
  adapter: {
    contract: {
      address: string;
      redemption_rate_query: string;
      unbond_start_msg: string;
      unbond_end_msg: string;
    };
  };
};

export type ControllerStatus = {
  total_base: string;
  total_quote: string;
  reserve_available: string;
  reserve_deployed: string;
};

export type ControllerRates = {
  vault_debt: string;
  vault_interest: string;
  vault_max_interest: string;
  provider_redemption: string;
};

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
  const [controllers, setControllers] = useState<Record<string, Controller>>();
  const [selected, setSelected] = useState<string>();
  const [queryClient, setQueryClient] = useState<KujiraQueryClient>();
  useEffect(() => {
    Promise.any(RPCS[TESTNET].map(toClient))
      .then((client) => kujiraQueryClient({ client }))
      .then(setQueryClient)
      .catch((err) => {});
  }, []);

  useEffect(() => {
    queryClient?.wasm.listContractsByCodeId(2688).then((x) => {
      !selected && setSelected(x.contracts[0]);
      x.contracts.map((y) =>
        Promise.all([
          queryClient.wasm.queryContractSmart(y, { config: {} }),
          queryClient.wasm.queryContractSmart(y, { status: {} }),
          queryClient.wasm.queryContractSmart(y, { rates: {} }),
        ]).then(([config, status, rates]) =>
          setControllers((prev) => ({
            ...prev,
            [y]: { address: y, config, status, rates },
          }))
        )
      );
    });
  }, [queryClient]);

  const controller =
    selected && controllers ? controllers[selected] : undefined;

  const [amount, setAmount] = useState("");
  return (
    <div className="">
      <h1 className="text-slate-100 mt-8 mb-2 text-center text-4xl font-light">
        Don't Wait. <span className="text-red-600 font-bold">Unstake.</span>
      </h1>

      <TokenSelect
        controllers={controllers}
        controller={controller}
        setSelected={setSelected}
      />
      <AmountInput amount={amount} setAmount={setAmount} />
      <SwapDetails rates={controller?.rates} amount={amount} />

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
