import React from 'react';
import Navbar from './partials/Navbar';
import Footer from './partials/Footer';
import { Shield } from 'lucide-react';
import * as Config from '../../lib/config';

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-8">
              <Shield className="h-12 w-12 text-primary-600 dark:text-primary-400" />
            </div>
            <h1 className="text-4xl font-bold text-center mb-8 text-gray-900 dark:text-white">
              Terms and Conditions
            </h1>

            <div className="prose prose-lg dark:prose-invert max-w-none">
              {/*<p className="text-gray-600 dark:text-gray-400 mb-6">*/}
              {/*  Last updated: {new Date().toLocaleDateString()}*/}
              {/*</p>*/}

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                  1. Our Commitment
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {Config.APP_DOMAIN_NAME} is committed to providing a reliable, secure, and user-focused project management platform. We understand the importance of your project data and take our responsibilities seriously.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                  2. Service Reliability
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  While we offer our core services for free, we maintain professional standards:
                </p>
                <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400">
                  <li>Regular backups of all project data</li>
                  <li>Industry-standard security practices</li>
                  <li>Transparent status updates for any service interruptions</li>
                  <li>Data export capabilities to prevent vendor lock-in</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                  3. Data Ownership & Export
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  You retain full ownership of your data. We provide:
                </p>
                <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400">
                  <li>Complete data export functionality in multiple formats</li>
                  <li>No artificial restrictions on data portability</li>
                  <li>Option to delete your account and data at any time</li>
                  <li>30-day notice for any significant service changes</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                  4. Service Continuity
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  We are committed to the long-term availability of our service:
                </p>
                <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400">
                  <li>Minimum 90-day notice before any service discontinuation</li>
                  <li>Assistance with data migration if needed</li>
                  <li>Enterprise customers receive additional guarantees via SLA</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                  5. Enterprise Services
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  For businesses requiring additional guarantees, we offer enterprise plans with:
                </p>
                <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400">
                  <li>Service Level Agreements (SLA)</li>
                  <li>Custom feature development</li>
                  <li>Priority support</li>
                  <li>Extended data retention policies</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                  6. Limitations
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  While we strive for excellence, our free service is provided "as is" without formal guarantees. For businesses requiring specific guarantees, please consider our enterprise offerings.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                  7. Contact
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  For any questions about these terms or to discuss enterprise requirements, please contact us at{' '}
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
