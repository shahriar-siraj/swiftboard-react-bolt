import {Link} from "react-router-dom";
import {Github, Mail, Twitter} from "lucide-react";
import React from "react";
import * as Config from '../../../lib/config';

export default function Footer() {
    return (
        <footer className="bg-white dark:bg-gray-900 py-12">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-4 gap-8">
                    <div className="md:col-span-1">
                        <h3 className="font-bold text-lg mb-4">{Config.APP_DOMAIN_NAME}</h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            Built with ❤️ for indie developers.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Product</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link to="#features" className="text-gray-600 dark:text-gray-400 hover:text-primary-600">
                                    Features
                                </Link>
                            </li>
                            <li>
                                <Link to="#comparison" className="text-gray-600 dark:text-gray-400 hover:text-primary-600">
                                    Comparison
                                </Link>
                            </li>
                            <li>
                                <Link to="#pricing" className="text-gray-600 dark:text-gray-400 hover:text-primary-600">
                                    Pricing
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Useful Links</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/terms" className="text-gray-600 dark:text-gray-400 hover:text-primary-600">
                                    Terms & Conditions
                                </Link>
                            </li>
                            <li>
                                <Link to="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-primary-600">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <a
                                    href={`mailto:${Config.CONTACT_EMAIL}`}
                                    className="text-gray-600 dark:text-gray-400 hover:text-primary-600"
                                >
                                    Contact Us
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Connect</h4>
                        <div className="flex space-x-4">
                            <a
                                href="https://x.com/ShahriarTheDev"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-600 dark:text-gray-400 hover:text-primary-600"
                            >
                                <Twitter className="h-6 w-6"/>
                            </a>
                            <a
                                href="https://github.com/shahriar-siraj"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-600 dark:text-gray-400 hover:text-primary-600"
                            >
                                <Github className="h-6 w-6"/>
                            </a>
                            <a
                                href={"mailto:" + Config.CONTACT_EMAIL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-600 dark:text-gray-400 hover:text-primary-600"
                            >
                                <Mail className="h-6 w-6"/>
                            </a>
                        </div>
                    </div>
                </div>
                <div
                    className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-8 text-center text-gray-600 dark:text-gray-400">
                    <p>© {new Date().getFullYear()} <a href="/" className="text-primary-600 underline">{Config.APP_DOMAIN_NAME}</a>. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}