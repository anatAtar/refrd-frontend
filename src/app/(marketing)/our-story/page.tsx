import type { Metadata } from 'next';
import Image from 'next/image';
import { MarketingHeader } from '@/components/marketing/MarketingHeader';
import { MarketingFooter } from '@/components/marketing/MarketingFooter';
import { mkt } from '../tokens';

const description =
  'Meet the founders of DirectRef and learn why we built a platform that connects job seekers directly with verified employees at top tech companies.';

export const metadata: Metadata = {
  title: 'Our Story — DirectRef',
  description,
  alternates: { canonical: '/our-story' },
  openGraph: {
    title: 'Our Story — DirectRef',
    description,
    url: '/our-story',
    siteName: 'DirectRef',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Our Story — DirectRef',
    description,
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Our Story — DirectRef',
  description,
  url: 'https://direct-ref.com/our-story',
};

const founders = [
  { name: 'Shai Atar', title: 'Co-Founder, DirectRef', linkedin: 'https://www.linkedin.com/in/shai-atar/', photo: '/founders/shai-atar.jpg' },
  { name: 'Anat Atar Lachmish', title: 'Co-Founder, DirectRef', linkedin: 'https://www.linkedin.com/in/anat-atar-lachmish-a07690b7/', photo: '/founders/anat-atar-lachmish.jpg' },
];

export default function OurStoryPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <MarketingHeader variant="sub" />

      <section className="max-w-[760px] mx-auto px-8 pt-16 pb-10">
        <h1 className="text-[44px] leading-[1.1] font-extrabold tracking-tight mb-8">Our Story</h1>
        <p className="text-[17px] leading-relaxed mb-6 text-balance" style={{ color: mkt.textSecondary }}>
          Hi! We're Anat and Shai, a married tech couple who found ourselves unexpectedly laid off in the summer of 2026 amid a massive shift in the Israeli tech market. Armed with technical know-how, extra time on our hands, and the shared anxiety of job hunting, we dove headfirst into applying for roles online. Like so many of you, we quickly realized how broken standard job boards can be — sending resumes into black holes, competing against thousands of applicants, and hoping a screening algorithm takes mercy on our CVs.
        </p>
        <p className="text-[17px] leading-relaxed text-balance" style={{ color: mkt.textSecondary }}>
          We knew there had to be a better way. In tech, direct employee referrals are universally known as the gold standard for hiring — employers love them, and employees get referral bonuses for bringing in great talent. Yet, the process of finding an insider to submit your CV was tedious and hit-or-miss. So, we built DirectRef to bridge that gap. We created a win-win platform where company insiders can publish open roles and job seekers can connect directly with them to tap into internal referral programs. Built by job hunters, for job hunters, DirectRef is our way of helping our community cut through the noise and get hired.
        </p>
      </section>

      <section className="max-w-[760px] mx-auto px-8 pt-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {founders.map((founder) => (
            <a
              key={founder.name}
              href={founder.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-[20px] p-7 flex flex-col items-center text-center gap-3.5"
              style={{ background: mkt.cardBg, border: `1px solid ${mkt.border}` }}
            >
              <Image
                src={founder.photo}
                alt={founder.name}
                width={96}
                height={96}
                className="w-24 h-24 rounded-full object-cover"
              />
              <div>
                <h3 className="text-[17px] font-bold mb-1" style={{ color: mkt.textPrimary }}>{founder.name}</h3>
                <p className="text-[13.5px] mb-2.5" style={{ color: mkt.textSecondary }}>{founder.title}</p>
                <span className="inline-flex items-center gap-1.5 text-[13.5px] font-semibold" style={{ color: mkt.accentReferral }}>
                  View on LinkedIn →
                </span>
              </div>
            </a>
          ))}
        </div>
      </section>

      <MarketingFooter />
    </>
  );
}
