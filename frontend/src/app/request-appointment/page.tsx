import Link from "next/link";
import { ArrowLeft, Phone, Mail, MapPin, CheckCircle2, Clock } from "lucide-react";

export default function RequestAppointmentPage() {
  return (
    <div className="font-sans antialiased bg-[#f9f8f6] text-[#241f21] min-h-screen">
      <header className="bg-white border-b border-[#e5e0d8] px-8 py-6 flex items-center justify-between">
        <Link href="/" className="flex flex-col">
          <span className="font-serif text-2xl leading-none tracking-wide">VALENTINE</span>
          <span className="text-[0.55rem] tracking-[0.25em] uppercase mt-1 text-gray-500">
            Counseling
          </span>
        </Link>
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-bold text-[#ad8330] hover:text-[#8e6b27] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
      </header>

      <main className="max-w-[1000px] mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl md:text-5xl mb-4">
            Request an Appointment
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed text-lg">
            Whether you&apos;re ready to book a session or just have questions,
            I&apos;m here to help. Choose the option that works best for you.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-12">
          <div className="bg-white border border-[#e5e0d8] rounded-xl p-6 flex flex-col">
            <div className="w-12 h-12 bg-[#ad8330]/10 rounded-full flex items-center justify-center mb-4">
              <Phone className="w-6 h-6 text-[#ad8330]" />
            </div>
            <h2 className="font-serif text-xl mb-2">Call</h2>
            <p className="text-sm text-gray-600 mb-4 flex-1">
              Prefer to talk? Call for a free 15-minute consultation.
            </p>
            <a
              href="tel:4356190326"
              className="text-[#ad8330] font-bold hover:text-[#8e6b27] text-sm"
            >
              (435) 619-0326 →
            </a>
          </div>

          <div className="bg-white border border-[#e5e0d8] rounded-xl p-6 flex flex-col">
            <div className="w-12 h-12 bg-[#ad8330]/10 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-6 h-6 text-[#ad8330]" />
            </div>
            <h2 className="font-serif text-xl mb-2">Email</h2>
            <p className="text-sm text-gray-600 mb-4 flex-1">
              Send a message with any questions about availability or insurance.
            </p>
            <a
              href="mailto:jillevalentine@gmail.com"
              className="text-[#ad8330] font-bold hover:text-[#8e6b27] text-sm"
            >
              jillevalentine@gmail.com →
            </a>
          </div>

          <div className="bg-[#ad8330] text-white rounded-xl p-6 flex flex-col shadow-lg">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-4">
              <Clock className="w-6 h-6" />
            </div>
            <h2 className="font-serif text-xl mb-2">Book Online</h2>
            <p className="text-sm text-white/90 mb-4 flex-1">
              Create an account and request a session time. You&apos;ll get a
              response within one business day.
            </p>
            <Link
              href="/signup"
              className="inline-block bg-white text-[#ad8330] font-bold text-sm px-5 py-2.5 rounded-full hover:bg-[#f9f8f6] transition text-center"
            >
              Create account →
            </Link>
          </div>
        </div>

        <div className="bg-white border border-[#e5e0d8] rounded-2xl p-8 md:p-10">
          <h2 className="font-serif text-2xl mb-6">What to expect</h2>
          <ol className="space-y-4">
            {[
              "Create your account — takes less than a minute.",
              "Request a session time that works for you.",
              "I'll review and confirm within one business day.",
              "You'll see the confirmed time in your portal.",
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-4">
                <span className="shrink-0 w-8 h-8 rounded-full bg-[#ad8330]/10 text-[#ad8330] font-bold flex items-center justify-center text-sm">
                  {i + 1}
                </span>
                <p className="text-gray-700 pt-1">{step}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-10 bg-white border border-[#e5e0d8] rounded-xl p-6 flex items-start gap-4">
          <MapPin className="w-5 h-5 text-[#ad8330] shrink-0 mt-1" />
          <div className="text-sm">
            <p className="font-bold mb-1">Sessions available in-person</p>
            <p className="text-gray-600">
              321 North Mall Dr, Suite F 202 · Saint George, UT 84790
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}