import { MarketingHeader } from '@/components/marketing/MarketingHeader';
import { MarketingFooter } from '@/components/marketing/MarketingFooter';
import { LegalLayout, LegalH2, LegalH3, LegalP, LegalUl, LegalLi, LegalStrong } from '@/components/marketing/LegalLayout';
import { mkt } from '../tokens';

export const metadata = {
  title: 'Terms of Service — DirectRef',
};

const toc = [
  { id: 'short', label: 'The short version' },
  { id: 's1', label: "1. Who you're contracting with" },
  { id: 's2', label: '2. Eligibility' },
  { id: 's3', label: "3. What DirectRef is — and isn't" },
  { id: 's4', label: '4. The core promise' },
  { id: 's5', label: '5. The response clock' },
  { id: 's6', label: '6. Credits' },
  { id: 's7', label: '7. Beta' },
  { id: 's8', label: '8. Obligations — seeker' },
  { id: 's9', label: '9. Obligations — referrer' },
  { id: 's10', label: '10. Response rate' },
  { id: 's11', label: '11. Prohibited conduct' },
  { id: 's12', label: '12. Your content' },
  { id: 's13', label: '13. Our content' },
  { id: 's14', label: '14. Third-party links' },
  { id: 's15', label: '15. Suspension & termination' },
  { id: 's16', label: '16. Disclaimer of warranties' },
  { id: 's17', label: '17. Limitation of liability' },
  { id: 's18', label: '18. Indemnity' },
  { id: 's19', label: '19. Changes to these Terms' },
  { id: 's20', label: '20. Governing law' },
  { id: 's21', label: '21. General' },
  { id: 's22', label: '22. Contact' },
];

const thClass = 'text-left py-2.5 px-3 text-[12px] uppercase tracking-[0.05em]';
const tdClass = 'py-2.5 px-3';

