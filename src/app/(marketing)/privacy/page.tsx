import { MarketingHeader } from '@/components/marketing/MarketingHeader';
import { MarketingFooter } from '@/components/marketing/MarketingFooter';
import { LegalLayout, LegalH2, LegalH3, LegalP, LegalUl, LegalLi, LegalStrong, LegalCallout } from '@/components/marketing/LegalLayout';
import { mkt } from '../tokens';

export const metadata = {
  title: 'Privacy Policy — DirectRef',
};

const toc = [
  { id: 's1', label: '1. Who we are' },
  { id: 's2', label: '2. What DirectRef does' },
  { id: 's3', label: '3. What we collect' },
  { id: 's4', label: "4. If you don't provide it" },
  { id: 's5', label: '5. Why & legal basis' },
  { id: 's6', label: '6. Who your data is shared with' },
  { id: 's7', label: '7. International transfers' },
  { id: 's8', label: '8. How long we keep it' },
  { id: 's9', label: '9. Cookies' },
  { id: 's10', label: '10. Security' },
  { id: 's11', label: '11. Your rights' },
  { id: 's12', label: '12. Automated decisions' },
  { id: 's13', label: '13. Children' },
  { id: 's14', label: '14. Data Protection Officer' },
  { id: 's15', label: '15. Changes to this policy' },
  { id: 's16', label: '16. Contact' },
];

const thClass = 'text-left py-2.5 px-3 text-[12px] uppercase tracking-[0.05em]';
const tdClass = 'py-2.5 px-3';
const trBorder = { borderBottom: `1px solid ${mkt.border}` };
const thStyle = { borderBottom: `2px solid ${mkt.accentSeeker}`, color: mkt.textPrimary };

