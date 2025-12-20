export default function FounderCard({ founder }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <img src={founder.avatar} className="h-24 w-24 rounded-xl mb-4" />
      <h3 className="text-xl font-bold">{founder.name}</h3>
      <p className="text-sky-600">{founder.role}</p>
      <p className="text-slate-600 mt-3">{founder.bio}</p>
    </div>
  );
}