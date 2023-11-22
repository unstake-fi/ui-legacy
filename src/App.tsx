import {
  ExecuteResult,
  SigningCosmWasmClient,
} from "@cosmjs/cosmwasm-stargate";
import { GasPrice } from "@cosmjs/stargate";
import { HttpBatchClient, Tendermint37Client } from "@cosmjs/tendermint-rpc";
import {
  CHAIN_INFO,
  KujiraQueryClient,
  RPCS,
  TESTNET,
  kujiraQueryClient,
} from "kujira.js";
import { FC, useEffect, useMemo, useState } from "react";
import { AmountInput } from "./AmountInput";
import { SwapDetails } from "./SwapDetails";
import { TokenSelect } from "./TokenSelect";
import { useDebouncedEffect } from "./useDebouncedEffect";
import { useTokenAmount } from "./useTokenAmount";

const CHAIN_ID = TESTNET;
const CODE_ID = 2691;

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

export type Offer = {
  amount: string;
  fee: string;
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
  const [offer, setOffer] = useState<Offer>();
  const controller = useMemo(
    () => (selected && controllers ? controllers[selected] : undefined),
    [selected, controllers]
  );

  const [[amount, setAmount], [amountInt, setAmountInt]] = useTokenAmount(6);

  const [result, setResult] = useState<
    "working" | ExecuteResult | Error | null
  >();

  const [wallet, setWallet] = useState<{
    client: SigningCosmWasmClient;
    account: string;
  }>();

  const [balance, setBalance] = useState<string>();
  useEffect(() => {
    wallet &&
      controller &&
      queryClient?.bank
        .balance(wallet.account, controller.config.ask_denom)
        .then((res) => setBalance(res.amount));
  }, [queryClient, wallet, controller]);

  const connect = async () => {
    if (!window.leap) {
      window.open(
        "https://www.leapwallet.io/download",
        "_blank",
        "noopener,noreferrer"
      );
      return;
    }
    if (!queryClient) return;
    const rpcUrl = queryClient["tmClient"].client.url;
    await window.leap.experimentalSuggestChain({
      ...CHAIN_INFO[CHAIN_ID],
      rpc: rpcUrl,
      rest: "https://kujira-testnet-api.polkachu.com",
    });
    // await window.leap.enable(CHAIN_ID);
    const offlineSigner = await window.leap.getOfflineSignerAuto(CHAIN_ID);
    const accounts = await offlineSigner.getAccounts();

    const client = await SigningCosmWasmClient.connectWithSigner(
      rpcUrl,
      offlineSigner,
      { gasPrice: GasPrice.fromString("0.00125ukuji") }
    );
    setWallet({ client, account: accounts[0].address });
  };

  const submit = () => {
    if (!wallet) return;
    if (!amount) return;
    if (!offer) return;
    if (!controller) return;
    setResult("working");
    wallet.client
      .execute(
        wallet.account,
        controller.address,
        { unstake: { max_fee: offer.fee } },
        "auto",
        "",
        [{ amount: amountInt.toString(), denom: controller.config.ask_denom }]
      )
      .then(setResult)
      .catch(setResult);
  };

  useEffect(() => {
    Promise.any(RPCS[CHAIN_ID].map(toClient))
      .then((client) => kujiraQueryClient({ client }))
      .then(setQueryClient)
      .catch((err) => {
        console.error(err);
      });
  }, []);

  useEffect(() => {
    queryClient?.wasm.listContractsByCodeId(CODE_ID).then((x) => {
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
  }, [queryClient, selected]);

  useDebouncedEffect(
    () => {
      selected &&
        amountInt.gt(0) &&
        queryClient?.wasm
          .queryContractSmart(selected, {
            offer: { amount: amountInt.toString() },
          })
          .then(setOffer)
          .catch((err) => {
            console.error(err);
          });
    },
    [queryClient, amount, selected],
    500
  );

  return (
    <div className="">
      <h1 className="text-slate-100 mt-8 mb-2 text-center text-4xl font-light">
        Don't Wait. <span className="text-red-600 font-bold">Unstake.</span>
      </h1>

      {wallet && wallet.account && (
        <div
          className="items-center justify-center leading-none flex flex-wrap w-full my-1"
          role="alert"
        >
          <span className="border border-teal-500 flex rounded-full bg-teal-800 px-2 py-1 text-xs font-bold mr-3 text-teal-300">
            Connected Testnet
          </span>
          <span className="text-xs text-left text-slate-200">
            {wallet.account}
          </span>
        </div>
      )}

      <TokenSelect
        controllers={controllers}
        controller={controller}
        setSelected={setSelected}
      />
      <AmountInput
        max={balance}
        amount={amount}
        setAmount={(amount) => {
          setAmount(amount);
          setOffer(undefined);
        }}
        setAmountInt={(int) => {
          setAmountInt(int);
          setOffer(undefined);
        }}
      />
      <SwapDetails amount={amount} rates={controller?.rates} offer={offer} />

      <div className="text-center mt-4">
        {wallet ? (
          result ? (
            <Result result={result} onClick={() => setResult(null)} />
          ) : (
            <button
              onClick={submit}
              type="button"
              className="py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-slate-200 hover:bg-slate-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-slate-200 dark:focus:ring-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-600 dark:hover:text-white dark:hover:bg-slate-700"
            >
              Unstake
            </button>
          )
        ) : (
          <button
            onClick={connect}
            type="button"
            className="py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-slate-200 hover:bg-slate-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-slate-200 dark:focus:ring-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-600 dark:hover:text-white dark:hover:bg-slate-700"
          >
            Connect LEAP Wallet
          </button>
        )}
      </div>
    </div>
  );
};

const Result: FC<{
  result: "working" | Error | ExecuteResult;
  onClick: () => void;
}> = ({ result, onClick }) => {
  if (result === "working")
    return (
      <div
        className="bg-indigo-900 border border-indigo-500  text-sm px-2 py-1 rounded relative flex justify-center cursor-wait"
        role="alert"
      >
        <strong className="font-bold mr-1 text-indigo-500">Unstaking...</strong>
      </div>
    );

  if ("transactionHash" in result)
    return (
      <a
        href={`https://finder.kujira.network/harpoon-4/tx/${result.transactionHash}`}
        target="_blank"
        className="bg-teal-900 border border-teal-500 text-sm px-4 py-3 rounded relative flex items-center text-teal-300 hover:text-white"
        role="alert"
      >
        <strong className="font-bold mr-1 text-teal-500">Success:</strong>
        <span className="block sm:inline mr-1">{result.transactionHash}</span>
        <svg
          className="fill-current opacity-75 h-4 w-4 ml-auto"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M12.95 10.707l.707-.707L8 4.343 6.586 5.757 10.828 10l-4.242 4.243L8 15.657l4.95-4.95z" />
        </svg>
      </a>
    );

  return (
    <div
      className="bg-red-900 border border-red-500  text-sm px-4 py-3 rounded relative cursor-pointer"
      role="alert"
      onClick={onClick}
    >
      <strong className="font-bold mr-1 text-red-500">Error:</strong>
      <span className="block sm:inline text-red-300">{result.message}</span>
    </div>
  );
};