export default function PrivacyPage() {
  return (
    <>
      <MarketingHeader variant="sub" />
      <LegalLayout title="Privacy Policy" effectiveDate="Effective [EFFECTIVE DATE] · Last updated [EFFECTIVE DATE]" toc={toc}>
        <LegalH2 id="s1">1. Who we are</LegalH2>
        <LegalP>DirectRef ("DirectRef", "we", "us", "our") is a cross-company referral marketplace operated by [ENTITY NAME], [ENTITY TYPE], registration number [COMPANY / BUSINESS REG. NO.], of [REGISTERED ADDRESS], Israel.</LegalP>
        <LegalP>We are the <LegalStrong>controller</LegalStrong> of the personal data described in this policy — meaning we decide why and how it is processed.</LegalP>
        <LegalP>Privacy contact: <LegalStrong>privacy@directref.com</LegalStrong><br />General support: <LegalStrong>support@directref.com</LegalStrong></LegalP>

        <LegalH2 id="s2">2. What DirectRef does, and why that matters for your data</LegalH2>
        <LegalP>DirectRef connects two kinds of people:</LegalP>
        <LegalUl>
          <LegalLi><LegalStrong>Seekers</LegalStrong> — people looking for a job, who send their CV to a specific person at a hiring company.</LegalLi>
          <LegalLi><LegalStrong>Referrers</LegalStrong> — people employed at a hiring company, who post an open role and decide whether to refer a seeker internally.</LegalLi>
        </LegalUl>
        <LegalCallout>
          <LegalStrong>When you apply to a role as a seeker, you are deliberately sending your CV, your cover note and your name to a named individual at another company.</LegalStrong> Once a referrer forwards it into their employer's hiring process, your CV is in that employer's hands and this policy no longer governs what they do with it.
        </LegalCallout>
        <LegalP>We tell you who that person is before you apply. You choose them. You are never matched to a referrer you did not see.</LegalP>
        <LegalP>The one exception is <LegalStrong>automatic rerouting</LegalStrong>: if your chosen referrer does not respond within two days and the listing has another referrer attached, we reassign your application to that second person so your application isn't wasted. We always notify you by name when this happens, and you can cancel for a refund of your credit.</LegalP>

        <LegalH2 id="s3">3. What we collect</LegalH2>
        <LegalH3>3.1 Information you give us</LegalH3>
        <div className="overflow-x-auto mb-5">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className={thClass} style={thStyle}>Data</th>
                <th className={thClass} style={thStyle}>When</th>
                <th className={thClass} style={thStyle}>Why we need it</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Name, email, password (hashed)', 'Sign-up', 'To create and secure your account'],
                ['Google account profile', 'Google sign-in', 'To authenticate you without a separate password'],
                ['LinkedIn profile / company details', 'Referrer sign-up', 'To check a referrer plausibly works where they say'],
                ['Employer name and job title', 'Referrer sign-up / posting', 'Shown publicly on listings'],
                ['Profile picture / avatar', 'Optional', 'Displayed on your profile'],
                ['Your CV file', 'First application', 'Sent to the referrer you choose — the core of the service'],
                ['Cover note', 'Each application', 'Sent to the referrer with your CV'],
                ['Messages you send', 'Messaging about an application', 'Delivered to the other party'],
                ['Job listing content', 'Referrer posts a role', 'Displayed publicly to seekers'],
                ['Profile preferences', 'Optional, Settings', 'Powers "Suggested for you" — a saved search, no ranking algorithm'],
                ['Saved jobs', 'When you save a role', 'Shown in your Saved tab'],
              ].map(([data, when, why], i, arr) => (
                <tr key={data} style={i < arr.length - 1 ? trBorder : undefined}>
                  <td className={`${tdClass} font-medium`} style={{ color: mkt.textPrimary }}>{data}</td>
                  <td className={tdClass} style={{ color: mkt.textSecondary }}>{when}</td>
                  <td className={tdClass} style={{ color: mkt.textSecondary }}>{why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <LegalH3>3.2 Information we generate</LegalH3>
        <LegalUl>
          <LegalLi><LegalStrong>Application records</LegalStrong> — which role, which referrer, when you applied, the decision, and the timestamps of every step in the response clock.</LegalLi>
          <LegalLi><LegalStrong>Credit balance and credit ledger</LegalStrong> — how many application credits you hold, and each grant, deduction, refund and expiry.</LegalLi>
          <LegalLi><LegalStrong>Referrer response rate</LegalStrong> — published on the referrer's public profile once they've handled a minimum number of CVs. Reflects whether they responded, not what they decided.</LegalLi>
          <LegalLi><LegalStrong>Notification records</LegalStrong> — what we sent you and whether you opened it.</LegalLi>
        </LegalUl>
        <LegalH3>3.3 Information collected automatically</LegalH3>
        <LegalUl>
          <LegalLi>IP address, browser and device type, operating system, and approximate location derived from IP.</LegalLi>
          <LegalLi>Access and security logs — sign-in attempts, timestamps, and pages requested.</LegalLi>
          <LegalLi>Product analytics events tied to your account — searches, job views, application starts, notification opens.</LegalLi>
          <LegalLi>Error and crash reports, which may incidentally include the URL you were on and your account identifier.</LegalLi>
          <LegalLi>Cookies and similar technologies — see §9.</LegalLi>
        </LegalUl>
        <LegalH3>3.4 What we do not collect</LegalH3>
        <LegalP>We do not ask for and do not want: your national ID number, bank details, payment card numbers, health information, biometric data, political or religious affiliation, or trade union membership.</LegalP>
        <LegalP>If you volunteer sensitive information inside your CV or a message, we process it because it is inside a document you chose to send, but we do not ask for it, do not index it, and do not use it for anything other than delivering it to the referrer you selected.</LegalP>

        <LegalH2 id="s4">4. What happens if you don't provide it</LegalH2>
        <LegalP>Israeli law requires us to tell you the consequences of declining to give us data. Plainly:</LegalP>
        <LegalUl>
          <LegalLi><LegalStrong>Email and password (or Google login):</LegalStrong> required. No account without them.</LegalLi>
          <LegalLi><LegalStrong>CV file:</LegalStrong> required to apply for a role. You can browse without one.</LegalLi>
          <LegalLi><LegalStrong>Employer and LinkedIn profile (referrers):</LegalStrong> required to post a role.</LegalLi>
          <LegalLi><LegalStrong>Profile preferences, avatar, saved jobs:</LegalStrong> entirely optional.</LegalLi>
          <LegalLi><LegalStrong>Analytics cookies:</LegalStrong> optional. Declining does not degrade the service.</LegalLi>
        </LegalUl>

        <LegalH2 id="s5">5. Why we process your data, and on what legal basis</LegalH2>
        <LegalP>We process data to run and secure your account, deliver applications to the referrer you chose, reroute timed-out applications, send transactional notifications, calculate response rates, manage credits, prevent fraud, improve the product, and meet legal/tax obligations — resting on your consent, contract performance, our legitimate interests, or a legal obligation, as applicable under Israeli law and GDPR where it applies.</LegalP>
        <LegalP>We do <LegalStrong>not</LegalStrong> sell your personal data. We do <LegalStrong>not</LegalStrong> share it with advertisers. We do <LegalStrong>not</LegalStrong> use your CV to train machine learning models. We are not a data broker.</LegalP>

        <LegalH2 id="s6">6. Who your data is shared with</LegalH2>
        <LegalH3>6.1 Other DirectRef users</LegalH3>
        <LegalUl>
          <LegalLi><LegalStrong>The referrer you choose</LegalStrong> receives your name, your CV file, your cover note, and any messages you send about that application. They can download your CV.</LegalLi>
          <LegalLi><LegalStrong>A backup referrer</LegalStrong> receives the same, but only if your first choice times out, and only after we tell you it happened.</LegalLi>
          <LegalLi><LegalStrong>A seeker who applies to your role</LegalStrong> sees your name, your employer, your job title, your public profile and your published response rate.</LegalLi>
          <LegalLi>Job listings are public to signed-in users and include the referrer's name and company.</LegalLi>
        </LegalUl>
        <LegalH3>6.2 Service providers who process data on our behalf</LegalH3>
        <LegalP>We use third parties to run the service, each bound by contract to process data only on our instructions:</LegalP>
        <div className="overflow-x-auto mb-5">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className={thClass} style={thStyle}>Provider</th>
                <th className={thClass} style={thStyle}>What it handles</th>
                <th className={thClass} style={thStyle}>Where</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Railway', 'Application hosting and the primary database', '[REGION]'],
                ['Vercel', 'Website and app front-end hosting', 'Global edge network'],
                ['Cloudflare (R2 + DNS)', 'CV file storage, DNS, network protection', '[REGION]'],
                ['Resend', 'Transactional email', 'US / EU'],
                ['Google', '"Sign in with Google" authentication', 'US'],
                ['Sentry', 'Error and crash reporting', 'US / EU'],
                ['PostHog', 'Product analytics and session replay', '[REGION — EU cloud recommended]'],
                ['[PAYMENT PROCESSOR]', 'Card payments for credit packs, once paid credits go live', 'Israel'],
                ['[INVOICING]', 'Receipts and invoices, once paid credits go live', 'Israel'],
              ].map(([provider, what, where], i, arr) => (
                <tr key={provider} style={i < arr.length - 1 ? trBorder : undefined}>
                  <td className={`${tdClass} font-medium`} style={{ color: mkt.textPrimary }}>{provider}</td>
                  <td className={tdClass} style={{ color: mkt.textSecondary }}>{what}</td>
                  <td className={tdClass} style={{ color: mkt.textSecondary }}>{where}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <LegalH3>6.3 Everyone else</LegalH3>
        <LegalP>We disclose personal data outside the above only where we are legally required to — a court order, a lawful demand from a competent authority, or to establish, exercise or defend a legal claim — or where strictly necessary to protect the safety or rights of a person.</LegalP>
        <LegalP>If DirectRef is ever acquired or merged, personal data may transfer to the acquirer. We will notify you beforehand and you will be able to delete your account first.</LegalP>

        <LegalH2 id="s7">7. International transfers</LegalH2>
        <LegalP>We are based in Israel. Several of our providers are in the United States and the European Union, so your data is transferred outside Israel.</LegalP>
        <LegalUl>
          <LegalLi>Israel benefits from a <LegalStrong>European Commission adequacy decision</LegalStrong>, so transfers from the EU to DirectRef in Israel are permitted without additional safeguards.</LegalLi>
          <LegalLi>For transfers to providers outside Israel and the EU, we rely on <LegalStrong>EU Standard Contractual Clauses</LegalStrong> or an equivalent adequacy finding.</LegalLi>
        </LegalUl>

        <LegalH2 id="s8">8. How long we keep it</LegalH2>
        <div className="overflow-x-auto mb-5">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className={thClass} style={thStyle}>Data</th>
                <th className={thClass} style={thStyle}>Retention</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['CV files and cover notes', '6 months after the related application closes, then deleted', true],
                ['Application records (CV stripped)', '6 months after close, then anonymised for statistics only', false],
                ['Messages tied to an application', '6 months after the application closes', false],
                ['Account profile, preferences, saved jobs', 'For as long as your account is open', false],
                ['Credit ledger', 'For as long as your account is open, then as required for accounting', false],
                ['Job listings', 'While active, plus 6 months after being closed or filled', false],
                ['Referrer response-rate inputs', 'Rolling window, retained while the account is open', false],
                ['Security and access logs', '12 months', false],
                ['Analytics events', '24 months, pseudonymised', false],
                ['Invoices, receipts, tax records', '7 years, as required by Israeli tax law — survives account deletion', false],
              ].map(([data, retention, bold], i, arr) => (
                <tr key={data as string} style={i < arr.length - 1 ? trBorder : undefined}>
                  <td className={tdClass} style={{ color: mkt.textPrimary, fontWeight: bold ? 600 : 500 }}>{data}</td>
                  <td className={tdClass} style={{ color: mkt.textSecondary }}>{retention}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <LegalP><LegalStrong>When you delete your account, we delete your personal data immediately</LegalStrong>, including every CV file you have uploaded. The only exceptions are the tax records above and anything under a legal hold. Backups are purged on their own rotation, within 30 days.</LegalP>
        <LegalP>Deleting your account does not retract a CV a referrer has already downloaded or forwarded to their employer. If you want a CV removed from a company's hiring process, you have to ask that company.</LegalP>

        <LegalH2 id="s9">9. Cookies</LegalH2>
        <LegalUl>
          <LegalLi><LegalStrong>Strictly necessary cookies</LegalStrong> — your authentication session and CSRF protection. No consent required, and you cannot turn them off while using the service.</LegalLi>
          <LegalLi><LegalStrong>Analytics cookies</LegalStrong> — PostHog, to understand product usage. These load only if you accept them in the cookie banner, and you can change your mind at any time from Settings.</LegalLi>
        </LegalUl>
        <LegalP>We do not use advertising or cross-site tracking cookies. We honour Global Privacy Control and Do Not Track signals for the analytics category.</LegalP>

        <LegalH2 id="s10">10. Security</LegalH2>
        <LegalUl>
          <LegalLi>All traffic is encrypted in transit with TLS.</LegalLi>
          <LegalLi>CV files are stored in object storage, not on the application server, and are served only through short-lived pre-signed links.</LegalLi>
          <LegalLi><LegalStrong>CV access is authorisation-checked on every request.</LegalStrong> Only the seeker who uploaded it and the referrer(s) currently assigned to that application can retrieve a CV.</LegalLi>
          <LegalLi>Passwords are stored hashed and salted. We never see your password.</LegalLi>
          <LegalLi>Access to production systems is limited to the founders and protected by multi-factor authentication.</LegalLi>
        </LegalUl>
        <LegalP>No system is perfectly secure, and we won't claim otherwise. If a breach occurs that is likely to harm you, we will notify you and the Privacy Protection Authority as required under Amendment 13 to the Privacy Protection Law, without undue delay.</LegalP>

        <LegalH2 id="s11">11. Your rights</LegalH2>
        <LegalP>You may:</LegalP>
        <LegalUl>
          <LegalLi><LegalStrong>Access</LegalStrong> the personal data we hold about you.</LegalLi>
          <LegalLi><LegalStrong>Correct</LegalStrong> it if it is wrong, incomplete or out of date. Most of it you can edit yourself in Settings.</LegalLi>
          <LegalLi><LegalStrong>Delete</LegalStrong> your account and your data, from Settings or by emailing privacy@directref.com.</LegalLi>
          <LegalLi><LegalStrong>Export</LegalStrong> a copy of your data in a portable format.</LegalLi>
          <LegalLi><LegalStrong>Object to or restrict</LegalStrong> processing based on legitimate interests.</LegalLi>
          <LegalLi><LegalStrong>Withdraw consent</LegalStrong> at any time, without affecting anything done before you withdrew it.</LegalLi>
          <LegalLi><LegalStrong>Opt out of marketing</LegalStrong> email in one click. You cannot opt out of transactional email.</LegalLi>
        </LegalUl>
        <LegalP>To exercise any of these, email <LegalStrong>privacy@directref.com</LegalStrong>. We will respond within <LegalStrong>30 days</LegalStrong>. We may ask you to confirm your identity first, so that we don't hand your CV to someone impersonating you.</LegalP>
        <LegalP><LegalStrong>Complaints.</LegalStrong> If you think we've handled your data badly, tell us first — we would rather fix it. You also have the right to complain to the <LegalStrong>Israeli Privacy Protection Authority</LegalStrong> (ppa.gov.il). If you are in the EU or UK, you may complain to your local supervisory authority.</LegalP>

        <LegalH2 id="s12">12. Automated decision-making</LegalH2>
        <LegalP>We do not make automated decisions that produce legal or similarly significant effects about you.</LegalP>
        <LegalP>Specifically: <LegalStrong>there is no matching algorithm, no compatibility score, and no ranking of candidates.</LegalStrong> "Suggested for you" is a saved search that runs the same filters you set yourself. Every decision about whether to refer you is made by a human being.</LegalP>
        <LegalP>The only automated actions in the system are the response-clock mechanics: a reminder on day 1, a notification and reroute on day 2, and an auto-cancel with a credit refund on day 5. These are published, fixed rules — not judgements about you.</LegalP>

        <LegalH2 id="s13">13. Children</LegalH2>
        <LegalP>DirectRef is for people aged <LegalStrong>18 and over</LegalStrong>. We do not knowingly collect data from anyone under 18. If we discover that we have, we delete the account and its data. If you believe a minor has an account, email privacy@directref.com.</LegalP>

        <LegalH2 id="s14">14. Data Protection Officer</LegalH2>
        <LegalP>Based on the volume and nature of the data we process, we are not currently required to appoint a Data Protection Officer under Amendment 13 to the Privacy Protection Law. Privacy questions are handled by [NAME] at privacy@directref.com.</LegalP>

        <LegalH2 id="s15">15. Changes to this policy</LegalH2>
        <LegalP>If we change this policy in a way that materially affects your rights or how we use your data, we will email you and show a notice in the app <LegalStrong>at least 14 days before it takes effect</LegalStrong>. Minor clarifications take effect on publication. The effective date at the top always tells you which version you're reading, and we keep previous versions available on request.</LegalP>

        <LegalH2 id="s16">16. Contact</LegalH2>
        <p className="text-[15px] leading-relaxed" style={{ color: mkt.textSecondary }}>[ENTITY NAME]</p>
        <p className="text-[15px] leading-relaxed mb-4" style={{ color: mkt.textSecondary }}>[REGISTERED ADDRESS], Israel</p>
        <LegalP>Privacy: <LegalStrong>privacy@directref.com</LegalStrong><br />Support: <LegalStrong>support@directref.com</LegalStrong></LegalP>
      </LegalLayout>
      <MarketingFooter />
    </>
  );
}
