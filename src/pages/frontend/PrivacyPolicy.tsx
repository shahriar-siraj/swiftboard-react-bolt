import React from 'react';
import Navbar from './partials/Navbar';
import Footer from './partials/Footer';
import { Lock } from 'lucide-react';
import * as Config from '../../lib/config';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-8">
              <Lock className="h-12 w-12 text-primary-600 dark:text-primary-400" />
            </div>
            <h1 className="text-4xl font-bold text-center mb-8 text-gray-900 dark:text-white">
              Privacy Policy
            </h1>

            <div className="prose prose-lg dark:prose-invert max-w-none">
              {/*<p className="text-gray-600 dark:text-gray-400 mb-6">*/}
              {/*  Last updated: {new Date().toLocaleDateString()}*/}
              {/*</p>*/}

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                  1. Our Commitment to Your Data
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  At {Config.APP_DOMAIN_NAME}, we understand that your project data is critical to your business. We are committed to:
                </p>
                <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400">
                  <li>Providing complete data portability through our export features</li>
                  <li>Never locking your data into our platform</li>
                  <li>Maintaining daily backups of all project information</li>
                  <li>Being transparent about our data handling practices</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                  2. Information We Collect
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  We collect information that you provide directly to us, including:
                </p>
                <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400">
                  <li>Account information (name, email, password)</li>
                  <li>Project data and content you create</li>
                  <li>Communications with us</li>
                  <li>Technical usage data</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                  3. Data Security
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  We implement industry-standard security measures to protect your data:
                </p>
                <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400">
                  {/*<li>Encryption of all data in transit and at rest</li>*/}
                  <li>Regular security audits and penetration testing</li>
                  <li>Automated daily backups with redundancy</li>
                  <li>Strict access controls and authentication</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                  4. Data Portability & Export
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  We believe in giving you full control over your data:
                </p>
                <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400">
                  <li>Export your project data anytime in multiple formats (CSV, JSON, Markdown)</li>
                  <li>No artificial limits on data exports</li>
                  <li>Structured exports suitable for importing into other tools</li>
                  <li>Option to request a complete account data export</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                  5. Your Rights
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  You have the right to:
                </p>
                <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400">
                  <li>Access your personal information</li>
                  <li>Correct inaccurate data</li>
                  <li>Request deletion of your data</li>
                  <li>Object to our use of your data</li>
                  <li>Export your data at any time</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                  6. Data Retention
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  We retain your data for as long as your account is active. Upon account deletion, we will securely erase your data within 7 days. You can request an immediate data purge by contacting our support team.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                  7. Contact Us
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  If you have any questions about this Privacy Policy or our data practices, please contact us at{' '}
                  <a href={`mailto:${Config.CONTACT_EMAIL}`} className="text-primary-600 dark:text-primary-400 hover:underline">
                    {Config.CONTACT_EMAIL}
                  </a>.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
