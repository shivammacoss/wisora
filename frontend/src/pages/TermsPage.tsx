import { LegalLayout, LegalSection } from '@shared/components/ui/LegalLayout';

/** Public terms of service. */
export default function TermsPage(): JSX.Element {
  return (
    <LegalLayout title="Terms of Service" updated="25 August 2026">
      <p className="leading-relaxed text-body">
        Welcome to Wisora. By creating an account or using the Wisora website or mobile application
        (the “Service”), you agree to these Terms of Service. Please read them carefully.
      </p>

      <LegalSection heading="1. The Service">
        <p>
          Wisora provides chapter-by-chapter reading summaries of sacred texts. The introduction and
          the first chapter of every book are free. Additional chapters can be unlocked for a
          one-time fee of ₹1 / $1 / €1 each (in your local currency), granting lifetime access to
          that chapter on your account.
        </p>
      </LegalSection>

      <LegalSection heading="2. Your account">
        <p>
          You are responsible for providing accurate information, keeping your password secure, and
          for all activity under your account. You may also browse as a guest without an account.
        </p>
      </LegalSection>

      <LegalSection heading="3. Payments">
        <p>
          Payments are processed securely by Razorpay and Stripe. Unlocking a chapter is a one-time
          purchase that grants lifetime access to that chapter. Because access is granted
          immediately, purchases are generally non-refundable except where required by law or the
          payment provider’s terms.
        </p>
      </LegalSection>

      <LegalSection heading="4. Acceptable use">
        <p>
          You agree not to misuse the Service — including copying, scraping, redistributing, or
          reselling its content, or attempting to disrupt or gain unauthorized access to the Service.
        </p>
      </LegalSection>

      <LegalSection heading="5. Content & intellectual property">
        <p>
          The original scriptures are presented respectfully for study. The summaries, translations,
          design, and software are the property of Wisora and are provided for your personal,
          non-commercial reading only.
        </p>
      </LegalSection>

      <LegalSection heading="6. Disclaimer">
        <p>
          Wisora’s content is provided for educational and spiritual reflection on an “as is” basis,
          without warranties of any kind. We do not guarantee the Service will be uninterrupted or
          error-free.
        </p>
      </LegalSection>

      <LegalSection heading="7. Changes">
        <p>
          We may update these Terms from time to time. Continued use of the Service after changes
          take effect constitutes acceptance of the updated Terms.
        </p>
      </LegalSection>

      <LegalSection heading="8. Contact">
        <p>
          Questions about these Terms? Email us at{' '}
          <a href="mailto:support@wisora.org" className="text-gold-deep hover:underline">
            support@wisora.org
          </a>
          .
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
