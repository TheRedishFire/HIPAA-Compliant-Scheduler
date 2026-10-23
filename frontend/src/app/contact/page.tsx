import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";

export default function ContactPage() {
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
          <Link href="/faq" className="hover:text-[#ad8330] transition-colors">FAQ</Link>
          <Link href="/contact" className="text-[#ad8330] hover:text-[#ad8330] transition-colors">Contact</Link>
        </nav>
      </div>

      <header className="bg-[#241f21] w-full px-8 py-8 flex items-center justify-center text-white border-t border-white/10 shadow-sm">
        <Link href="/" className="text-center flex flex-col items-center">
          <span className="font-serif text-[2.5rem] leading-none tracking-wide">VALENTINE</span>
          <span className="font-sans text-[0.6rem] tracking-[0.25em] uppercase mt-1 opacity-90">Counseling</span>
        </Link>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-16">
        <div className="bg-white p-8 md:p-12 rounded-xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-[#e5e0d8] flex flex-col md:flex-row gap-12">
          
          <div className="w-full md:w-1/2">
            <h1 className="text-4xl font-serif text-[#241f21] mb-6 border-b-2 border-[#e5e0d8] pb-4">Get in Touch</h1>
            <p className="text-gray-700 leading-relaxed mb-8">
              Taking the first step toward healing takes courage. If you have questions about my practice, want to verify your insurance, or are ready to schedule your free 15-minute consultation, please reach out. I look forward to connecting with you.
            </p>
            
            <div className="bg-[#f9f8f6] p-8 rounded-xl border border-[#e5e0d8] space-y-8">
              <div>
                <h3 className="text-xl font-serif text-[#ad8330] flex items-center gap-2 mb-3">
                  <MapPin className="w-5 h-5" /> Office Location
                </h3>
                <p className="text-gray-700 ml-7 leading-relaxed">
                  <strong>Available In-Person</strong><br />
                  321 North Mall Dr, Suite F 202<br />
                  Saint George, UT 84790
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-serif text-[#ad8330] flex items-center gap-2 mb-3">
                  <Phone className="w-5 h-5" /> Direct Contact
                </h3>
                <div className="text-gray-700 ml-7 space-y-2">
                  <p><strong>Phone:</strong> <a href="tel:4356190326" className="hover:text-[#ad8330] transition-colors">(435) 619-0326</a></p>
                  <p><strong>Email:</strong> <a href="mailto:jillevalentine@gmail.com" className="hover:text-[#ad8330] transition-colors">jillevalentine@gmail.com</a></p>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full md:w-1/2 mt-8 md:mt-0">
            <h2 className="text-2xl font-serif text-[#241f21] mb-6">Send a Message</h2>
            <form className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
                <input type="text" id="name" name="name" required placeholder="Jane Doe" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ad8330] focus:border-transparent transition-all" />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
                <input type="email" id="email" name="email" required placeholder="jane@example.com" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ad8330] focus:border-transparent transition-all" />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-bold text-gray-700 mb-1">Phone Number</label>
                <input type="tel" id="phone" name="phone" placeholder="(555) 555-5555" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ad8330] focus:border-transparent transition-all" />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-bold text-gray-700 mb-1">How can I help you?</label>
                <textarea id="message" name="message" rows={5} required placeholder="Please provide a brief description of what you are seeking help with..." className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ad8330] focus:border-transparent transition-all resize-none"></textarea>
              </div>
              
              <button type="submit" className="w-full bg-[#ad8330] hover:bg-[#8e6b27] text-white font-bold py-3 px-6 rounded-lg transition-colors">
                Send Message
              </button>
              
              <p className="text-xs text-gray-500 italic mt-4 text-center">
                Please note: email is not a secure form of communication. Please do not include sensitive health information in this form.
              </p>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}