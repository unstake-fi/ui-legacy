import { FC } from "react";

export const SwapDetails: FC<{ protocolRate: number; amount: string }> = ({
  protocolRate,
  amount,
}) => {
  const premiumRate = 0.997;
  const returnAmount = parseFloat(amount) * protocolRate * premiumRate;

  return (
    <div className="grid grid-cols-1 gap-px md:grid-cols-3">
      <div className="px-4 py-6 sm:px-6 lg:px-8">
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

      <div className="px-4 py-6 sm:px-6 lg:px-8">
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

      <div className="px-4 py-6 sm:px-6 lg:px-8">
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
