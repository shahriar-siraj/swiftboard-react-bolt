import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import {
  HelpCircle,
  MessageSquare,
  Bug,
  Lightbulb,
  Mail,
  Send,
  AlertTriangle,
  Book,
  ArrowRight,
  ChevronDown,
  Loader2
} from 'lucide-react';
import { auth, db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import * as Config from '../lib/config';

type SupportType = 'general' | 'bug' | 'feature';

const faqs = [
  {
    question: "How do I create a new project?",
    answer: "Click the 'New Project' button in the sidebar or dashboard. Fill in the project details like name, description, and expected launch date. You can also choose to use our pre-launch template to get started quickly."
  },
  {
    question: "Can I invite team members to my project?",
    answer: "Yes! Open your project and click the 'Team' icon in the project header. Enter your team member's email to send them an invitation. They'll need to create an account if they don't have one already."
  },
  {
    question: "How do I track project progress?",
    answer: "Each project has a progress bar that automatically updates based on completed tasks. You can also view detailed statistics in the project dashboard, including task completion rate, time spent, and milestone progress."
  },
  {
    question: "What's the difference between tasks and milestones?",
    answer: "Tasks are smaller, actionable items that need to be completed. Milestones are major project checkpoints that usually encompass multiple tasks. Use milestones to track significant progress points in your project."
  },
  {
    question: "How do I archive a project?",
    answer: "Open the project you want to archive, click the three dots menu in the top right, and select 'Archive Project'. Archived projects can be viewed in the Archives section and can be restored at any time."
  }
];

export default function HelpSupport() {
  const user = auth.currentUser;
  const [supportType, setSupportType] = useState<SupportType>('general');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState<number | null>(null);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;

    setLoading(true);
    try {
      await addDoc(collection(db, 'support_tickets'), {
        userId: user.uid,
        userEmail: user.email,
        type: supportType,
        subject: subject.trim(),
        message: message.trim(),
        status: 'open',
        createdAt: new Date()
      });

      toast.success('Support ticket submitted successfully');
      setSubject('');
      setMessage('');
    } catch (error) {
      toast.error('Failed to submit support ticket');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white flex items-center mb-8">
        <HelpCircle className="h-6 w-6 mr-2 text-primary-500" />
        Help & Support
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* FAQ Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center mb-6">
            <Book className="h-5 w-5 mr-2 text-primary-500" />
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-200 dark:border-gray-700 last:border-0 pb-4 last:pb-0">
                <button
                  onClick={() => setSelectedFaq(selectedFaq === index ? null : index)}
                  className="w-full text-left"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      {faq.question}
                    </h3>
                    <ChevronDown
                      className={`h-5 w-5 text-gray-500 transition-transform ${
                        selectedFaq === index ? 'transform rotate-180' : ''
                      }`}
                    />
                  </div>
                </button>
                {selectedFaq === index && (
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    {faq.answer}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center mb-6">
            <MessageSquare className="h-5 w-5 mr-2 text-primary-500" />
            Contact Support
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Type of Support
              </label>
              <div className="grid grid-cols-3 gap-4">
                <button
                  type="button"
                  onClick={() => setSupportType('general')}
                  className={`p-3 text-sm font-medium rounded-lg flex flex-col items-center justify-center transition-colors ${
                    supportType === 'general'
                      ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/50 dark:text-primary-400'
                      : 'bg-gray-50 text-gray-700 dark:bg-gray-700/50 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <MessageSquare className="h-5 w-5 mb-1" />
                  General
                </button>
                <button
                  type="button"
                  onClick={() => setSupportType('bug')}
                  className={`p-3 text-sm font-medium rounded-lg flex flex-col items-center justify-center transition-colors ${
                    supportType === 'bug'
                      ? 'bg-red-50 text-red-700 dark:bg-red-900/50 dark:text-red-400'
                      : 'bg-gray-50 text-gray-700 dark:bg-gray-700/50 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Bug className="h-5 w-5 mb-1" />
                  Bug Report
                </button>
                <button
                  type="button"
                  onClick={() => setSupportType('feature')}
                  className={`p-3 text-sm font-medium rounded-lg flex flex-col items-center justify-center transition-colors ${
                    supportType === 'feature'
                      ? 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-400'
                      : 'bg-gray-50 text-gray-700 dark:bg-gray-700/50 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Lightbulb className="h-5 w-5 mb-1" />
                  Feature Request
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="block w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                placeholder="Enter a subject"
                required
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Message
              </label>
              <textarea
                id="message"
                rows={6}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="block w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
                placeholder={
                  supportType === 'bug'
                    ? "Please describe the bug, steps to reproduce, and expected behavior"
                    : supportType === 'feature'
                    ? "Please describe the feature you'd like to see and why it would be useful"
                    : "How can we help you?"
                }
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center px-4 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Support Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <Mail className="h-8 w-8 text-primary-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Email Support</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Get in touch with our support team directly via email for any questions or concerns.
          </p>
          <a
            href={"mailto:" + Config.CONTACT_EMAIL}
            className="inline-flex items-center text-primary-600 hover:text-primary-700"
          >
            {Config.CONTACT_EMAIL}
            <ArrowRight className="h-4 w-4 ml-1" />
          </a>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <AlertTriangle className="h-8 w-8 text-yellow-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Report an Issue</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Found a bug? Let us know and we'll fix it as soon as possible.
          </p>
          <button
            onClick={() => {
              setSupportType('bug');
              document.getElementById('subject')?.focus();
            }}
            className="inline-flex items-center text-yellow-600 hover:text-yellow-700"
          >
            Report Bug
            <ArrowRight className="h-4 w-4 ml-1" />
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <Lightbulb className="h-8 w-8 text-green-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Feature Requests</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Have an idea for a new feature? We'd love to hear it!
          </p>
          <button
            onClick={() => {
              setSupportType('feature');
              document.getElementById('subject')?.focus();
            }}
            className="inline-flex items-center text-green-600 hover:text-green-700"
          >
            Suggest Feature
            <ArrowRight className="h-4 w-4 ml-1" />
          </button>
        </div>
      </div>
    </div>

  );
}
