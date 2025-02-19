import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Rocket,
  Coffee,
  CheckCircle,
  Lock,
  Users,
  Zap,
  Calendar,
  ClipboardList,
  Key,
  Github,
  Twitter,
  CheckSquare,
  Clock,
  Flag,
  BarChart,
  MessageSquare,
  Settings,
  Code,
  Database,
  Shield,
  Sparkles,
  LineChart,
  Laptop,
  Smartphone,
  Globe,
  Cloud,
  Cpu,
  X,
  Layers,
  Infinity,
  DollarSign,
  Kanban,
  CircleSlash,
  Trello,
  FileText,
  Download,
  Building2,
} from 'lucide-react';
import Navbar from './partials/Navbar';
import Footer from "./partials/Footer";
import * as Config from '../../lib/config';

export default function LandingPage() {
  const [showEnterpriseModal, setShowEnterpriseModal] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900" id="home">
      <Navbar />

      {/* Hero Section */}
      <div className="pt-24 pb-16 bg-gradient-to-b from-primary-200 to-primary-100 dark:from-gray-900 dark:to-gray-950">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <div className="relative animate-float">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-accent-500 blur-2xl opacity-20 rounded-full"></div>
              <Rocket className="h-20 w-20 text-primary-600 dark:text-primary-400 relative animate-pulse-slow" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animated-gradient-text">
            Project Management,
            <br />
            <span className="text-2xl md:text-3xl">Simplified for Indie Developers</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed animate-slide-up">
            The lightweight alternative to complex project management tools.
            <br className="hidden md:block" />
            <span className="text-primary-600 dark:text-primary-400 font-semibold">Perfect for solo projects and small indie teams.</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link
              to="/signup"
              className="px-8 py-3 rounded-lg font-semibold bg-gradient-to-tr from-primary-500 to-accent-500 text-white hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl"
            >
              Start for Free
            </Link>
            <Link
              to="/login"
              className="px-8 py-3 rounded-lg font-semibold border-2 border-primary-600 dark:border-primary-400 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-24 bg-gradient-to-b from-primary-100 to-gray-50 dark:from-gray-950 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Everything You Need, Nothing You Don't
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="feature-card bg-gradient-to-br from-primary-100 to-accent-100 dark:from-gray-800 dark:to-gray-800">
              <div className="flex items-center mb-4">
                <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900">
                  <CheckSquare className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-xl font-semibold ml-3">Task Management</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Simple yet powerful task tracking with priorities, deadlines, and progress monitoring
              </p>
            </div>
            <div className="feature-card bg-gradient-to-br from-primary-100 to-accent-100 dark:from-gray-800 dark:to-gray-800">
              <div className="flex items-center mb-4">
                <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900">
                  <Flag className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-xl font-semibold ml-3">Milestones</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Track major project checkpoints and celebrate your progress along the way
              </p>
            </div>
            <div className="feature-card bg-gradient-to-br from-primary-100 to-accent-100 dark:from-gray-800 dark:to-gray-800">
              <div className="flex items-center mb-4">
                <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900">
                  <BarChart className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-xl font-semibold ml-3">Progress Tracking</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Visual progress indicators and statistics to keep you motivated
              </p>
            </div>
            <div className="feature-card bg-gradient-to-br from-primary-100 to-accent-100 dark:from-gray-800 dark:to-gray-800">
              <div className="flex items-center mb-4">
                <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900">
                  <Key className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-xl font-semibold ml-3">Secure Storage</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Safely store API keys, tokens, and other sensitive project information
              </p>
            </div>
            <div className="feature-card bg-gradient-to-br from-primary-100 to-accent-100 dark:from-gray-800 dark:to-gray-800">
              <div className="flex items-center mb-4">
                <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900">
                  <Download className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-xl font-semibold ml-3">Data Export</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Export your data anytime in CSV, JSON, or Markdown format
              </p>
            </div>
            <div className="feature-card bg-gradient-to-br from-primary-100 to-accent-100 dark:from-gray-800 dark:to-gray-800">
              <div className="flex items-center mb-4">
                <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900">
                  <Users className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-xl font-semibold ml-3">Team Collaboration</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Invite team members and collaborate on projects together
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tool Comparison Section */}
      <div id="comparison" className="py-24 bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm border-y border-gray-100 dark:border-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            The Right Tool for Small Projects
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-16 max-w-2xl mx-auto">
            Complex tools like JIRA and Trello are great for big teams, but for indie projects launching in 1-2 months, you need something simpler.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <Trello className="h-8 w-8 text-blue-500" />
                  <h3 className="text-xl font-semibold ml-2">Traditional Tools</h3>
                </div>
                <span className="text-sm text-gray-500">JIRA, Trello, etc.</span>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <X className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-gray-600 dark:text-gray-400">Complex setup and learning curve</span>
                </li>
                <li className="flex items-start">
                  <X className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-gray-600 dark:text-gray-400">Too many features for small projects</span>
                </li>
                <li className="flex items-start">
                  <X className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-gray-600 dark:text-gray-400">Expensive for small teams</span>
                </li>
                <li className="flex items-start">
                  <X className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-gray-600 dark:text-gray-400">Multiple views and configurations</span>
                </li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-primary-500 to-accent-500 p-8 rounded-xl shadow-lg transform md:scale-110 md:-translate-y-4">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <Rocket className="h-8 w-8 text-white" />
                  <h3 className="text-xl font-semibold ml-2 text-white">{Config.APP_NAME}</h3>
                </div>
                <span className="text-sm text-white/80">You are here</span>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-white mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-white">60-second setup, start immediately</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-white mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-white">Perfect feature set for indie projects</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-white mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-white">100% free, with data export included</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-white mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-white">Single, focused view for clarity</span>
                </li>
              </ul>
            </div>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <FileText className="h-8 w-8 text-gray-400" />
                  <h3 className="text-xl font-semibold ml-2">Basic Tools</h3>
                </div>
                <span className="text-sm text-gray-500">Notes, Spreadsheets</span>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <X className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-gray-600 dark:text-gray-400">No proper task management</span>
                </li>
                <li className="flex items-start">
                  <X className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-gray-600 dark:text-gray-400">No progress tracking</span>
                </li>
                <li className="flex items-start">
                  <X className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-gray-600 dark:text-gray-400">No milestone management</span>
                </li>
                <li className="flex items-start">
                  <X className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-gray-600 dark:text-gray-400">No team collaboration</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="py-24 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Why Choose {Config.APP_NAME}?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl bg-gradient-to-br from-primary-50 to-accent-50 dark:from-gray-800 dark:to-gray-800 hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-4">
                <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900">
                  <Zap className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-xl font-semibold ml-3">Quick Setup</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400">Start tracking your project in under 60 seconds. No complex configurations or lengthy onboarding.</p>
            </div>
            <div className="p-6 rounded-xl bg-gradient-to-br from-primary-50 to-accent-50 dark:from-gray-800 dark:to-gray-800 hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-4">
                <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900">
                  <Layers className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-xl font-semibold ml-3">Zero Complexity</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400">No boards, epics, or sprints. Just tasks, milestones, and progress tracking—everything you need, nothing you don't.</p>
            </div>
            <div className="p-6 rounded-xl bg-gradient-to-br from-primary-50 to-accent-50 dark:from-gray-800 dark:to-gray-800 hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-4">
                <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900">
                  <Coffee className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-xl font-semibold ml-3">Forever Free</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400">Built by indie developers, for indie developers. No pricing tiers, no hidden fees—just a free tool to help you succeed.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Badge Section */}
      {/*<div className="py-12 bg-white dark:bg-gray-900">*/}
      {/*  <div className="container mx-auto px-4">*/}
      {/*    <div className="max-w-4xl mx-auto text-center">*/}
      {/*      <div className="inline-block mb-6">*/}
      {/*        <Shield className="h-12 w-12 text-primary-600 dark:text-primary-400" />*/}
      {/*      </div>*/}
      {/*      <h2 className="text-3xl font-bold mb-4">Your Data, Your Control</h2>*/}
      {/*      <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">*/}
      {/*        We understand that your project data is critical. That's why we put you in control.*/}
      {/*      </p>*/}
      {/*      <div className="grid md:grid-cols-3 gap-8">*/}
      {/*        <div className="p-6 rounded-lg bg-gray-50 dark:bg-gray-800">*/}
      {/*          <Download className="h-8 w-8 text-primary-600 dark:text-primary-400 mb-4 mx-auto" />*/}
      {/*          <h3 className="text-lg font-semibold mb-2">Data Export</h3>*/}
      {/*          <p className="text-gray-600 dark:text-gray-400">*/}
      {/*            Export your data anytime in CSV, JSON, or Markdown format for backup or migration*/}
      {/*          </p>*/}
      {/*        </div>*/}
      {/*        <div className="p-6 rounded-lg bg-gray-50 dark:bg-gray-800">*/}
      {/*          <Lock className="h-8 w-8 text-primary-600 dark:text-primary-400 mb-4 mx-auto" />*/}
      {/*          <h3 className="text-lg font-semibold mb-2">Secure Storage</h3>*/}
      {/*          <p className="text-gray-600 dark:text-gray-400">*/}
      {/*            Your data is encrypted and stored securely using industry-standard practices*/}
      {/*          </p>*/}
      {/*        </div>*/}
      {/*        <div className="p-6 rounded-lg bg-gray-50 dark:bg-gray-800">*/}
      {/*          <Database className="h-8 w-8 text-primary-600 dark:text-primary-400 mb-4 mx-auto" />*/}
      {/*          <h3 className="text-lg font-semibold mb-2">Daily Backups</h3>*/}
      {/*          <p className="text-gray-600 dark:text-gray-400">*/}
      {/*            Automated daily backups ensure your project data is always safe*/}
      {/*          </p>*/}
      {/*        </div>*/}
      {/*      </div>*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*</div>*/}

      {/* Pricing Section */}
      <div className="py-24 bg-gradient-to-b from-gray-100 to-primary-100 dark:from-gray-900 dark:to-gray-950" id="pricing">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-16 max-w-2xl mx-auto">
            Choose the plan that works best for you. From indie developers to enterprise teams.
          </p>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 p-[2px]">
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 h-full">
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-2">Free Forever</h3>
                  <div className="text-4xl font-bold mb-6">$0</div>
                  <ul className="text-left space-y-4 mb-8">
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2"/>
                      <span>Unlimited projects</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2"/>
                      <span>All core features included</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2"/>
                      <span>Data export (CSV, JSON, Markdown)</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2"/>
                      <span>Community support</span>
                    </li>
                    <li className="flex items-center">
                      <CircleSlash className="h-5 w-5 text-red-500 mr-2"/>
                      <span>Service Level Agreement (SLA)</span>
                    </li>
                  </ul>
                  <Link
                      to="/signup"
                      className="block w-full py-3 px-6 rounded-lg bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors"
                  >
                    Get Started Now
                  </Link>
                </div>
              </div>
            </div>

            {/* Enterprise Plan */}
            <div className="rounded-2xl bg-gradient-to-br from-accent-500 to-primary-500 p-[2px]">
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 h-full">
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
                  <div className="text-4xl font-bold mb-6">Custom</div>
                  <ul className="text-left space-y-4 mb-8">
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      <span>Everything in Free plan</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      <span>Custom feature development</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      <span>Service Level Agreement (SLA)</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      <span>Priority support</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      <span>Custom data retention policies</span>
                    </li>
                  </ul>
                  <button
                    onClick={() => setShowEnterpriseModal(true)}
                    className="block w-full py-3 px-6 rounded-lg bg-accent-600 text-white font-semibold hover:bg-accent-700 transition-colors"
                  >
                    Contact Sales
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enterprise Modal */}
      {showEnterpriseModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <Building2 className="h-6 w-6 text-primary-600 dark:text-primary-400 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Enterprise Inquiry</h2>
              </div>
              <button
                onClick={() => setShowEnterpriseModal(false)}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">

              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Looking for custom features, SLA guarantees, or enterprise-grade support? Contact our sales team to discuss your needs.
              </p>
              <a
                href={`mailto:${Config.CONTACT_EMAIL}?subject=Enterprise%20Inquiry&body=I%27m%20interested%20in%20learning%20more%20about%20your%20enterprise%20offering.%0A%0ACompany%3A%0ATeam%20size%3A%0ARequirements%3A`}
                className="block w-full text-center py-3 px-6 rounded-lg bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors"
              >
                Contact Sales Team
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Buy Me a Coffee Section */}
      <div className="py-24 bg-gradient-to-b from-primary-100 to-gray-50 dark:from-gray-950 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-block animate-bounce mb-8">
              <Coffee className="h-12 w-12 text-primary-600 dark:text-primary-400" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Enjoying the Tool? Buy Me a Coffee! ☕️
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              This project is built with ❤️ and lots of caffeine. While it's completely free,
              if you find it useful, consider fueling my next coding session!
            </p>
            <a
              href="https://ko-fi.com/shahriarsiraj"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-8 py-4 rounded-full bg-[#FFDD00] hover:bg-[#FFDD00]/90 text-gray-900 font-bold text-lg transition-transform hover:scale-105 shadow-lg"
            >
              <Coffee className="h-6 w-6 mr-2" />
              Buy Me a Coffee
            </a>
            <p className="mt-6 text-sm text-gray-500 dark:text-gray-400 italic">
              Fun fact: This tool was built using approximately 47 cups of coffee ☕️
            </p>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-24 bg-gray-100 dark:bg-gray-800/50 backdrop-blur-sm border-y border-gray-100 dark:border-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Loved by Indie Developers
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">

            <div className="relative p-8 bg-gray-50 dark:bg-gray-800 rounded-xl hover:shadow-xl transition-all duration-300 group">
              <div className="absolute top-0 left-0 w-24 h-24 bg-primary-500/10 rounded-br-3xl -z-10 group-hover:scale-110 transition-transform"></div>
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-accent-500/10 rounded-tl-3xl -z-10 group-hover:scale-110 transition-transform"></div>

              <MessageSquare className="h-8 w-8 text-primary-500 mb-4" />
              <p className="text-gray-600 dark:text-gray-300 mb-6 italic">
                "Tried this yesterday and I’m already impressed. The setup was quick, and the UI is refreshingly simple. Excited to see where this goes!"
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    u/habiheat
                  </p>
                </div>
                <span className="text-xs text-center px-2 py-1 bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400 rounded-full">
            Smooth onboarding
          </span>
              </div>
            </div>

            <div className="relative p-8 bg-gray-50 dark:bg-gray-800 rounded-xl hover:shadow-xl transition-all duration-300 group">
              <div className="absolute top-0 left-0 w-24 h-24 bg-primary-500/10 rounded-br-3xl -z-10 group-hover:scale-110 transition-transform"></div>
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-accent-500/10 rounded-tl-3xl -z-10 group-hover:scale-110 transition-transform"></div>

              <MessageSquare className="h-8 w-8 text-primary-500 mb-4" />
              <p className="text-gray-600 dark:text-gray-300 mb-6 italic">
                "Saw this posted and gave it a shot. Only been using it for a few hours, but it already feels better than juggling Notion and Trello."
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    u/ForsakenDesk12
                  </p>
                </div>
                <span className="text-xs text-center px-2 py-1 bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400 rounded-full">
            No more tool overload
          </span>
              </div>
            </div>

            <div className="relative p-8 bg-gray-50 dark:bg-gray-800 rounded-xl hover:shadow-xl transition-all duration-300 group">
              <div className="absolute top-0 left-0 w-24 h-24 bg-primary-500/10 rounded-br-3xl -z-10 group-hover:scale-110 transition-transform"></div>
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-accent-500/10 rounded-tl-3xl -z-10 group-hover:scale-110 transition-transform"></div>

              <MessageSquare className="h-8 w-8 text-primary-500 mb-4" />
              <p className="text-gray-600 dark:text-gray-300 mb-6 italic">
                "Signed up out of curiosity. Super early days, but I love how lightweight it feels."
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    u/efstjas
                  </p>
                </div>
                <span className="text-xs text-center px-2 py-1 bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400 rounded-full">
            Fast & lightweight
          </span>
              </div>
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
