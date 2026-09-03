import { LegalLayout, LegalSection } from '@shared/components/ui/LegalLayout';

/** Public privacy policy (required for the Play Store & Google sign-in). */
export default function PrivacyPolicyPage(): JSX.Element {
  return (
    <LegalLayout title="Privacy Policy" updated="25 August 2026">
      <p className="leading-relaxed text-body">
        Wisora (“we”, “us”, “our”) operates the Wisora website and mobile application (the
        “Service”) — a platform for reading chapter-by-chapter summaries of sacred texts. This
        Privacy Policy explains what information we collect, how we use it, and the choices you have.
      </p>

      <LegalSection heading="1. Information we collect">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="text-ink">Account information:</strong> when you create an account we
            collect your name, email address, and a securely hashed password. If you use “Sign in
            with Google”, we receive your name, email address, and Google account identifier from
            Google.
          </li>
          <li>
            <strong className="text-ink">Reading activity:</strong> the chapters you unlock, your
            reading progress, and the books in your library.
          </li>
          <li>
            <strong className="text-ink">Payments:</strong> when you unlock a paid chapter, payment
            is processed by our payment partners (Razorpay and Stripe). We do not store your full
            card details — we keep only a transaction record (amount, currency, status, and a payment
            reference).
          </li>
          <li>
            <strong className="text-ink">Feedback:</strong> any feedback or messages you send us,
            along with your name and email, so we can reply.
          </li>
          <li>
            <strong className="text-ink">Technical data:</strong> basic device and usage information
            (such as app version and general interactions) needed to operate and improve the Service.
          </li>
          <li>
            <strong className="text-ink">Guest use:</strong> you can browse as a guest without an
            account; guest activity is stored only on your device and is not linked to a personal
            profile.
          </li>
        </ul>
      </LegalSection>

      <LegalSection heading="2. How we use your information">
        <ul className="list-disc space-y-2 pl-5">
          <li>To create and manage your account and sign you in.</li>
          <li>
            To provide the reading experience, remember your progress, and grant access to chapters
            you unlock.
          </li>
          <li>To process payments and give lifetime access to unlocked content.</li>
          <li>To respond to your feedback and support requests.</li>
          <li>To secure, maintain, and improve the Service.</li>
          <li>
            To send essential account emails (such as password-reset links). We do not send
            marketing emails without your consent.
          </li>
        </ul>
      </LegalSection>

      <LegalSection heading="3. How we share information">
        <p>
          We do not sell your personal information. We share it only with service providers who help
          us run Wisora, and only as needed:
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="text-ink">Google</strong> — for “Sign in with Google” authentication.
          </li>
          <li>
            <strong className="text-ink">Razorpay and Stripe</strong> — to process payments securely.
          </li>
          <li>
            <strong className="text-ink">MongoDB Atlas</strong> — to host our database.
          </li>
          <li>
            <strong className="text-ink">Our email provider</strong> — to deliver transactional
            emails.
          </li>
        </ul>
        <p>We may also disclose information where required to do so by law.</p>
      </LegalSection>

      <LegalSection heading="4. Data retention">
        <p>
          We keep your account information for as long as your account is active. You can ask us to
          delete your account and associated personal data at any time (see “Your rights”).
        </p>
      </LegalSection>

      <LegalSection heading="5. Security">
        <p>
          We protect your data with industry-standard measures: passwords are hashed, connections
          are encrypted over HTTPS, and access is restricted. No method of transmission or storage is
          100% secure, but we work hard to safeguard your information.
        </p>
      </LegalSection>

      <LegalSection heading="6. Your rights">
        <p>
          You may request access to, correction of, or deletion of your personal data by emailing us
          at{' '}
          <a href="mailto:support@wisora.org" className="text-gold-deep hover:underline">
            support@wisora.org
          </a>
          . You can also update your name from your profile and reset your password at any time.
        </p>
      </LegalSection>

      <LegalSection heading="7. Children’s privacy">
        <p>
          Wisora is not directed to children under 13, and we do not knowingly collect personal
          information from children under 13. If you believe a child has provided us personal data,
          contact us and we will delete it.
        </p>
      </LegalSection>

      <LegalSection heading="8. Changes to this policy">
        <p>
          We may update this Privacy Policy from time to time. We will revise the “Last updated” date
          above and, for significant changes, provide additional notice.
        </p>
      </LegalSection>

      <LegalSection heading="9. Contact us">
        <p>
          If you have any questions about this Privacy Policy or your data, email us at{' '}
          <a href="mailto:support@wisora.org" className="text-gold-deep hover:underline">
            support@wisora.org
          </a>
          .
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
