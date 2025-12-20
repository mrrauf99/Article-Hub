import { Mail } from "lucide-react";

export default function ContactHero() {
  return (
    <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-blue-600/10 rounded-full flex items-center justify-center">
            <Mail className="w-8 h-8 text-blue-500" strokeWidth={2} />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Get in Touch
        </h1>

        {/* Description */}
        <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto mb-4">
          Have a question or want to work together? We'd love to hear from you.
        </p>
        <p className="text-base text-slate-400 max-w-2xl mx-auto">
          Whether you're a writer looking to share ideas or a reader with
          feedback, we're here to help build a better content experience.
        </p>
      </div>
    </div>
  );
}
