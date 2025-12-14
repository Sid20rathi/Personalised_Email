"use client";
import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { IconMailAi, IconUserBolt, IconSettings, IconArrowRight, IconBrandGithub, IconBrandTwitter, IconBrandLinkedin } from "@tabler/icons-react";
import PixelBlast from "@/components/PixelBlast";
import { RippleButton } from "@/components/ui/ripple-button";
import { InteractiveGridPattern } from "@/components/ui/interactive-grid-pattern";

export default function LandingPage() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white text-black selection:bg-blue-100 dark:bg-black dark:text-white font-sans overflow-hidden">

    
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4 flex justify-between items-center",
          scrolled ? "bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800" : "bg-transparent"
        )}
      >
        <div className="flex items-center ">
          <div className=" rounded-lg flex items-center justify-center text-blue-600 text-3xl font-bold">R</div>
          <span className="text-xl font-bold tracking-tight">esuMail</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-600 dark:text-neutral-400">
          <Link href="#features" className="hover:text-black dark:hover:text-white transition-colors pl-24">Features</Link>
          <Link href="#how-it-works" className="hover:text-black dark:hover:text-white transition-colors">How it works</Link>

        </div>
        <div className="flex items-center gap-4">
          <Link href="/signin" className="hidden md:block text-sm font-medium hover:text-blue-600 transition-colors">Sign in</Link>
          <Link href="/signup">
            <button className="px-5 py-2 rounded-full bg-blue-600 text-white text-sm font-semibold hover:bg-blue-800 transition-all dark:bg-white dark:text-black dark:hover:bg-neutral-200">
              Get Started
            </button>
          </Link>
        </div>
      </nav>

     
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-32 pb-20 px-6">
      
        <div className="absolute inset-0 z-0">
          <PixelBlast
            variant="square"
            color="#3b82f6"
            pixelSize={5}
            transparent={true}
            className="opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white dark:via-black/50 dark:to-black pointer-events-none" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-blue-100 text-blue-600 text-xs font-bold tracking-wide mb-6 border border-blue-200 uppercase">
              AI-Powered Outreach
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] text-transparent bg-clip-text bg-gradient-to-b from-black to-neutral-500 dark:from-white dark:to-neutral-500">
              The Future of <br /> Personalized Email 
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed font-sans"
          >
            Generate personalized, resume-tailored emails for any job posting .<br></br> Stop writing generic Emails , Start getting replies.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-row sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link href="/signup">
              <div className="flex flex-row">
                <RippleButton rippleColor="#ffffff" className="h-12  px-12 text-lg flex text-white hover:animate-bounce bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-500/20 ">
                Register Now
              </RippleButton>
              </div>
            </Link>
            <Link href="#features">

            </Link>
          </motion.div>

          
          <motion.div
            style={{ y: y1, rotateX: 10 }}
            className="mt-20 relative w-full max-w-5xl aspect-[16/10] mx-auto rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm shadow-2xl overflow-hidden perspective-1000 group transform-style-3d"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none" />
           
            <div className=" h-[500px] flex items-center justify-center text-neutral-300">
              <img src="/dash.png" alt="" className=""/>
           
              <InteractiveGridPattern
                width={30}
                height={30}
                className="opacity-20 absolute inset-0 text-blue-500"
                squares={[40, 30]}
              />
            </div>
          </motion.div>
        </div>
      </section>

      
      <section id="features" className="py-32 px-6 bg-neutral-50 dark:bg-neutral-900 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">Built for speed and precision.</h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-400">Everything you need to automate your job application process without losing the personal touch.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<IconMailAi className="w-10 h-10 text-blue-500" />}
              title="Instant Personalization"
              description="Our AI analyzes the job description and your resume to craft the perfect email every time."
            />
            <FeatureCard
              icon={<IconUserBolt className="w-10 h-10 text-purple-500" />}
              title="Resume Parsing"
              description="Upload your resume once. We extract skills, experience, and achievements automatically."
            />
            <FeatureCard
              icon={<IconSettings className="w-10 h-10 text-emerald-500" />}
              title="Full Control"
              description="Edit, tweak, and regenerate emails until they sound exactly like you."
            />
          </div>
        </div>
        
        <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none">
          <InteractiveGridPattern width={60} height={60} squares={[30, 30]} className="text-black dark:text-white" />
        </div>
      </section>

    
      <section id="how-it-works" className="py-32 px-6 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-16">
            <div className="flex-1 space-y-12">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">How it works.</h2>
              <div className="space-y-8">
                <Step number="01" title="Upload Resume" description="Simply drag and drop your PDF resume. We'll handle the parsing." />
                <Step number="02" title="Paste Job URL" description="Found a job you like? Just copy the link and paste it into ResuMail." />
                <Step number="03" title="Generate & Send" description="Get a tailored email in seconds. Copy, send, and get hired." />
              </div>
            </div>
            <div className="flex-1 relative h-[500px] w-full bg-neutral-100 dark:bg-neutral-800 rounded-3xl overflow-hidden border border-neutral-200 dark:border-neutral-700 p-8 shadow-2xl">
              <div className="absolute inset-x-8 top-8 bottom-0 bg-white dark:bg-neutral-900 rounded-t-2xl shadow-[0_-20px_60px_-15px_rgba(0,0,0,0.1)] p-6 space-y-4">
                
                <div className="h-8 w-1/3 bg-neutral-100 dark:bg-neutral-800 rounded-md" />
                <div className="h-4 w-2/3 bg-neutral-100 dark:bg-neutral-800 rounded-md" />
                <div className="h-32 w-full bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-xl flex items-center justify-center">
                  <span className="text-blue-500 font-medium animate-pulse">Generating your email...</span>
                </div>
                <div className="space-y-2">
                  <div className="h-2 w-full bg-neutral-100 dark:bg-neutral-800 rounded" />
                  <div className="h-2 w-5/6 bg-neutral-100 dark:bg-neutral-800 rounded" />
                  <div className="h-2 w-4/6 bg-neutral-100 dark:bg-neutral-800 rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

     
      <section className="py-24 px-6 bg-black text-white relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <PixelBlast variant="circle" color="#ffffff" pixelSize={20} transparent={false} className="opacity-10" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold mb-8">Ready to supercharge your job search?</h2>
          <Link href="/signup">
            <button className="px-10 py-4 bg-white text-black rounded-full text-xl font-bold hover:scale-105 transition-transform duration-300">
              Get Started Now
            </button>
          </Link>
        </div>
      </section>

      <footer className="py-12 px-6 bg-neutral-950 text-neutral-400 border-t border-neutral-900">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-neutral-800 rounded flex items-center justify-center text-white text-xs">R</div>
            <span className="text-lg font-semibold text-neutral-200">ResuMail</span>
          </div>
          <div className="flex gap-8 text-sm">
            <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms</Link>
            <Link href="#" className="hover:text-white transition-colors">Twitter</Link>
            <Link href="#" className="hover:text-white transition-colors">GitHub</Link>
          </div>
          <div className="text-xs text-neutral-600">
            © 2024 ResuMail Inc. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-8 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 group">
      <div className="mb-6 p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900 inline-block group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 text-neutral-900 dark:text-neutral-100">{title}</h3>
      <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">{description}</p>
    </div>
  )
}

function Step({ number, title, description }: { number: string, title: string, description: string }) {
  return (
    <div className="flex gap-6 items-start">
      <span className="text-5xl font-black text-neutral-200 dark:text-neutral-800 font-mono leading-none">{number}</span>
      <div className="pt-2">
        <h4 className="text-xl font-bold mb-2">{title}</h4>
        <p className="text-neutral-600 dark:text-neutral-400">{description}</p>
      </div>
    </div>
  )
}
