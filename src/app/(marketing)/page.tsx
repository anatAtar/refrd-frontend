import Link from 'next/link';
import type { Metadata } from 'next';
import { MarketingHeader } from '@/components/marketing/MarketingHeader';
import { MarketingFooter } from '@/components/marketing/MarketingFooter';
import { FaqAccordion } from '@/components/marketing/FaqAccordion';
import { mkt } from './tokens';

const description =
  'Skip the black hole of job boards. DirectRef connects you directly with verified employees at top Israeli tech companies who can refer you internally.';

export const metadata: Metadata = {
  title: 'DirectRef — Get Referred by Verified Tech Insiders',
  description,
  alternates: { canonical: '/' },
  openGraph: {
    title: 'DirectRef — Get Referred by Verified Tech Insiders',
    description,
    url: '/',
    siteName: 'DirectRef',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DirectRef — Get Referred by Verified Tech Insiders',
    description,
  },
};

const seekerPoints = [
  'Get your resume directly to hiring managers without relying on job portals.',
  'Connect with employees inside target companies who can champion your profile.',
  'Get full visibility as your CV is delivered directly into the internal referral portal.',
];

const referrerPoints = [
  'Help qualified peers land roles at your company by vouching for talent you trust.',
  'Open doors for skilled professionals using your insider network.',
  'Earn referral bonuses when the people you refer get hired.',
];

const steps = [
  { num: '01', title: 'Find Your Job', desc: 'Spot an open role at a company you want to join and connect with an internal team member there.', accent: mkt.accentSeeker },
  { num: '02', title: 'Send Your CV', desc: 'Share your details securely with your referral partner, no cold applications required.', accent: mkt.accentSeeker },
  { num: '03', title: 'Guaranteed Delivery', desc: 'Receive confirmation as soon as your referral partner completes the internal submission. No black holes, no guessing.', accent: mkt.accentReferral },
];

// NOTE: placeholder sample only. In production this section should pull a
// rotating sample of real, currently-active listings from the jobs API
// instead of this fixed array.
const positions = [
  { title: 'Senior Frontend Engineer', company: 'Series C fintech · Tel Aviv', team: 'R&D', referrerCount: 3 },
  { title: 'Product Manager, Growth', company: 'Seed-stage SaaS · Ramat Gan', team: 'Product', referrerCount: 2 },
  { title: 'DevOps Engineer', company: 'Series B cybersecurity · Herzliya', team: 'R&D', referrerCount: 5 },
  { title: 'Marketing Lead', company: 'Series A dev-tools · Tel Aviv', team: 'Marketing', referrerCount: 1 },
];

const faqItems = [
  {
    q: "What's a referral, and why does it matter?",
    a: "A referral means someone already inside the company vouches to submit your CV internally. It usually moves your application past the résumé pile and straight to a recruiter's inbox.",
  },
  {
    q: 'Do I have to pay to use DirectRef?',
    a: "No. Every seeker gets one free application to submit. It's completely free while we're building out the platform. Pricing only kicks in later, and we'll be upfront when it does.",
  },
  {
    q: "What if I don't know anyone at the company?",
    a: "That's the whole point. You don't need to. Browse jobs and see who inside the company is willing to refer people like you, then reach out directly through DirectRef.",
  },
  {
    q: 'Is this only for tech roles?',
    a: "No, it depends on what our community brings to the platform. But we're starting with high-tech roles, since that's where our first community lives. More industries can follow.",
  },
  {
    q: 'What do referrers get out of it?',
    a: 'Referrers help people they believe in get a real shot, and most companies pay out a referral bonus when their referral gets hired. It’s a win for everyone involved.',
  },
];

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'DirectRef',
    url: 'https://direct-ref.com',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'DirectRef',
    url: 'https://direct-ref.com',
  },
];

