import { FC } from "react";
import { ControllerRates } from "./App";

export const SwapDetails: FC<{ rates?: ControllerRates; amount: string }> = ({
  rates,
  amount,
}) => {
  const premiumRate = 0.997;
  const protocolRate = rates ? parseFloat(rates.provider_redemption) : 0;
  const returnAmount = parseFloat(amount) * protocolRate * premiumRate;

  return (
    <div className="flex flex-wrap max-w-2xl mt-3">
      <div className="px-4 py-3 sm:px-6 lg:px-8">
        <p className="text-sm font-medium leading-6 text-slate-400">
          Protocol Rate
        </p>
        <p className="mt-0 flex items-baseline gap-x-2">
          <span className="text-4xl font-semibold tracking-tight text-white">
            {protocolRate.toFixed(4)}
          </span>
          <span className="text-sm text-slate-400">KUJI</span>
        </p>
      </div>

      <div className="px-4 py-3 sm:px-6 lg:px-8">
        <p className="text-sm font-medium leading-6 text-slate-400">
          Offer Rate
        </p>
        <p className="mt-0 flex items-baseline gap-x-2">
          <span className="text-4xl font-semibold tracking-tight text-white">
            {(protocolRate * premiumRate).toFixed(4)}
          </span>
          <span className="text-sm text-slate-400">KUJI</span>
        </p>
      </div>

      <div className="px-4 py-3 sm:px-6 lg:px-8">
        <p className="text-sm font-medium leading-6 text-slate-400">
          Return Amount
        </p>
        <p className="mt-0 flex items-baseline gap-x-2">
          <span className="text-4xl font-semibold tracking-tight text-white">
            {isFinite(returnAmount) ? returnAmount.toFixed(4) : "-"}
          </span>
          <span className="text-sm text-slate-400">KUJI</span>
        </p>
      </div>
    </div>
  );
};
