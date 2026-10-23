import Link from "next/link";
import { Phone, Mail } from "lucide-react";

export default function FAQPage() {
  return (
    <div className="font-sans antialiased bg-[#f9f8f6] text-[#241f21] min-h-screen">
      <div className="bg-[#241f21] text-white text-[13px] py-3 px-6 flex justify-center items-center gap-8 flex-wrap tracking-wider sticky top-0 z-50 shadow-md">
        <span>Free 15-minute consultation available.</span>
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 text-[#ad8330]" />
            <a href="tel:4356190326" className="hover:text-[#ad8330] transition-colors font-bold">435.619.0326</a>
          </span>
          <span className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-[#ad8330]" />
            <a href="mailto:jillevalentine@gmail.com" className="hover:text-[#ad8330] transition-colors font-bold">jillevalentine@gmail.com</a>
          </span>
        </div>
        <nav className="flex items-center gap-6 font-bold uppercase text-[12px] border-l border-white/20 pl-8 ml-2">
          <Link href="/" className="hover:text-[#ad8330] transition-colors">Home</Link>
          <Link href="/about" className="hover:text-[#ad8330] transition-colors">About</Link>
          <Link href="/services" className="hover:text-[#ad8330] transition-colors">Services</Link>
          <Link href="/specialties" className="hover:text-[#ad8330] transition-colors">Specialties</Link>
          <Link href="/insurance" className="hover:text-[#ad8330] transition-colors">Insurance</Link>
          <Link href="/faq" className="text-[#ad8330] hover:text-[#ad8330] transition-colors">FAQ</Link>
          <Link href="/contact" className="hover:text-[#ad8330] transition-colors">Contact</Link>
        </nav>
      </div>

      <header className="bg-[#241f21] w-full px-8 py-8 flex items-center justify-center text-white border-t border-white/10 shadow-sm">
        <Link href="/" className="text-center flex flex-col items-center">
          <span className="font-serif text-[2.5rem] leading-none tracking-wide">VALENTINE</span>
          <span className="font-sans text-[0.6rem] tracking-[0.25em] uppercase mt-1 opacity-90">Counseling</span>
        </Link>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16">
        <div className="bg-white p-8 md:p-12 rounded-xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-[#e5e0d8]">
          <h1 className="text-4xl font-serif text-[#241f21] mb-10 border-b-2 border-[#e5e0d8] pb-4">Frequently Asked Questions</h1>
          
          <div className="space-y-8">
            <div className="pb-8 border-b border-[#e5e0d8]">
              <h3 className="text-xl font-serif text-[#365010] mb-3">What should I expect during the free 15-minute consultation?</h3>
              <p className="text-gray-700 leading-relaxed">The 15-minute phone consultation is a low-pressure opportunity for us to get to know one another. You can share a brief overview of why you are seeking therapy, and I will explain my approach. Most importantly, it allows us both to determine if we are a good therapeutic fit before you commit to a full session.</p>
            </div>

            <div className="pb-8 border-b border-[#e5e0d8]">
              <h3 className="text-xl font-serif text-[#365010] mb-3">Do you take my insurance?</h3>
              <p className="text-gray-700 leading-relaxed">I am in-network with many major providers, including Aetna, BlueCross BlueShield, SelectHealth, Optum, UMR, and several others. Because plans vary widely, I recommend checking out my <Link href="/insurance" className="text-[#ad8330] font-bold hover:underline">Insurance page</Link>, or reaching out directly so we can verify your specific behavioral health benefits.</p>
            </div>

            <div className="pb-8 border-b border-[#e5e0d8]">
              <h3 className="text-xl font-serif text-[#365010] mb-3">How much does a session cost if I pay out-of-pocket?</h3>
              <p className="text-gray-700 leading-relaxed">If you are not using insurance, my private pay rate is $105 per individual session. I accept Cash, Check, Mastercard, and Visa. Payment is due at the time of service.</p>
            </div>

            <div className="pb-8 border-b border-[#e5e0d8]">
              <h3 className="text-xl font-serif text-[#365010] mb-3">How long will I need to be in therapy?</h3>
              <p className="text-gray-700 leading-relaxed">Therapy is a highly individualized process. Some clients find that short-term, solution-focused therapy (6-12 sessions) is exactly what they need to navigate a specific life transition. Others with complex trauma or ongoing relational issues may benefit from longer-term support. We will regularly assess your progress and adjust our timeline based on your healing.</p>
            </div>

            <div>
              <h3 className="text-xl font-serif text-[#365010] mb-3">Do you offer telehealth (online) therapy?</h3>
              <p className="text-gray-700 leading-relaxed">Currently, my practice is focused on providing high-quality, in-person therapy at my office in Saint George, Utah. I believe that being in the same room often facilitates a deeper, more connected therapeutic experience, particularly when dealing with trauma or deep emotional work.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}