export default function LandingPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <MarketingHeader variant="home" />

      {/* HERO */}
      <section className="max-w-[900px] mx-auto px-8 pt-24 pb-16 text-center">
        <h1 className="text-[56px] leading-[1.08] font-extrabold tracking-[-0.03em] mb-6 text-balance">
          Get referred from the inside.
        </h1>
        <p className="text-[19px] leading-relaxed mx-auto mb-10 max-w-[640px] text-balance" style={{ color: mkt.textSecondary }}>
          Skip the black hole of job boards and cold applications. Get your resume directly into the hands of hiring managers through verified insiders at top Israeli tech companies and startups.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-base font-semibold rounded-full"
            style={{ background: mkt.textPrimary, color: mkt.bg, padding: '15px 26px' }}
          >
            Join as Seeker →
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-base font-semibold rounded-full"
            style={{ background: 'transparent', color: mkt.textPrimary, border: `1.5px solid ${mkt.border}`, padding: '14px 26px' }}
          >
            Offer a Referral
          </Link>
        </div>
        <p className="mt-6 text-sm" style={{ color: mkt.textMuted }}>
          Get your CV directly onto the recruiter's desk via an internal team member.
        </p>
      </section>

      {/* AUDIENCE SPLIT */}
      <section id="audiences" className="max-w-[1120px] mx-auto px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            className="rounded-[20px] p-10 flex flex-col gap-5"
            style={{ background: mkt.cardBg, border: `1px solid ${mkt.border}`, borderTop: `3px solid ${mkt.accentSeeker}` }}
          >
            <span className="text-[13px] font-bold tracking-[0.04em] uppercase" style={{ color: mkt.accentSeeker }}>
              For Seekers
            </span>
            <h3 className="text-[26px] font-bold tracking-tight" style={{ color: mkt.textPrimary }}>
              Skip the portal. Get placed directly.
            </h3>
            <div className="flex flex-col gap-3">
              {seekerPoints.map((pt) => (
                <div key={pt} className="flex gap-3 items-start">
                  <span className="w-1.5 h-1.5 rounded-full mt-2.5 shrink-0" style={{ background: mkt.accentSeeker }} />
                  <p className="text-[15px] leading-relaxed" style={{ color: mkt.textSecondary }}>{pt}</p>
                </div>
              ))}
            </div>
            <Link
              href="/login"
              className="self-start mt-2 text-[15px] font-semibold rounded-full"
              style={{ background: mkt.accentSeeker, color: '#1a1206', padding: '12px 22px' }}
            >
              Browse jobs →
            </Link>
          </div>

          <div
            className="rounded-[20px] p-10 flex flex-col gap-5"
            style={{ background: mkt.cardBg, border: `1px solid ${mkt.border}`, borderTop: `3px solid ${mkt.accentReferral}` }}
          >
            <span className="text-[13px] font-bold tracking-[0.04em] uppercase" style={{ color: mkt.accentReferral }}>
              For Referrers
            </span>
            <h3 className="text-[26px] font-bold tracking-tight" style={{ color: mkt.textPrimary }}>
              Help someone you'd vouch for.
            </h3>
            <div className="flex flex-col gap-3">
              {referrerPoints.map((pt) => (
                <div key={pt} className="flex gap-3 items-start">
                  <span className="w-1.5 h-1.5 rounded-full mt-2.5 shrink-0" style={{ background: mkt.accentReferral }} />
                  <p className="text-[15px] leading-relaxed" style={{ color: mkt.textSecondary }}>{pt}</p>
                </div>
              ))}
            </div>
            <Link
              href="/login"
              className="self-start mt-2 text-[15px] font-semibold rounded-full"
              style={{ background: 'transparent', border: `1.5px solid ${mkt.accentReferral}`, color: mkt.textPrimary, padding: '11px 22px' }}
            >
              Post your job →
            </Link>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="max-w-[1120px] mx-auto px-8 py-16">
        <div className="text-center mb-14">
          <h2 className="text-[34px] font-bold tracking-tight mb-3">How it Works</h2>
          <p className="text-[17px]" style={{ color: mkt.textSecondary }}>Simple, transparent, and direct. Here is how your CV gets where it needs to go.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step) => (
            <div key={step.num} className="rounded-[20px] p-7" style={{ background: mkt.cardBg, border: `1px solid ${mkt.border}` }}>
              <div
                className="w-[38px] h-[38px] rounded-[10px] font-bold text-base flex items-center justify-center mb-5"
                style={{ background: step.accent, color: '#1a1206' }}
              >
                {step.num}
              </div>
              <h3 className="text-[17px] font-semibold mb-2" style={{ color: mkt.textPrimary }}>{step.title}</h3>
              <p className="text-[14.5px] leading-relaxed" style={{ color: mkt.textSecondary }}>{step.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-center text-sm mt-8" style={{ color: mkt.textMuted }}>
          DirectRef connects you with internal employees for direct job referrals. Get your CV delivered.
        </p>
      </section>

      {/* LIVE POSITIONS TEASER */}
      <section id="positions" className="max-w-[1120px] mx-auto px-8 py-16">
        <div className="flex items-baseline justify-between mb-8 flex-wrap gap-3">
          <div>
            <h2 className="text-[34px] font-bold tracking-tight mb-2">Roles with a way in, right now</h2>
            <p className="text-[17px]" style={{ color: mkt.textSecondary }}>A sample of what's live on DirectRef today.</p>
          </div>
          <Link href="/login" className="font-semibold text-[15px] whitespace-nowrap" style={{ color: mkt.accentReferral }}>
            Browse tech jobs →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {positions.map((pos) => (
            <div key={pos.title} className="rounded-[18px] p-6 flex flex-col gap-3.5" style={{ background: mkt.cardBg, border: `1px solid ${mkt.border}` }}>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold mb-1" style={{ color: mkt.textPrimary }}>{pos.title}</h3>
                  <p className="text-sm" style={{ color: mkt.textSecondary }}>{pos.company}</p>
                </div>
                <span
                  className="text-[12.5px] font-semibold px-2.5 py-1.5 rounded-full whitespace-nowrap"
                  style={{ color: mkt.textMuted, background: mkt.bg, border: `1px solid ${mkt.border}` }}
                >
                  {pos.team}
                </span>
              </div>
              <p className="text-sm font-semibold" style={{ color: mkt.accentSeeker }}>{pos.referrerCount} people inside can refer you</p>
              <Link
                href="/login"
                className="self-start text-sm font-semibold"
                style={{ color: mkt.textPrimary, borderBottom: `1.5px solid ${mkt.textPrimary}` }}
              >
                View position
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Q&A */}
      <section id="faq" className="max-w-[760px] mx-auto px-8 pt-16 pb-24">
        <h2 className="text-[34px] font-bold tracking-tight mb-10 text-center">Q&amp;A</h2>
        <FaqAccordion items={faqItems} />
      </section>

      <MarketingFooter />
    </>
  );
}
