import Link from "next/link";
import { MapPin, Phone, Mail, CheckCircle2, ArrowRight } from "lucide-react";

export default function AboutPage() {
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
          <Link href="/about" className="text-[#ad8330] hover:text-[#ad8330] transition-colors">About</Link>
          <Link href="/services" className="hover:text-[#ad8330] transition-colors">Services</Link>
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
      
      <main className="max-w-[1200px] mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2">
            <div className="flex flex-col md:flex-row gap-8 mb-12">
              <div className="w-full md:w-2/5 shrink-0">
                <img 
                  src="/images/headshot.jpg" 
                  alt="Jill Valentine, LCSW" 
                  className="w-full h-auto rounded-2xl shadow-md object-cover"
                />
              </div>
              <div className="w-full md:w-3/5">
                <h1 className="text-4xl mb-2 text-[#241f21] font-serif">Jill Valentine, LCSW</h1>
                <p className="text-[#ad8330] font-bold tracking-wide text-sm uppercase mb-6">Verified by Psychology Today • 26 Years in Practice</p>
                <div className="space-y-4 text-lg leading-relaxed text-gray-700">
                  <p>
                    I truly believe that every individual has the innate ability to heal and to find inner peace. My job is to assist in helping individuals find the tools they already possess, and to provide support for this process. I'm open to providing significant direction or gentle nudgings, depending on what you're ready for. 
                  </p>
                  <p>
                    My ideal client is one that simply has the courage and desire to change. I work best with abuse issues, depression, anxiety, relationship issues, and grief. I have had experience working with individuals, couples, and adolescents, assisting them in dealing with a range of issues including post-traumatic stress/childhood abuse, sexual issues, and divorce.
                  </p>
                  <p>
                    I have found some clients were initially embarrassed or felt shame at some of the feelings they had. You will find me to be open and accepting to all feelings and thoughts from within. One of my strengths is the ability to be empathetic and see the positives in people.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-12">
              <h3 className="text-2xl mb-6 border-b border-[#e5e0d8] pb-4 font-serif">Top Specialties</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3"><CheckCircle2 className="text-[#365010] w-5 h-5" /> <span>Depression</span></div>
                <div className="flex items-center gap-3"><CheckCircle2 className="text-[#365010] w-5 h-5" /> <span>Trauma and PTSD</span></div>
                <div className="flex items-center gap-3"><CheckCircle2 className="text-[#365010] w-5 h-5" /> <span>Relationship Issues</span></div>
              </div>
            </div>
            <div className="mt-10">
              <h3 className="text-xl mb-4 font-serif">Areas of Expertise</h3>
              <div className="flex flex-wrap gap-2">
                {["Anxiety", "Dissociative Disorders (DID)", "Divorce", "Domestic Abuse", "Domestic Violence", "Eating Disorders", "Grief", "Life Coaching", "Parenting", "Sex Therapy", "Spirituality"].map((item) => (
                  <span key={item} className="bg-white border border-[#e5e0d8] text-sm px-4 py-2 rounded-full text-gray-600">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white p-8 rounded-xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-[#e5e0d8]">
              <h3 className="text-xl mb-6 font-serif border-b border-[#e5e0d8] pb-4">Practice at a Glance</h3>
              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#ad8330] shrink-0 mt-1" />
                  <div>
                    <p className="font-bold text-gray-900 mb-1">Available In-Person</p>
                    <p className="text-gray-600">321 North Mall Dr<br/>Suite F 202<br/>Saint George, UT 84790</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <Phone className="w-5 h-5 text-[#ad8330] shrink-0" />
                  <a href="tel:4356190326" className="font-bold hover:text-[#ad8330] transition-colors">(435) 619-0326</a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[#ad8330] shrink-0" />
                  <a href="mailto:jillevalentine@gmail.com" className="font-bold hover:text-[#ad8330] transition-colors break-all">jillevalentine@gmail.com</a>
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-[#e5e0d8]">
              <h3 className="text-xl mb-6 font-serif border-b border-[#e5e0d8] pb-4">Finances & Insurance</h3>
              <div className="mb-6">
                <p className="text-2xl font-serif text-[#365010] mb-1">$105</p>
                <p className="text-xs tracking-wider uppercase text-gray-500 font-bold">Per Individual Session</p>
                <p className="text-sm mt-3 text-gray-600"><strong>Payment Methods:</strong> Cash, Check, Mastercard, Visa</p>
              </div>
              <p className="font-bold text-sm mb-3 text-gray-900">Accepted Insurance Plans:</p>
              <ul className="text-sm text-gray-600 space-y-1.5 list-disc pl-4 mb-5">
                <li>Aetna</li>
                <li>BlueCross and BlueShield</li>
                <li>ComPsych</li>
                <li>First Health</li>
                <li>GEHA</li>
                <li>Humana</li>
                <li>MHNet Behavioral Health</li>
                <li>Optum</li>
                <li>SelectHealth</li>
                <li>United Medical Resources (UMR)</li>
              </ul>
              <Link 
                href="/insurance" 
                className="inline-flex items-center gap-2 text-[#ad8330] font-bold text-[0.9rem] hover:text-[#8e6b27] transition-colors group"
              >
                View All Accepted Insurance 
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-[#e5e0d8]">
              <h3 className="text-xl mb-4 font-serif border-b border-[#e5e0d8] pb-4 text-[#241f21]">Client Focus</h3>
              <ul className="text-sm space-y-2 text-gray-700">
                <li><strong className="text-gray-900">Age:</strong> Teens, Adults</li>
                <li><strong className="text-gray-900">Participants:</strong> Individuals</li>
                <li className="pt-4 mt-4 border-t border-[#e5e0d8]">
                  <strong className="text-gray-900">License:</strong> State of Utah / 131973-3501
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}