import { Clock } from "lucide-react";
import ContactInfoItem from "./ContactInfoItem";
import { CONTACT_INFO } from "../data/contactInfo";

export default function ContactInfo() {
  return (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl border border-slate-200 p-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">
          Contact Information
        </h2>
        <p className="text-slate-600 mb-8">
          Reach out to us through any of these channels.
        </p>

        <div className="space-y-4">
          {CONTACT_INFO.map((item) => (
            <ContactInfoItem key={item.title} {...item} />
          ))}
        </div>
      </div>

      <div className="bg-blue-600 rounded-2xl p-8 text-white">
        <h3 className="text-2xl font-bold mb-2">Quick Response</h3>
        <p className="text-blue-50 mb-4">
          We typically respond within 24 hours during business days.
        </p>
        <div className="flex items-center gap-2 text-blue-100">
          <Clock className="w-5 h-5" />
          <span className="text-sm">Average response time: 4 hours</span>
        </div>
      </div>
    </div>
  );
}
