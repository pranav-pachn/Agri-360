const Recommendations = ({ items = [] }) => {
  return (
    <div className="rounded-2xl bg-slate-800 p-5 shadow-md">
      <h2 className="text-lg font-semibold text-white">💡 Recommendations</h2>

      <ul className="mt-3 space-y-2 text-sm text-slate-200">
        {items.map((item) => (
          <li key={item} className="rounded-xl bg-slate-700/60 px-4 py-3">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Recommendations;
