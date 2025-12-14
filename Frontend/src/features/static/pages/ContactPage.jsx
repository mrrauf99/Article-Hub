import React from "react";
import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer";
import ContactForm from "../components/ContactForm";

export default function ContactPage() {
  const handleSubmit = async (data) => {
    alert("Message sent! (check console for payload)");
    console.log("Contact data:", data);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar userRole="guest" />
      <main className="flex-1 px-4 py-10">
        <section className="max-w-3xl mx-auto mb-6">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Contact <span className="text-sky-600">Article Hub</span>
          </h1>
          <p className="text-sm text-slate-600">
            Have a question, feature request, or collaboration idea? Fill out
            the form below and we&apos;ll get back to you as soon as we can.
          </p>
        </section>
        <ContactForm onSubmit={handleSubmit} />
      </main>
      <Footer />
    </div>
  );
}
