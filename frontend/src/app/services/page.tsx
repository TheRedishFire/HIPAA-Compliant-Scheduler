import Link from "next/link";
import { Phone, Mail } from "lucide-react";

export default function ServicesPage() {
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
          <Link href="/services" className="text-[#ad8330] hover:text-[#ad8330] transition-colors">Services</Link>
          <Link href="/specialties" className="hover:text-[#ad8330] transition-colors">Specialties</Link>
          <Link href="/insurance" className="hover:text-[#ad8330] transition-colors">Insurance</Link>
          <Link href="/faq" className="hover:text-[#ad8330] transition-colors">FAQ</Link>
          <Link href="/contact" className="hover:text-[#ad8330] transition-colors">Contact</Link>
        </nav>
      </div>

      <header className="bg-[#241f21] w-full px-8 py-8 flex items-center justify-center text-white border-t border-white/10 shadow-sm">
        <Link href="/" className="text-center flex flex-col items-center">
          <span className="font-serif text-[2.5rem] leading-none tracking-wide">VALENTINE</span>
          <span className="font-sans text-[0.6rem] tracking-[0.25em] uppercase mt-1 opacity-90">Counseling</span>
        </Link>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-white p-8 md:p-12 rounded-xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-[#e5e0d8]">
          <h1 className="text-4xl font-serif text-[#241f21] mb-6 border-b-2 border-[#e5e0d8] pb-4">Therapy Services Offered</h1>
          <p className="text-lg text-gray-600 mb-10 leading-relaxed">
            Valentine Counseling offers compassionate, evidence-based therapy in a welcoming in-person environment in Saint George, Utah. Whether you are seeking individual support or guidance through relationship struggles, we are here to help.
          </p>
          
          <div className="space-y-6">
            <div className="bg-[#f9f8f6] p-8 rounded-xl border-l-4 border-[#ad8330]">
              <h2 className="text-2xl font-serif text-[#241f21] mb-2">Individual Therapy</h2>
              <p className="text-sm font-bold text-[#ad8330] uppercase tracking-wide mb-4">Ages: Teens and Adults</p>
              <p className="text-gray-700 leading-relaxed">Individual therapy provides a one-on-one environment where we can explore your unique challenges, history, and goals. We work collaboratively to address issues such as depression, anxiety, grief, and trauma. Sessions are tailored to your pace, focusing on equipping you with the tools necessary to foster self-awareness, emotional regulation, and lasting healing.</p>
            </div>

            <div className="bg-[#f9f8f6] p-8 rounded-xl border-l-4 border-[#ad8330]">
              <h2 className="text-2xl font-serif text-[#241f21] mb-4">Couples & Relationship Therapy</h2>
              <p className="text-gray-700 leading-relaxed">Relationships are complex and require maintenance. If you are experiencing communication breakdowns, intimacy issues, or navigating the painful process of divorce, couples counseling can provide a neutral, structured environment to rebuild trust or find closure. I help partners hear each other more clearly and develop healthier interaction patterns.</p>
            </div>

            <div className="bg-[#f9f8f6] p-8 rounded-xl border-l-4 border-[#ad8330]">
              <h2 className="text-2xl font-serif text-[#241f21] mb-4">Trauma & PTSD Support</h2>
              <p className="text-gray-700 leading-relaxed">Healing from past trauma, including childhood abuse or domestic violence, requires specialized care. I utilize trauma-informed approaches to help you process painful memories safely, reducing the impact of traumatic stress on your nervous system and your daily life.</p>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t-2 border-[#e5e0d8]">
            <h2 className="text-3xl font-serif text-[#241f21] mb-4">Financial Investment</h2>
            <div className="text-gray-700 leading-relaxed space-y-4">
              <p>Therapy is a valuable investment in your future and well-being. My standard rate is <strong className="text-[#365010] text-xl">$105 per individual session</strong>. I accept various payment methods, including Cash, Check, Mastercard, and Visa.</p>
              <p>I am also proudly in-network with a wide variety of major insurance providers to make care as accessible as possible. For a full list of accepted plans, please visit the <Link href="/insurance" className="text-[#ad8330] font-bold hover:underline transition-all">Insurance Page</Link>. If you are unsure about your coverage, I offer a free 15-minute phone consultation to discuss your needs and verify your benefits before we begin.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}