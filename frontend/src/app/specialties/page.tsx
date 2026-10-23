import Link from "next/link";
import { Phone, Mail } from "lucide-react";

export default function SpecialtiesPage() {
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
          <Link href="/specialties" className="text-[#ad8330] hover:text-[#ad8330] transition-colors">Specialties</Link>
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
          <h1 className="text-4xl font-serif text-[#241f21] mb-6 border-b-2 border-[#e5e0d8] pb-4">Areas of Clinical Expertise</h1>
          <p className="text-lg text-gray-600 mb-10 leading-relaxed">
            With over 26 years of clinical experience, I have dedicated my career to understanding and treating a wide spectrum of mental health challenges. Below are some of the primary areas in which I specialize.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#f9f8f6] p-8 rounded-xl border border-[#e5e0d8]">
              <h3 className="text-xl font-serif text-[#365010] mb-3">Mood & Anxiety Disorders</h3>
              <p className="text-gray-700 leading-relaxed text-sm">
                <strong>Depression & Anxiety:</strong> Feeling persistently sad, empty, or overwhelmingly worried can paralyze your ability to enjoy life. We will work together to uncover the root causes of these feelings, utilizing therapeutic techniques to challenge negative thought patterns and build resilience.
              </p>
            </div>

            <div className="bg-[#f9f8f6] p-8 rounded-xl border border-[#e5e0d8]">
              <h3 className="text-xl font-serif text-[#365010] mb-3">Trauma & Abuse</h3>
              <p className="text-gray-700 leading-relaxed text-sm">
                <strong>PTSD, Domestic Violence & Childhood Abuse:</strong> Trauma changes how the brain processes danger and safety. I specialize in helping survivors of domestic abuse, childhood trauma, and PTSD process their experiences. I also have deep experience working with Dissociative Disorders (DID).
              </p>
            </div>

            <div className="bg-[#f9f8f6] p-8 rounded-xl border border-[#e5e0d8]">
              <h3 className="text-xl font-serif text-[#365010] mb-3">Relationships & Family</h3>
              <p className="text-gray-700 leading-relaxed text-sm">
                <strong>Divorce, Parenting & Sex Therapy:</strong> Family systems are intricate. Whether you are navigating the turbulent waters of a divorce, struggling with parenting challenges, or seeking sex therapy to resolve intimacy issues, I offer empathetic guidance to help you establish healthy boundaries.
              </p>
            </div>

            <div className="bg-[#f9f8f6] p-8 rounded-xl border border-[#e5e0d8]">
              <h3 className="text-xl font-serif text-[#365010] mb-3">Life Transitions & Wellness</h3>
              <p className="text-gray-700 leading-relaxed text-sm">
                <strong>Grief, Spirituality, Eating Disorders & Coaching:</strong> Sometimes we just feel stuck. If you are experiencing profound grief from a loss, questioning your spirituality, battling an eating disorder, or simply needing the structured guidance of life coaching to reach your personal goals.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}