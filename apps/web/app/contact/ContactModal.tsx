/**
 * Contact Modal
 * Client component: Overlay form that composes a mailto link
 */
'use client';

import React, { useState } from 'react';
import { X, CheckCircle } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  subject: string;
}

export function ContactModal({ isOpen, onClose, subject }: ContactModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const body = `From: ${name} (${email})\n\n${message}`;  
    const mailtoUrl = `mailto:info@atomsandbits.co.tz?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
    setSubmitted(true);
  };

  const handleClose = () => {
    onClose();
    setName('');
    setEmail('');
    setMessage('');
    setSubmitted(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        {submitted ? (
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h2 className="font-serif text-2xl font-bold text-[#000137] mb-2">
              Thank you!
            </h2>
            <p className="text-gray-500 font-sans text-sm mb-6">
              Your email client should have opened with your me ssage. If it
              didn&apos;t, you can reach us directly at{' '}
              <a href="mailto:info@atomsandbits.co.tz" className="text-[#2f3192] underline">
                info@atomsandbits.co.tz
              </a>
            </p>
            <button
              onClick={handleClose}
              className="px-6 py-2.5 bg-[#000137] text-white font-bold text-sm font-sans rounded-lg hover:bg-[#2f3192] transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <h2 className="font-serif text-2xl font-bold text-[#000137] mb-1">
              {subject}
            </h2>
            <p className="text-gray-500 font-sans text-sm mb-6">
              Fill out the form below and we&apos;ll get back to you.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-sans font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#2f3192]/30 focus:border-[#2f3192]"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-sans font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#2f3192]/30 focus:border-[#2f3192]"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-sans font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#2f3192]/30 focus:border-[#2f3192] resize-none"
                  placeholder="Your message..."
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-[#000137] text-white font-bold text-sm font-sans rounded-lg hover:bg-[#2f3192] transition-colors"
              >
                Send Message
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
