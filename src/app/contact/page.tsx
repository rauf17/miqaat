'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Mail, Code2 } from 'lucide-react';
import { AnimatedLogo } from '@/components/brand/animated-logo';
import { HeaderDropdown } from '@/components/layout/header-dropdown';

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <motion.main
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex-1 flex flex-col items-center justify-start p-4 pt-6 md:p-12 relative z-10"
      >
        <div className="w-full max-w-2xl mx-auto space-y-12">

          {/* Header Section */}
          <header className="flex items-center justify-between w-full pb-4">
            <AnimatedLogo />
            <HeaderDropdown />
          </header>

          <div className="text-center md:text-left">
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4 tracking-tight">Get in touch</h1>
            <p className="text-muted-foreground font-sans text-lg max-w-lg">
              Miqaat is built and maintained as an open-source project. If you have questions, feedback, or want to contribute, we&apos;d love to hear from you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            {/* Email */}
            <a
              href="mailto:connect2rauf17@gmail.com"
              className="group relative flex flex-col p-8 rounded-3xl border border-border/50 bg-card/40 backdrop-blur-md hover:border-primary/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 text-primary">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-heading font-bold mb-2">Email</h3>
              <p className="text-muted-foreground mb-4">Send us a direct message for support or general inquiries.</p>
              <span className="mt-auto text-primary font-medium flex items-center gap-1 group-hover:underline">
                connect2rauf17@gmail.com
              </span>
            </a>

            {/* GitHub */}
            <a
              href="https://github.com/rauf17/miqaat"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex flex-col p-8 rounded-3xl border border-border/50 bg-card/40 backdrop-blur-md hover:border-primary/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 text-primary">
                <Code2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-heading font-bold mb-2">GitHub</h3>
              <p className="text-muted-foreground mb-4">Report issues, suggest features, or contribute code.</p>
              <span className="mt-auto text-primary font-medium flex items-center gap-1 group-hover:underline">
                Open Repository
              </span>
            </a>
          </div>

        </div>
      </motion.main>
    </div>
  );
}
