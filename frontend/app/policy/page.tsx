"use client";
import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-white text-black dark:bg-black dark:text-white font-sans selection:bg-blue-100">
            {/* Header */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 px-6 py-4 flex justify-between items-center">
                <Link href="/" className="flex items-center  hover:opacity-80 transition-opacity">
                    <div className="rounded-lg flex items-center justify-center text-blue-600 text-2xl font-bold">R</div>
                    <span className="text-xl font-bold tracking-tight">esuMail</span>
                </Link>
                <Link href="/" className="text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">
                    Back to Home
                </Link>
            </nav>

            <main className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
                <div className="space-y-4 mb-12">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Privacy Policy</h1>
                    <p className="text-neutral-600 dark:text-neutral-400">Last Updated: December 27, 2025</p>
                </div>

                <div className="space-y-12 prose prose-neutral dark:prose-invert max-w-none">
                    <section>
                        <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
                        <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                            Welcome to ResuMail. We respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information when you use our email generation service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">2. Information We Collect</h2>
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Account Information</h3>
                                <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                                    When you sign up, we collect your name and email address to create and manage your account.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Google User Data</h3>
                                <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                                    If you choose to connect your Gmail account, we access:
                                </p>
                                <ul className="list-disc pl-6 mt-2 space-y-2 text-neutral-700 dark:text-neutral-300">
                                    <li>Your email address (to identify you).</li>
                                    <li>The ability to compose and modify drafts on your behalf.</li>
                                </ul>
                                <p className="mt-2 text-neutral-700 dark:text-neutral-300 leading-relaxed">
                                    We <strong>do not</strong> read your existing emails unless you explicitly provide them for context (for example, when replying to a specific email thread).
                                </p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">3. How We Use Your Information</h2>
                        <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
                            We use your information solely to:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-neutral-700 dark:text-neutral-300">
                            <li>Provide, maintain, and improve the ResuMail service.</li>
                            <li>Generate personalized email drafts based on your resume and provided job descriptions.</li>
                            <li>Authenticate your identity and prevent fraud.</li>
                        </ul>
                    </section>

                    <div className="p-6 rounded-2xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30">
                        <h2 className="text-2xl font-bold mb-4 text-blue-800 dark:text-blue-300">4. Google API Services User Data Policy</h2>
                        <p className="text-blue-900 dark:text-blue-100 leading-relaxed mb-4">
                            ResuMail's use and transfer to any other app of information received from Google APIs will adhere to the <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-600">Google API Services User Data Policy</a>, including the Limited Use requirements.
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-blue-900 dark:text-blue-100">
                            <li>We do not use Google Workspace data for training generalized AI models.</li>
                            <li>We do not share, sell, or transfer Google user data to third parties for advertising purposes.</li>
                            <li>We only transfer data to third parties if necessary to provide or improve our user-facing features, to comply with applicable law, or as part of a merger, acquisition, or sale of assets.</li>
                        </ul>
                    </div>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">5. Data Security</h2>
                        <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                            We implement industry-standard security measures to protect your data. Your data is encrypted in transit using SSL/TLS protocols and stored securely. We regularly review our information collection, storage, and processing practices to prevent unauthorized access.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">6. Sharing Your Information</h2>
                        <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                            We do not sell your personal data. We may share your information with trusted third-party service providers (such as cloud hosting providers) only as necessary to operate our service. These providers are bound by strict confidentiality obligations.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">7. Contact Us</h2>
                        <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                            If you have any questions about this Privacy Policy or our data practices, please contact us at:
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
