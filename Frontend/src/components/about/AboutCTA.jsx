import { PenTool, Info } from "lucide-react";

export default function AboutCTA() {
  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16 lg:py-20">
      <div className="bg-gradient-to-br from-sky-500 to-indigo-600 rounded-3xl p-8 sm:p-12 text-center text-white shadow-2xl">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          Ready to Join Us?
        </h2>
        <p className="text-lg text-sky-50 mb-8 max-w-2xl mx-auto">
          Be part of a community that values quality over quantity. Start
          writing, reading, and learning in a space designed for you.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/editor"
            className="bg-white text-sky-600 px-8 py-4 rounded-xl font-semibold
            inline-flex items-center justify-center gap-2
            transition duration-300 ease-out
            hover:scale-[1.03] hover:bg-sky-50 active:scale-[0.98]"
          >
            Start Writing Today
            <PenTool className="h-5 w-5" />
          </a>
          <a
            href="/contact"
            className="bg-sky-600 text-white px-8 py-4 rounded-xl font-semibold border-2 border-white/20
            inline-flex items-center justify-center gap-2
            transition duration-300 ease-out
            hover:scale-[1.03] hover:bg-sky-700 active:scale-[0.98]"
          >
            Get in Touch
            <Info className="h-5 w-5" />
          </a>
        </div>
      </div>
    </section>
  );
}
