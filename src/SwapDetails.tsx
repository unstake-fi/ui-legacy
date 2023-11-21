import { FC } from "react";
import { ControllerRates, Offer } from "./App";

export const SwapDetails: FC<{
  rates?: ControllerRates;
  amount: string;
  offer?: Offer;
}> = ({ rates, amount, offer }) => {
  const protocolRate = rates ? parseFloat(rates.provider_redemption) : 0;
  const returnAmount = offer ? parseInt(offer.amount) / 1e6 : 0;
  const offerRate = returnAmount / parseFloat(amount);
  return (
    <div className="flex flex-wrap max-w-2xl mx-auto mt-3 justify-center">
      <div className="px-4 py-3 sm:px-6 lg:px-8">
        <p className="text-sm font-medium leading-6 text-slate-400">
          Protocol Rate
        </p>
        <p className="mt-0 flex items-baseline gap-x-2">
          <span className="text-4xl font-semibold tracking-tight text-white">
            {protocolRate.toFixed(4)}
          </span>
        </p>
      </div>

      <div className="px-4 py-3 sm:px-6 lg:px-8">
        <p className="text-sm font-medium leading-6 text-slate-400">
          Offer Rate
        </p>
        <p className="mt-0 flex items-baseline gap-x-2">
          <span className="text-4xl font-semibold tracking-tight text-white">
            {isFinite(offerRate) && offerRate > 0 ? offerRate.toFixed(4) : "-"}
          </span>
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
      <div className="w-full h-1" />
      <a
        href="https://x.com/unstake_fi/status/1721892391664361835?s=20"
        target="_blank"
        className="text-xs text-slate-400 hover:text-slate-100"
      >
        How are rates calculated?
      </a>
    </div>
  );
};
