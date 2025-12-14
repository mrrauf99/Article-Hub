import React from "react";
import { Info, User2, PenTool, Code2 } from "lucide-react";

const defaultFounders = [
  {
    name: "Tayyab Ali",
    role: "UI / UX Designer & Frontend",
    bio: "UI-focused designer and frontend developer who loves clean layouts, smooth interactions, and design systems that feel modern and easy to use.",
    avatarUrl: "https://avatars.githubusercontent.com/u/192490949?v=4",
    focusTags: ["UI Design", "Design Systems", "Frontend"],
  },
  {
    name: "Abdul Rauf",
    role: "Frontend & Backend Developer",
    bio: "Full-stack problem solver who enjoys building reliable APIs, scalable architecture, and frontend integrations that just work.",
    avatarUrl: "https://avatars.githubusercontent.com/u/216373840?v=4",
    focusTags: ["Full Stack", "APIs", "Performance"],
  },
];

function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function AboutContent({ founders = defaultFounders }) {
  return (
    <section className="bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-12 lg:py-16">
        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700 border border-sky-100 mb-4">
            <Info className="h-4 w-4" />
            <span>About Article Hub</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Built for people who love{" "}
            <span className="bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text text-transparent">
              learning & creating
            </span>
          </h1>

          <p className="max-w-3xl text-sm sm:text-[15px] text-slate-700 leading-relaxed">
            Article Hub is crafted by a small team that cares about both{" "}
            <span className="font-semibold">good design</span> and{" "}
            <span className="font-semibold">solid engineering</span>. Together,
            we’re building a platform where readers discover clear,
            well-structured content, and writers get a focused, distraction-free
            place to share their knowledge.
          </p>

          <p className="max-w-3xl text-sm sm:text-[15px] text-slate-700 leading-relaxed mt-3">
            From technology and design to business and personal development,
            Article Hub is designed to feel modern, fast, and friendly – so you
            can enjoy learning, stay curious, and keep growing one article at a
            time.
          </p>
        </div>

        {/* Founders */}
        <div className="mt-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 flex items-center gap-2 mb-2">
            <User2 className="h-5 w-5 text-sky-600" />
            Meet the founders
          </h2>
          <p className="text-sm text-slate-600 mb-6">
            A collaborative duo: one focused on the visual experience, the other
            on the engineering behind it.
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            {founders.map((founder) => (
              <article
                key={founder.name}
                className="flex items-start gap-4 rounded-2xl bg-white p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Avatar */}
                {founder.avatarUrl ? (
                  <img
                    src={founder.avatarUrl}
                    alt={founder.name}
                    className="h-20 w-20 rounded-2xl object-cover shadow-sm border border-slate-100"
                  />
                ) : (
                  <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-500 flex items-center justify-center text-lg font-semibold text-white shadow-sm">
                    {getInitials(founder.name)}
                  </div>
                )}

                {/* Text */}
                <div className="space-y-2">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900">
                      {founder.name}
                    </h3>
                    <p className="text-xs font-medium text-sky-700">
                      {founder.role}
                    </p>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {founder.bio}
                  </p>

                  {founder.focusTags && founder.focusTags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {founder.focusTags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center rounded-full bg-slate-50 px-2.5 py-0.5 text-[11px] font-medium text-slate-700 border border-slate-200"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* What we offer */}
        <div className="mt-12 lg:mt-16">
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 mb-2">
            What we offer
          </h2>
          <p className="text-sm text-slate-600 mb-6 max-w-2xl">
            Article Hub is designed for learners, creators, and teams who value
            clarity, structure, and a clean reading experience.
          </p>

          <div className="grid gap-5 md:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-3">
                <PenTool className="h-4 w-4 text-sky-600" />
                <h3 className="text-sm font-semibold text-slate-900">
                  For learners
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600">
                Curated, high-quality articles that help you grow at your own
                pace, with a clean and distraction-free reading experience.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-3">
                <Code2 className="h-4 w-4 text-sky-600" />
                <h3 className="text-sm font-semibold text-slate-900">
                  For creators
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600">
                A simple, powerful writing workflow where you can draft, edit,
                and publish articles without noisy UI or unnecessary clutter.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-3">
                <Info className="h-4 w-4 text-sky-600" />
                <h3 className="text-sm font-semibold text-slate-900">
                  For teams
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600">
                Organize internal knowledge, share best practices, and keep your
                learning resources in one place for everyone to access.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
