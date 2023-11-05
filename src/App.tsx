import { AmountInput } from "./AmountInput";
import { SwapDetails } from "./SwapDetails";
import { TokenSelect } from "./TokenSelect";

export default function App() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* We've used 3xl here, but feel free to try other max-widths based on your needs */}
      <div className="mx-auto max-w-3xl">
        <Content />
      </div>
    </div>
  );
}

const Content = () => {
  return (
    <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow">
      <div className="px-4 py-5 sm:px-6">Don't Wait. Unstake.</div>
      <div className="px-4 py-5 sm:p-6 bg-gray-900">
        <TokenSelect />
        <AmountInput />
        <SwapDetails />
      </div>
      <div className="px-4 py-4 sm:px-6">
        <button
          type="button"
          className="rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Unstake
        </button>
      </div>
    </div>
  );
};
