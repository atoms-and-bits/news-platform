import React from 'react';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <div className="pb-16">
      <div className="bg-[#000137] text-white py-16 mb-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-white/70 text-lg">Last updated: March 2026</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-lg prose-indigo">
        <section className="mb-10">
          <h2 className="font-serif text-2xl font-bold text-[#000137] mb-4">1. Information We Collect</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            When you create an account, we collect your <strong>name</strong> and <strong>email address</strong>. If you sign in with Google, we receive your name, email, and profile picture from Google.
          </p>
          <p className="text-gray-700 leading-relaxed">
            If you subscribe to our premium plan, your payment is processed by our payment partner Snippe. We do not store your card details or mobile money information on our servers.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="font-serif text-2xl font-bold text-[#000137] mb-4">2. How We Use Your Information</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>To provide and maintain your account</li>
            <li>To deliver content you have access to (free or premium)</li>
            <li>To send transactional emails (account verification, password reset)</li>
            <li>To improve our platform and content</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mt-4">
            We do not sell your personal information to third parties.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="font-serif text-2xl font-bold text-[#000137] mb-4">3. Data Storage</h2>
          <p className="text-gray-700 leading-relaxed">
            Your data is stored securely using Supabase, which provides encrypted database hosting. Our application is hosted on Vercel. Both services maintain industry-standard security practices.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="font-serif text-2xl font-bold text-[#000137] mb-4">4. Cookies</h2>
          <p className="text-gray-700 leading-relaxed">
            We use essential cookies to maintain your authentication session. We do not use tracking cookies or third-party advertising cookies.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="font-serif text-2xl font-bold text-[#000137] mb-4">5. Your Rights</h2>
          <p className="text-gray-700 leading-relaxed">
            You may request to access, update, or delete your personal data at any time by contacting us at{' '}
            <a href="mailto:info@atomsandbits.co.tz" className="text-[#2f3192] hover:underline">
              info@atomsandbits.co.tz
            </a>.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="font-serif text-2xl font-bold text-[#000137] mb-4">6. Changes to This Policy</h2>
          <p className="text-gray-700 leading-relaxed">
            We may update this policy from time to time. Any changes will be posted on this page with an updated date.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="font-serif text-2xl font-bold text-[#000137] mb-4">7. Contact Us</h2>
          <p className="text-gray-700 leading-relaxed">
            If you have questions about this privacy policy, contact us at{' '}
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
