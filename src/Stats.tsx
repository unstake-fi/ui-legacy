import { BigNumber } from "@ethersproject/bignumber";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/20/solid";
import { Denom, KujiraQueryClient } from "kujira.js";
import { FC, useEffect, useState } from "react";
import { Controller } from "./App";

interface StatusResponse {
  total_base: string;
  total_quote: string;
  reserve_available: string;
  reserve_deployed: string;
}

interface Status {
  totalBase: BigNumber;
  totalQuote: BigNumber;
  reserveAvailable: BigNumber;
  reserveDeployed: BigNumber;
}

export const Stats: FC<{
  queryClient?: KujiraQueryClient;
  controller?: Controller;
}> = ({ queryClient, controller }) => {
  const [status, setStatus] = useState<Status>();

  useEffect(() => {
    controller &&
      queryClient?.wasm
        .queryContractSmart(controller.address, { status: {} })
        .then((res: StatusResponse) =>
          setStatus({
            totalBase: BigNumber.from(res.total_base),
            totalQuote: BigNumber.from(res.total_quote),
            reserveAvailable: BigNumber.from(res.reserve_available),
            reserveDeployed: BigNumber.from(res.reserve_deployed),
          })
        );
  }, [queryClient, controller]);

  const totalBase = status ? status.totalBase.toNumber() / 1e6 : 0;
  const reserveAvailable = status
    ? status.reserveAvailable.toNumber() / 1e6
    : 0;
  const reserveDeployed = status ? status.reserveDeployed.toNumber() / 1e6 : 0;

  return (
    <div className="rounded-xl p-8 border border-slate-800 mt-3">
      <table className="table-auto text-slate-600 text-sm  w-full">
        <tbody>
          <tr>
            <th className="text-left font-semibold">Reserves Available:</th>
            <td className="text-right">
              <a
                href="https://twitter.com/unstake_fi/status/1721892391664361835?s=20"
                target="_blank"
                className="inline-flex items-center text-slate-300 hover:text-purple-500"
              >
                {reserveAvailable.toFixed(4)}{" "}
                {Denom.from(controller?.config.offer_denom || "").symbol}
                <ArrowTopRightOnSquareIcon className="h-4 w-4 text-slate-600 ml-1" />
              </a>
            </td>
          </tr>
          <tr>
            <th className="text-left font-semibold">Reserves In Use:</th>
            <td className="text-right text-slate-300">
              <a
                href="https://twitter.com/unstake_fi/status/1721892391664361835?s=20"
                target="_blank"
                className="inline-flex items-center text-slate-300 hover:text-purple-500"
              >
                {reserveDeployed.toFixed(4)}{" "}
                {Denom.from(controller?.config.offer_denom || "").symbol}
                <ArrowTopRightOnSquareIcon className="h-4 w-4 text-slate-600 ml-1" />
              </a>
            </td>
          </tr>
          {/* <tr>
            <th className="text-left font-semibold">GHOST Borrow Available:</th>
            <td className="text-right text-slate-300">
              <a
                href=""
                target="_blank"
                className="inline-flex items-center text-slate-300 hover:text-purple-500"
              >
                {reserveDeployed.toFixed(4)} {Denom.from(controller?.config.offer_denom|| "").symbol}
                <ArrowTopRightOnSquareIcon className="h-4 w-4 text-slate-600 ml-1" />
              </a>
            </td>
          </tr> */}
          <tr>
            <th className="text-left font-semibold">Total Unstaked:</th>
            <td className="text-right text-slate-300">
              {totalBase.toFixed(4)}{" "}
              {Denom.from(controller?.config.ask_denom || "").symbol}
              <div className="inline-block w-4 h-4 ml-1"></div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
