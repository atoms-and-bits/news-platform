import React from 'react';
import Link from 'next/link';

export default function TermsOfServicePage() {
  return (
    <div className="pb-16">
      <div className="bg-[#000137] text-white py-16 mb-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-white/70 text-lg">Last updated: March 2026</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-lg prose-indigo">
        <section className="mb-10">
          <h2 className="font-serif text-2xl font-bold text-[#000137] mb-4">1. Acceptance of Terms</h2>
          <p className="text-gray-700 leading-relaxed">
            By accessing and using Atoms & Bits (&quot;the Platform&quot;), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Platform.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="font-serif text-2xl font-bold text-[#000137] mb-4">2. User Accounts</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>You must provide accurate information when creating an account</li>
            <li>You are responsible for maintaining the security of your account credentials</li>
            <li>You must be at least 13 years old to create an account</li>
            <li>One person may not maintain more than one account</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="font-serif text-2xl font-bold text-[#000137] mb-4">3. Content</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            All articles, analysis, and editorial content on Atoms & Bits are the intellectual property of Atoms & Bits or its contributors. You may not reproduce, distribute, or republish our content without written permission.
          </p>
          <p className="text-gray-700 leading-relaxed">
            You may share links to articles freely. Brief quotations with attribution are permitted for commentary and review purposes.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="font-serif text-2xl font-bold text-[#000137] mb-4">4. Premium Subscriptions</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Premium subscriptions are billed monthly</li>
            <li>You may cancel your subscription at any time from your profile</li>
            <li>Refunds are handled on a case-by-case basis</li>
            <li>We reserve the right to change subscription pricing with advance notice</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="font-serif text-2xl font-bold text-[#000137] mb-4">5. Acceptable Use</h2>
          <p className="text-gray-700 leading-relaxed">You agree not to:</p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 mt-2">
            <li>Use the Platform for any unlawful purpose</li>
            <li>Attempt to gain unauthorized access to any part of the Platform</li>
            <li>Interfere with the proper functioning of the Platform</li>
            <li>Share your premium account credentials with others</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="font-serif text-2xl font-bold text-[#000137] mb-4">6. Termination</h2>
          <p className="text-gray-700 leading-relaxed">
            We may suspend or terminate your account if you violate these terms. You may delete your account at any time by contacting us.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="font-serif text-2xl font-bold text-[#000137] mb-4">7. Limitation of Liability</h2>
          <p className="text-gray-700 leading-relaxed">
            Atoms & Bits provides news and analysis for informational purposes. We are not liable for decisions made based on our content. The Platform is provided &quot;as is&quot; without warranties of any kind.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="font-serif text-2xl font-bold text-[#000137] mb-4">8. Changes to Terms</h2>
          <p className="text-gray-700 leading-relaxed">
            We may update these terms from time to time. Continued use of the Platform after changes constitutes acceptance of the updated terms.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="font-serif text-2xl font-bold text-[#000137] mb-4">9. Contact</h2>
          <p className="text-gray-700 leading-relaxed">
            Questions about these terms? Contact us at{' '}
            <a href="mailto:info@atomsandbits.co.tz" className="text-[#2f3192] hover:underline">
              info@atomsandbits.co.tz
            </a>{' '}
            or visit our{' '}
            <Link href="/contact" className="text-[#2f3192] hover:underline">
              Contact page
            </Link>.
          </p>
        </section>
      </div>
    </div>
  );
}
