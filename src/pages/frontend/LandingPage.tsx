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
  Trello,
  FileText
} from 'lucide-react';
import Navbar from './partials/Navbar';
import Footer from "./partials/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900" id="home">
      <Navbar />

      {/* Hero Section */}
      <div className="pt-24 pb-16 bg-gradient-to-b from-primary-200 to-white dark:from-gray-900 dark:to-gray-950">
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

      {/* Why Choose Us Section */}
      <div className="py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Why Choose Indie SaaS Manager?
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

      {/* Tool Comparison Section */}
      <div className="py-24 bg-gray-50 dark:bg-gray-950" id="comparison">
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
                  <h3 className="text-xl font-semibold ml-2 text-white">Indie SaaS Manager</h3>
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
                  <span className="text-white">100% free, forever</span>
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

      {/* Features Section */}
      <div className="py-24 bg-gradient-to-b from-accent-50 to-primary-100 dark:from-gray-900 dark:to-gray-900" id="features">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Everything You Need, Nothing You Don't
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-xl bg-gray-50 dark:bg-gray-800 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center mb-4">
                  <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900">
                    <feature.icon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h3 className="text-xl font-semibold ml-3">{feature.title}</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Integration Section */}
      {/*<div className="py-24 bg-gray-50 dark:bg-gray-950">*/}
      {/*  <div className="container mx-auto px-4">*/}
      {/*    <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">*/}
      {/*      Seamless Integrations*/}
      {/*    </h2>*/}
      {/*    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">*/}
      {/*      {integrations.map((integration, index) => (*/}
      {/*        <div*/}
      {/*          key={index}*/}
      {/*          className="p-6 text-center hover:transform hover:scale-105 transition-transform"*/}
      {/*        >*/}
      {/*          <div className="inline-flex p-4 rounded-full bg-white dark:bg-gray-800 shadow-lg mb-4">*/}
      {/*            <integration.icon className="h-8 w-8 text-primary-600 dark:text-primary-400" />*/}
      {/*          </div>*/}
      {/*          <h3 className="font-semibold">{integration.name}</h3>*/}
      {/*        </div>*/}
      {/*      ))}*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*</div>*/}

      {/* Pricing Section */}
      <div className="py-24 bg-gradient-to-b from-primary-100 to-accent-50 dark:from-gray-900 dark:to-gray-900" id="pricing">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-16 max-w-2xl mx-auto">
            No hidden fees, no complicated tiers. Just one simple plan for indie developers.
          </p>
          <div className="max-w-md mx-auto">
            <div className="rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 p-[2px]">
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-8">
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-2">Free Forever</h3>
                  <div className="text-4xl font-bold mb-6">$0</div>
                  <ul className="text-left space-y-4 mb-8">
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      <span>Unlimited projects</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      <span>All features included</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      <span>Community support</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      <span>Regular updates</span>
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
          </div>
        </div>
      </div>

      {/* Buy Me a Coffee Section */}
      <div className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
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
      {/*<div className="py-24 bg-gray-50 dark:bg-gray-950">*/}
      {/*  <div className="container mx-auto px-4">*/}
      {/*    <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">*/}
      {/*      Loved by Indie Developers*/}
      {/*    </h2>*/}
      {/*    <div className="grid md:grid-cols-3 gap-8">*/}
      {/*      {testimonials.map((testimonial, index) => (*/}
      {/*        <div*/}
      {/*          key={index}*/}
      {/*          className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg"*/}
      {/*        >*/}
      {/*          <div className="flex items-center mb-4">*/}
      {/*            <img*/}
      {/*              src={testimonial.avatar}*/}
      {/*              alt={testimonial.name}*/}
      {/*              className="w-12 h-12 rounded-full"*/}
      {/*            />*/}
      {/*            <div className="ml-4">*/}
      {/*              <div className="font-semibold">{testimonial.name}</div>*/}
      {/*              <div className="text-sm text-gray-500">{testimonial.role}</div>*/}
      {/*            </div>*/}
      {/*          </div>*/}
      {/*          <p className="text-gray-600 dark:text-gray-400">"{testimonial.text}"</p>*/}
      {/*        </div>*/}
      {/*      ))}*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*</div>*/}

      {/* Footer */}
        <Footer />
    </div>
  );
}

const features = [
  {
    icon: Zap,
    title: 'Quick Task Entry',
    description: 'Add tasks with priority, type, and duration using simple shortcuts. No clicking through menus.',
  },
  {
    icon: CheckCircle,
    title: 'Launch Templates',
    description: 'Start with pre-built checklists designed specifically for indie SaaS launches.',
  },
  {
    icon: Key,
    title: 'API Key Management',
    description: 'Store your development and production API keys securely in one place.',
  },
  {
    icon: Users,
    title: 'Simple Sharing',
    description: 'Invite team members when needed, without complex permission systems.',
  },
  {
    icon: BarChart,
    title: 'Progress Tracking',
    description: 'See your launch progress at a glance with automatic progress calculation.',
  },
  {
    icon: Coffee,
    title: 'Distraction Free',
    description: 'Focus on building your product with a clean, minimal interface.',
  },
];

const testimonials = [
  {
    text: "Finally, a project management tool that doesn't slow me down. It's like it was built exactly for my workflow!",
    name: "Sarah Chen",
    role: "Indie Developer",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80"
  },
  {
    text: "The pre-launch templates saved me hours of planning. This is exactly what I needed for my SaaS projects.",
    name: "Alex Rivera",
    role: "SaaS Founder",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=100&h=100&q=80"
  },
  {
    text: "Clean, simple, and perfect for indie developers. The secure API key management is a game-changer.",
    name: "James Wilson",
    role: "Full Stack Developer",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&h=100&q=80"
  }
];

const integrations = [
  { icon: Github, name: 'GitHub' },
  { icon: Globe, name: 'Vercel' },
  { icon: Database, name: 'Supabase' },
  { icon: Cloud, name: 'AWS' },
  { icon: Shield, name: 'Auth0' },
  { icon: MessageSquare, name: 'Slack' },
  { icon: LineChart, name: 'Analytics' },
  { icon: Cpu, name: 'API' },
];
