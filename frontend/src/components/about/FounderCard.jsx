import { Star } from "lucide-react";

export default function FounderCard({ founder }) {
  const isFeatured = founder.featured;

  return (
    <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group ring-2 ring-sky-500 ring-offset-2 h-full flex flex-col">
      {/* Featured Badge */}
      {isFeatured && (
        <div className="absolute top-4 right-4 z-10">
          <div className="flex items-center gap-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
            <Star className="w-3.5 h-3.5 fill-current" />
            Featured
          </div>
        </div>
      )}

      {/* Gradient Header */}
      <div className="h-24 bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-600" />

      {/* Avatar */}
      <div className="relative -mt-14 px-6">
        <img
          src={founder.avatar}
          alt={founder.name}
          className="h-28 w-28 rounded-2xl object-cover border-4 border-white shadow-xl ring-2 ring-sky-400"
        />
      </div>

      {/* Content */}
      <div className="px-6 pt-4 pb-6 flex-1 flex flex-col">
        <h3 className="text-xl font-bold text-slate-900">{founder.name}</h3>
        <p className="font-semibold text-sm text-sky-600">{founder.role}</p>

        <p className="text-slate-600 mt-3 leading-relaxed text-sm flex-1">
          {founder.bio}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-4">
          {founder.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs font-semibold px-3 py-1 rounded-full bg-sky-100 text-sky-700"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Social Links */}
        {founder.socials && founder.socials.length > 0 && (
          <div className="flex items-center gap-3 mt-5 pt-5 border-t border-slate-100">
            {founder.socials.map((social) => {
              const Icon = social.icon;
              const hasUrl = social.url && social.url.trim() !== "";

              return hasUrl ? (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-9 h-9 rounded-full bg-slate-100 text-slate-600 hover:bg-sky-500 hover:text-white transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ) : (
                <span
                  key={social.name}
                  className="flex items-center justify-center w-9 h-9 rounded-full bg-slate-50 text-slate-300 cursor-not-allowed transition-all duration-200 hover:bg-slate-100"
                >
                  <Icon className="w-4 h-4" />
                </span>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
