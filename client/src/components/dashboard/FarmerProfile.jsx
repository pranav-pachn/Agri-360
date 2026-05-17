const FarmerProfile = ({
  name = 'Ramesh Kumar',
  location = 'Guntur, Andhra Pradesh',
  crop = 'Rice',
}) => {
  return (
    <div className="rounded-2xl bg-slate-800 p-5 shadow-md">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">👤 Farmer Profile</h2>
          <p className="text-sm text-gray-400">{name}</p>
          <p className="text-sm text-gray-400">{location}</p>
        </div>

        <div className="text-left sm:text-right">
          <p className="text-sm text-gray-400">Crop</p>
          <p className="text-base font-semibold text-white">{crop} 🌾</p>
        </div>
      </div>
    </div>
  );
};

export default FarmerProfile;