export default function TermsPage() {
  return (
    <>
      <MarketingHeader variant="sub" />
      <LegalLayout title="Terms of Service" effectiveDate="Effective [EFFECTIVE DATE] · Last updated [EFFECTIVE DATE]" toc={toc}>
        <LegalH2 id="short">The short version</LegalH2>
        <LegalP>This box is a summary, not the agreement. The numbered sections below are what actually binds us.</LegalP>
        <LegalUl>
          <LegalLi><LegalStrong>We guarantee the signal, not the outcome.</LegalStrong> DirectRef gets your CV in front of a real person and guarantees you find out what happened. It does not guarantee a referral, an interview, or a job.</LegalLi>
          <LegalLi><LegalStrong>Referrers are strangers.</LegalStrong> We check that they plausibly work where they say they work. We do not verify it deeply, we do not employ them, and we cannot control what they do.</LegalLi>
          <LegalLi><LegalStrong>You choose who sees your CV.</LegalStrong> Applying sends it to a named person, deliberately. Once they forward it to their employer, it's out of our hands.</LegalLi>
          <LegalLi><LegalStrong>A "Not a fit" is a real answer.</LegalStrong> You don't get your credit back for one. Refunds exist only for silence.</LegalLi>
          <LegalLi><LegalStrong>Credits are non-refundable in cash and non-transferable</LegalStrong>, and purchased credits expire after 12 months.</LegalLi>
          <LegalLi><LegalStrong>DirectRef is currently in free beta.</LegalStrong> Nothing costs money yet.</LegalLi>
        </LegalUl>

        <LegalH2 id="s1">1. Who you're contracting with</LegalH2>
        <LegalP>These Terms of Service (the "Terms") are an agreement between you and [ENTITY NAME], [ENTITY TYPE], registration number [COMPANY / BUSINESS REG. NO.], of [REGISTERED ADDRESS], Israel ("DirectRef", "we", "us").</LegalP>
        <LegalP>They govern your use of the DirectRef website, application and services (together, the "Service").</LegalP>
        <LegalP><LegalStrong>By creating an account or using the Service, you agree to these Terms.</LegalStrong> If you don't agree, don't use the Service.</LegalP>
        <LegalP>Our <a href="/privacy" style={{ color: mkt.accentSeeker, borderBottom: `1px solid ${mkt.accentSeeker}` }}>Privacy Policy</a> is part of these Terms.</LegalP>

        <LegalH2 id="s2">2. Eligibility</LegalH2>
        <LegalP>You must be <LegalStrong>at least 18 years old</LegalStrong> and legally able to enter a binding contract. You must provide accurate information and keep it current. One person, one account — you may not create an account for someone else, share your credentials, or let another person use your account.</LegalP>
        <LegalP>If you use the Service on behalf of an organisation, you confirm you are authorised to bind that organisation.</LegalP>

        <LegalH2 id="s3">3. What DirectRef is — and what it isn't</LegalH2>
        <LegalP>DirectRef is a <LegalStrong>platform</LegalStrong>. We connect seekers with individual employees ("referrers") at hiring companies. That's the whole of it.</LegalP>
        <LegalP><LegalStrong>DirectRef is not:</LegalStrong></LegalP>
        <LegalUl>
          <LegalLi>an employer, and does not offer employment;</LegalLi>
          <LegalLi>a recruitment agency, staffing agency, headhunter, or employment placement service, and does not act as agent for any employer or candidate;</LegalLi>
          <LegalLi>a party to any employment relationship, referral bounty, offer, or hiring decision that results from use of the Service.</LegalLi>
        </LegalUl>
        <LegalP>We do not participate in, influence, or take a fee from any hiring decision. Every hiring decision is made entirely by the employer, under its own process, on its own criteria.</LegalP>

        <LegalH2 id="s4">4. The core promise, stated precisely</LegalH2>
        <LegalP><LegalStrong>We guarantee the signal, not the outcome.</LegalStrong></LegalP>
        <LegalP>What we do guarantee, for every application you submit:</LegalP>
        <LegalUl>
          <LegalLi>Your CV is delivered to a specific, named referrer whom you selected before applying.</LegalLi>
          <LegalLi>That referrer is required to give a binary answer — "I'll refer this one" or "Not a fit."</LegalLi>
          <LegalLi>If they say they'll refer you, they must confirm with a separate tap once they have actually forwarded your CV, and you are notified.</LegalLi>
          <LegalLi>If they do nothing, an escalation runs on your behalf and ends with your credit refunded.</LegalLi>
        </LegalUl>
        <LegalP><LegalStrong>What we expressly do not guarantee:</LegalStrong></LegalP>
        <LegalUl>
          <LegalLi>that a referrer will refer you;</LegalLi>
          <LegalLi>that a referral will lead to a screening call, an interview, an offer, or a job;</LegalLi>
          <LegalLi>that an employer will look at, respond to, or acknowledge a forwarded CV;</LegalLi>
          <LegalLi>that a job listing is genuine, currently open, accurately described, or still funded;</LegalLi>
          <LegalLi>that a referrer actually works at the company they claim to;</LegalLi>
          <LegalLi>that a referrer who taps "I submitted it" genuinely did so.</LegalLi>
        </LegalUl>
        <LegalP><LegalStrong>No statement made by DirectRef — on the website, in an email, in marketing, or by a founder — constitutes a promise, guarantee or representation of employment.</LegalStrong></LegalP>

        <LegalH2 id="s5">5. The response clock</LegalH2>
        <LegalP>Every application runs on a fixed <LegalStrong>five-day</LegalStrong> clock:</LegalP>
        <div className="overflow-x-auto mb-5">
          <table className="w-full border-collapse text-[14.5px]">
            <thead>
              <tr>
                <th className={thClass} style={{ borderBottom: `2px solid ${mkt.accentSeeker}`, color: mkt.textPrimary }}>When</th>
                <th className={thClass} style={{ borderBottom: `2px solid ${mkt.accentSeeker}`, color: mkt.textPrimary }}>What happens</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={`${tdClass} font-semibold`} style={{ borderBottom: `1px solid ${mkt.border}`, color: mkt.textPrimary }}>Day 1</td>
                <td className={tdClass} style={{ borderBottom: `1px solid ${mkt.border}`, color: mkt.textSecondary }}>The referrer is reminded by email if they haven't acted.</td>
              </tr>
              <tr>
                <td className={`${tdClass} font-semibold`} style={{ borderBottom: `1px solid ${mkt.border}`, color: mkt.textPrimary }}>Day 2</td>
                <td className={tdClass} style={{ borderBottom: `1px solid ${mkt.border}`, color: mkt.textSecondary }}>You are told the referrer hasn't responded. If the listing has a backup referrer, your application is automatically reassigned to them, by name. The backup gets a fresh five-day clock.</td>
              </tr>
              <tr>
                <td className={`${tdClass} font-semibold`} style={{ color: mkt.textPrimary }}>Day 5</td>
                <td className={tdClass} style={{ color: mkt.textSecondary }}>The application auto-cancels and your credit is refunded.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <LegalP>Additionally:</LegalP>
        <LegalUl>
          <LegalLi><LegalStrong>Messaging pauses the clock.</LegalStrong> You may message the referrer at any point after applying. Sending a message pauses the auto-cancel timer, because we treat an active conversation as the system working, not failing.</LegalLi>
          <LegalLi><LegalStrong>A "Not a fit" closes the application and does not refund your credit.</LegalStrong> This is deliberate — it's the answer you paid to receive.</LegalLi>
          <LegalLi><LegalStrong>Auto-reroute is free.</LegalStrong> It's the same application reassigned, not a new one. You can cancel a rerouted application for a standard refund.</LegalLi>
          <LegalLi><LegalStrong>Only silence hurts a referrer's response rate.</LegalStrong> A "Not a fit" delivered in time counts exactly the same as a referral.</LegalLi>
        </LegalUl>
        <LegalP>We may adjust these intervals as the Service develops. If we do, we will tell you before the change applies to new applications, and applications already in flight keep the timings they started with.</LegalP>

        <LegalH2 id="s6">6. Credits</LegalH2>
        <LegalH3>6.1 The free tier</LegalH3>
        <LegalUl>
          <LegalLi>Every seeker account gets <LegalStrong>one application credit per calendar month</LegalStrong>.</LegalLi>
          <LegalLi>It resets to one at the start of each calendar month and <LegalStrong>does not roll over</LegalStrong>. Unused free credits are lost, not banked.</LegalLi>
          <LegalLi><LegalStrong>Buying credits does not change your free allowance.</LegalStrong> The free credit is separate and remains one per month regardless of how much you have purchased, forever.</LegalLi>
          <LegalLi><LegalStrong>Your free credit is spent first</LegalStrong>, before any purchased credit.</LegalLi>
        </LegalUl>
        <LegalH3>6.2 Purchased credits</LegalH3>
        <p className="text-sm italic mb-3" style={{ color: mkt.textMuted }}>These terms take effect when paid credit packs launch. During the free beta (§7), nothing is charged.</p>
        <LegalUl>
          <LegalLi>Credits are sold in <LegalStrong>one-time packs of 3, 5 or 10</LegalStrong>. This is not a subscription. Nothing renews, and nothing is charged again unless you buy again.</LegalLi>
          <LegalLi>Price and currency (ILS) are fixed at the moment of purchase. Later price changes do not affect credits you already hold.</LegalLi>
          <LegalLi><LegalStrong>Purchased credits expire 12 months after the date of purchase.</LegalStrong> We will notify you before they do. Expired credits are not restored and are not refunded.</LegalLi>
          <LegalLi><LegalStrong>Credits are non-refundable in cash.</LegalStrong> Once purchased, credits cannot be exchanged back into money, except where Israeli consumer protection law gives you a cancellation right — see §6.4.</LegalLi>
          <LegalLi><LegalStrong>Credits are personal and non-transferable.</LegalStrong> You may not sell, gift, trade, or move credits to another account, and you may not sell access to your account.</LegalLi>
          <LegalLi><LegalStrong>Credits have no cash value</LegalStrong> and are not stored value, a payment instrument, or a security.</LegalLi>
          <LegalLi>Refunded credits return to your general balance, untagged by origin.</LegalLi>
        </LegalUl>
        <LegalH3>6.3 Payment processing</LegalH3>
        <LegalP>Payments are handled by a third-party payment processor ([PROCESSOR NAME]). We do not receive, handle or store your full card number or other raw payment credentials. Credits are added to your balance once the processor confirms the payment; a failed or reversed payment means the credits are not granted or are removed.</LegalP>
        <LegalH3>6.4 Statutory cancellation rights</LegalH3>
        <LegalP>Nothing in these Terms limits any non-waivable right you have under the Israeli Consumer Protection Law, 5741-1981 — including, where it applies, the right to cancel a distance transaction within 14 days. Where a statutory cancellation right applies, it prevails over §6.2.</LegalP>
        <LegalH3>6.5 Chargebacks</LegalH3>
        <LegalP>If you initiate a chargeback instead of contacting us, we may suspend your account while it's resolved. Talk to us first at support@directref.com — it's faster.</LegalP>

        <LegalH2 id="s7">7. Beta</LegalH2>
        <LegalP><LegalStrong>DirectRef is currently in free beta.</LegalStrong> During the beta:</LegalP>
        <LegalUl>
          <LegalLi>The Service is provided free of charge. No credit packs are sold and no payments are taken.</LegalLi>
          <LegalLi>Features may change, break, or be removed without notice.</LegalLi>
          <LegalLi>There is no uptime commitment and no service level agreement.</LegalLi>
          <LegalLi>Data may be lost. Keep your own copy of your CV.</LegalLi>
          <LegalLi>We may contact you for feedback. You can decline.</LegalLi>
        </LegalUl>
        <LegalP>We will give you clear notice before paid credits go live, and you will never be charged without an explicit purchase.</LegalP>

        <LegalH2 id="s8">8. Your obligations as a seeker</LegalH2>
        <LegalUl>
          <LegalLi>Submit <LegalStrong>your own</LegalStrong> CV, describing your own experience, accurately. Submitting someone else's CV, or a fabricated one, is a material breach of these Terms.</LegalLi>
          <LegalLi>Apply to roles you genuinely want, and not use applications to farm refunds, test the system, or spam referrers.</LegalLi>
          <LegalLi>Treat referrers as the volunteers they largely are. They are under no obligation to refer you, and a decline is not a wrong done to you.</LegalLi>
          <LegalLi>Not use messaging to harass, pressure, abuse, or repeatedly contact a referrer who has answered you.</LegalLi>
          <LegalLi>Understand that once your CV reaches an employer, that employer's own privacy practices apply and we cannot retrieve it.</LegalLi>
        </LegalUl>

        <LegalH2 id="s9">9. Your obligations as a referrer</LegalH2>
        <LegalUl>
          <LegalLi>Actually work at the company whose roles you post, and describe your role there accurately.</LegalLi>
          <LegalLi>Post only <LegalStrong>genuine, currently open</LegalStrong> positions you have a real basis to believe exist.</LegalLi>
          <LegalLi><LegalStrong>Only tap "I submitted it" once you have genuinely forwarded the CV.</LegalStrong> Falsely confirming a submission is the most serious breach available on this platform, and we will terminate accounts for it.</LegalLi>
          <LegalLi>Give an honest binary decision within the clock, or accept that silence will show on your public response rate.</LegalLi>
          <LegalLi>Handle the CVs you receive lawfully — for the single, specific purpose of considering that person for the role they applied to.</LegalLi>
          <LegalLi>Comply with your <LegalStrong>own employer's</LegalStrong> policies on referrals, external tools, confidentiality and recruitment. That is entirely your responsibility, not ours.</LegalLi>
          <LegalLi>Post nothing that discriminates on grounds prohibited by the Equal Employment Opportunities Law, 5748-1988.</LegalLi>
        </LegalUl>
        <LegalP><LegalStrong>Referral bounties.</LegalStrong> If your employer pays you a bounty for a referral, that is strictly between you and your employer. DirectRef is not a party to it, takes no share of it, does not guarantee you'll receive it, and will not mediate any dispute about it.</LegalP>

        <LegalH2 id="s10">10. Response rate</LegalH2>
        <LegalP>If you act as a referrer, we calculate and <LegalStrong>publicly display</LegalStrong> the percentage of CVs you answered within the response window, once you have handled a minimum number of CVs. Below that minimum, nothing is shown.</LegalP>
        <LegalP>You agree to this being public. It is not a rating of your judgement — a "Not a fit" counts exactly as much as a referral. It measures one thing only: whether you answered.</LegalP>

        <LegalH2 id="s11">11. Prohibited conduct</LegalH2>
        <LegalP>You may not:</LegalP>
        <LegalUl>
          <LegalLi>impersonate any person, company, or employee, or misrepresent your affiliation with any of them;</LegalLi>
          <LegalLi>post fake, expired, duplicate or misleading listings, or listings for companies you don't work at;</LegalLi>
          <LegalLi>upload malware, or any file that isn't a genuine CV document;</LegalLi>
          <LegalLi>scrape, crawl, harvest, or bulk-extract listings, profiles, CVs, response rates, or any other data from the Service;</LegalLi>
          <LegalLi>use the Service to build a competing database, or to source candidates for anyone other than the role posted;</LegalLi>
          <LegalLi>resell, sublicense, or commercially exploit access to the Service;</LegalLi>
          <LegalLi>attempt to bypass credit limits, create multiple accounts, or manipulate the refund mechanic;</LegalLi>
          <LegalLi>probe, scan, or test the security of the Service, or circumvent any access control;</LegalLi>
          <LegalLi>send unsolicited commercial messages, recruiting pitches, or spam through messaging;</LegalLi>
          <LegalLi>harass, threaten, defame, or discriminate against any user;</LegalLi>
          <LegalLi>use the Service unlawfully or in violation of anyone's rights.</LegalLi>
        </LegalUl>
        <LegalP>We may investigate suspected breaches and take any action we consider appropriate, including removing content, suspending or terminating accounts, and reporting to the authorities.</LegalP>

        <LegalH2 id="s12">12. Your content</LegalH2>
        <LegalP>You keep ownership of everything you upload — your CV, your notes, your messages, your listings.</LegalP>
        <LegalP>You grant us a <LegalStrong>worldwide, non-exclusive, royalty-free licence</LegalStrong> to host, store, reproduce, transmit and display that content, solely for the purpose of operating the Service. This licence ends when you delete the content or your account, subject to the retention periods in the Privacy Policy.</LegalP>
        <LegalP>We do not use your CV to train machine learning models, do not license your content to third parties, and do not use it in marketing.</LegalP>
        <LegalP>You confirm you have the right to upload everything you upload, and that it doesn't infringe anyone's rights or breach any confidentiality obligation you owe.</LegalP>
        <LegalP><LegalStrong>We do not pre-screen content.</LegalStrong> We may remove anything that breaches these Terms, at our discretion, without notice.</LegalP>

        <LegalH2 id="s13">13. Our content</LegalH2>
        <LegalP>The Service, its software, design, branding and content are owned by us or our licensors and protected by intellectual property law. We grant you a limited, revocable, non-transferable, non-exclusive licence to use the Service as intended. You may not copy, modify, reverse-engineer, or create derivative works from it.</LegalP>
        <LegalP>"DirectRef" and our logo are our trademarks. Don't use them without written permission.</LegalP>

        <LegalH2 id="s14">14. Third-party links and job sources</LegalH2>
        <LegalP>Listings are created by pasting a URL from a company careers page, job board, or referral link, and the details are extracted automatically. That extraction can be wrong, incomplete, or out of date, and the underlying posting may have been filled or withdrawn. We do not verify listings, do not endorse any employer, and are not responsible for the content of any linked site.</LegalP>

        <LegalH2 id="s15">15. Suspension and termination</LegalH2>
        <LegalP><LegalStrong>You</LegalStrong> may delete your account at any time from Settings, or by emailing support@directref.com. Deleting your account forfeits any remaining credits, which are not refunded in cash.</LegalP>
        <LegalP><LegalStrong>We</LegalStrong> may suspend or terminate your account, with notice where practical and immediately where not, if you breach these Terms, if we reasonably suspect fraud or falsely confirmed submissions, if required by law, or if we discontinue the Service.</LegalP>
        <LegalP>If we terminate your account for a reason that isn't your breach, we will refund the purchase price of your unused, unexpired purchased credits. If we terminate you for breach, we won't.</LegalP>
        <LegalP>Sections 4, 12, 13, and 16 through 21 survive termination.</LegalP>

        <LegalH2 id="s16">16. Disclaimer of warranties</LegalH2>
        <LegalP><LegalStrong>The Service is provided "as is" and "as available", without warranty of any kind</LegalStrong>, express or implied, including any implied warranty of merchantability, fitness for a particular purpose, accuracy, or non-infringement.</LegalP>
        <LegalP>Without limiting that, we do not warrant that the Service will be uninterrupted, secure or error-free; that listings are genuine, accurate, current or lawful; that referrers are who they say they are or work where they say they work; that a referrer who confirms a submission actually made one; that any application will lead to a referral, interview or job; or that any data will not be lost.</LegalP>
        <LegalP><LegalStrong>We are a two-person platform connecting strangers. We check what we reasonably can, and we cannot verify the rest.</LegalStrong></LegalP>

        <LegalH2 id="s17">17. Limitation of liability</LegalH2>
        <LegalP>To the maximum extent permitted by law:</LegalP>
        <LegalP><LegalStrong>(a)</LegalStrong> We are not liable for indirect, incidental, special, consequential, punitive or exemplary damages, or for loss of profit, revenue, opportunity, data, goodwill, or any lost job opportunity, lost employment, lost salary, or lost referral bounty.</LegalP>
        <LegalP><LegalStrong>(b)</LegalStrong> Our total aggregate liability arising from or relating to the Service, in any twelve-month period, is capped at the greater of (i) the total amount you actually paid us in that period, or (ii) <LegalStrong>ILS 500</LegalStrong>. During the free beta, that cap is ILS 500.</LegalP>
        <LegalP><LegalStrong>(c)</LegalStrong> We are not liable for the acts or omissions of any user — a referrer who ghosts you, lies about submitting your CV, misuses your CV, or doesn't work where they claim; an employer that ignores a forwarded CV; or a seeker who submits a false CV.</LegalP>
        <LegalP><LegalStrong>(d)</LegalStrong> Nothing here excludes liability that cannot lawfully be excluded, including liability for fraud, wilful misconduct, or death or personal injury caused by negligence.</LegalP>

        <LegalH2 id="s18">18. Indemnity</LegalH2>
        <LegalP>You will indemnify and hold harmless DirectRef, its founders, employees and agents against any claim, liability, loss, damage, cost or expense (including reasonable legal fees) arising out of your use of the Service, your content, your breach of these Terms or of any law, or any dispute between you and another user or an employer.</LegalP>

        <LegalH2 id="s19">19. Changes to these Terms</LegalH2>
        <LegalP>We may update these Terms. If a change materially affects your rights or obligations, we will email you and show a notice in the app <LegalStrong>at least 14 days before it takes effect</LegalStrong>. If you don't accept it, delete your account before it takes effect — and if you have unused, unexpired purchased credits at that point, we will refund their purchase price.</LegalP>
        <LegalP>Changes to credit pricing never apply retroactively to credits you already hold.</LegalP>

        <LegalH2 id="s20">20. Governing law and jurisdiction</LegalH2>
        <LegalP>These Terms are governed by the <LegalStrong>laws of the State of Israel</LegalStrong>. The competent courts of [Tel Aviv–Jaffa], Israel have exclusive jurisdiction over any dispute, and you consent to that jurisdiction.</LegalP>
        <LegalP>If you are a consumer resident elsewhere, this does not deprive you of the protection of mandatory consumer law in your country of residence.</LegalP>

        <LegalH2 id="s21">21. General</LegalH2>
        <LegalUl>
          <LegalLi><LegalStrong>Entire agreement.</LegalStrong> These Terms and the Privacy Policy are the whole agreement between us about the Service.</LegalLi>
          <LegalLi><LegalStrong>Severability.</LegalStrong> If any provision is held unenforceable, the rest stays in force.</LegalLi>
          <LegalLi><LegalStrong>No waiver.</LegalStrong> If we don't enforce something immediately, we haven't given up the right to enforce it later.</LegalLi>
          <LegalLi><LegalStrong>Assignment.</LegalStrong> You may not assign these Terms. We may assign them to a successor in connection with a merger, acquisition or sale of assets.</LegalLi>
          <LegalLi><LegalStrong>No third-party beneficiaries.</LegalStrong> Nobody outside this agreement gains rights under it.</LegalLi>
          <LegalLi><LegalStrong>Force majeure.</LegalStrong> Neither party is liable for failure to perform due to events beyond its reasonable control.</LegalLi>
          <LegalLi><LegalStrong>Language.</LegalStrong> These Terms are written in English. If we publish a Hebrew translation and the two conflict, [CHOOSE: the English / the Hebrew] version prevails.</LegalLi>
          <LegalLi><LegalStrong>Notices.</LegalStrong> We'll reach you at the email on your account. Reach us at the addresses below.</LegalLi>
        </LegalUl>

        <LegalH2 id="s22">22. Contact</LegalH2>
        <p className="text-[15px] leading-relaxed" style={{ color: mkt.textSecondary }}>[ENTITY NAME]</p>
        <p className="text-[15px] leading-relaxed mb-4" style={{ color: mkt.textSecondary }}>[REGISTERED ADDRESS], Israel</p>
        <LegalP>Support: <LegalStrong>support@directref.com</LegalStrong><br />Privacy: <LegalStrong>privacy@directref.com</LegalStrong></LegalP>
      </LegalLayout>
      <MarketingFooter />
    </>
  );
}
