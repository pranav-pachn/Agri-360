const Recommendations = ({ items = [] }) => {
  return (
    <div className="card space-y-6">
      <h2 className="text-2xl font-semibold tracking-tight text-white">💡 Recommendations</h2>

      <ul className="space-y-3 text-sm text-slate-200">
        {items.map((item) => (
          <li key={item} className="rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-4 backdrop-blur-md">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Recommendations;
