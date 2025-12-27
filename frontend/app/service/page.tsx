"use client";
import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function TermsOfService() {
    return (
        <div className="min-h-screen bg-white text-black dark:bg-black dark:text-white font-sans selection:bg-blue-100">
            {/* Header */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 px-6 py-4 flex justify-between items-center">
                <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <div className="rounded-lg flex items-center justify-center text-blue-600 text-2xl font-bold">R</div>
                    <span className="text-xl font-bold tracking-tight">ResuMail</span>
                </Link>
                <Link href="/" className="text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">
                    Back to Home
                </Link>
            </nav>

            <main className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
                <div className="space-y-4 mb-12">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Terms of Service</h1>
                    <p className="text-neutral-600 dark:text-neutral-400">Last Updated: December 27, 2025</p>
                </div>

                <div className="space-y-12 prose prose-neutral dark:prose-invert max-w-none">
                    <section>
                        <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
                        <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                            By accessing and using ResuMail, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use this service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">2. Description of Service</h2>
                        <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                            ResuMail provides AI-powered tools to generate personalized emails for job applications ("the Service"). We reserve the right to modify or discontinue the Service at any time without notice.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">3. User Accounts</h2>
                        <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                            You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">4. User Conduct</h2>
                        <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
                            You agree not to use the Service to:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-neutral-700 dark:text-neutral-300">
                            <li>Generate spam, fraudulent, or deceptive emails.</li>
                            <li>Harass, abuse, or harm another person.</li>
                            <li>Violate any applicable laws or regulations.</li>
                            <li>Upload or transmit viruses or any other type of malicious code.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">5. Intellectual Property</h2>
                        <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                            The Service and its original content (excluding content provided by users), features, and functionality are and will remain the exclusive property of ResuMail and its licensors. The Service is protected by copyright, trademark, and other laws.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">6. Disclaimer of Warranties</h2>
                        <div className="p-6 rounded-2xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed uppercase font-medium text-sm tracking-wide">
                                The Service is provided on an "AS IS" and "AS AVAILABLE" basis. ResuMail makes no representations or warranties of any kind, whether express or implied, about the completeness, accuracy, reliability, or suitability of the Service or the emails generated. <strong>We do not guarantee job interviews or employment offers.</strong>
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">7. Limitation of Liability</h2>
                        <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                            In no event shall ResuMail, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">8. Governing Law</h2>
                        <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                            These Terms shall be governed and construed in accordance with the laws, without regard to its conflict of law provisions.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">9. Contact Us</h2>
                        <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                            If you have any questions about these Terms, please contact us at:
                        </p>
                        <p className="mt-2 text-blue-600 font-medium">sid20rathi@gmail.com</p>
                    </section>
                </div>
            </main>

            <footer className="py-8 px-6 bg-neutral-50 dark:bg-neutral-900/50 border-t border-neutral-200 dark:border-neutral-800">
                <div className="max-w-4xl mx-auto text-center text-sm text-neutral-500">
                    <p>&copy; {new Date().getFullYear()} ResuMail Inc. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
