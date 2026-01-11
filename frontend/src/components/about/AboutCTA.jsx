import { PenTool, Info } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";

export default function AboutCTA() {
  return (
    <section className="w-full px-3 sm:px-4 md:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
      <div className="w-full max-w-4xl mx-auto">
      <ScrollReveal animation="scale-up" duration={700}>
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
              href="/login"
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
      </ScrollReveal>
      </div>
    </section>
  );
}
