const stats = [
  { name: "Protocol Rate", value: "1.0242", unit: "KUJI" },
  { name: "Offer Rate", value: "1.0211", unit: "KUJI" },
  { name: "Return Amount", value: "0.0000", unit: "KUJI" },
];

export const SwapDetails = () => {
  return (
    <div className="grid grid-cols-1 gap-px md:grid-cols-3">
      {stats.map((stat) => (
        <div key={stat.name} className="px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-sm font-medium leading-6 text-slate-400">
            {stat.name}
          </p>
          <p className="mt-0 flex items-baseline gap-x-2">
            <span className="text-4xl font-semibold tracking-tight text-white">
              {stat.value}
            </span>
            {stat.unit ? (
              <span className="text-sm text-slate-400">{stat.unit}</span>
            ) : null}
          </p>
        </div>
      ))}
    </div>
  );
};
