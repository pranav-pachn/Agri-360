export const getColor = (category) => {
  if (!category) return 'text-slate-400';
  if (category === 'High') return 'text-red-400';
  if (category === 'Medium') return 'text-yellow-400';
  return 'text-green-400';
};

export default getColor;
