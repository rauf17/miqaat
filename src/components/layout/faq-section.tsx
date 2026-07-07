'use client';

import * as React from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CALCULATION_METHODS } from '@/lib/prayer/methods';
import { SITE } from '@/lib/site';
import hadithData from '@/data/hadith.json';
import versesData from '@/data/verses.json';

// MKT-008: derive the method list from the source of truth so the FAQ
// can never drift from the actual registry.
const methodNames = Object.values(CALCULATION_METHODS).map((m) => m.name).join(', ');
// MKT-007: derive the entry count so the "100 entries" claim can't drift.
const entryCount = (hadithData as unknown[]).length + (versesData as unknown[]).length;

const FAQS = [
  {
    question: 'How are prayer times calculated?',
    answer:
      `We use the adhan.js library, which implements precise solar position algorithms used by major Islamic organizations worldwide. You can choose from ${CALCULATION_METHODS && Object.keys(CALCULATION_METHODS).length} calculation methods (${methodNames}) depending on your region.`,
  },
  {
    question: 'Is my location data shared or stored on a server?',
    answer:
      'No. Your coordinates are stored only in your browser\u2019s localStorage. The only network request related to location is a one\u2011time reverse geocode call to display your city name \u2014 and even that is optional. We have no backend database and no user accounts.',
  },
  {
    question: 'What calculation methods do you support?',
    answer:
      `${methodNames}. Switch any time in Settings.`,
  },
  {
    question: 'Does this work offline?',
    answer:
      'Prayer times, Hijri calendar, and the Qibla compass work fully offline \u2014 they use mathematical algorithms running entirely in your browser. The weather widget and daily AI reflection require an internet connection.',
  },
  {
    question: 'Is this open source?',
    answer:
      `Yes, Miqaat is fully open source. You can inspect every line of code, verify our privacy claims, or contribute improvements at ${SITE.repoUrl}.`,
  },
  {
    question: 'Why isn\u2019t there a native mobile app?',
    answer:
      'Miqaat is a Progressive Web App (PWA) \u2014 install it to your home screen on any device and it behaves like a native app. One codebase serves every platform, and updates ship instantly without app store reviews.',
  },
  {
    question: 'How many verses and hadiths are in the daily reflection dataset?',
    answer:
      `The daily reflection draws from a curated dataset of ${entryCount} verified entries \u2014 Quranic verses and Sahih Hadith. Never AI\u2011generated scripture.`,
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 32 } as const,
  whileInView: { opacity: 1, y: 0 } as const,
  viewport: { once: true, margin: '-60px' } as const,
  transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] as const },
};

function FAQItem({ question, answer, id }: { question: string; answer: string; id: string }) {
  const [open, setOpen] = React.useState(false);
  // MKT-013: respect reduced motion
  const reduceMotion = useReducedMotion();
  const buttonId = `faq-button-${id}`;
  const panelId = `faq-panel-${id}`;

  return (
    <div className="border-b border-border/30">
      {/* MKT-009: wrap question in h3 so SR users can navigate by heading */}
      <h3>
        <button
          id={buttonId}
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between py-6 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
          aria-expanded={open}
          aria-controls={panelId}
        >
          <span className="text-lg font-heading font-medium text-foreground pr-8 group-hover:text-primary transition-colors">
            {question}
          </span>
          <ChevronDown
            className={cn(
              'w-5 h-5 shrink-0 text-muted-foreground transition-transform duration-300',
              open && 'rotate-180 text-primary'
            )}
            aria-hidden="true"
          />
        </button>
      </h3>
      <AnimatePresence>
        {open && (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={buttonId}
            initial={reduceMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-muted-foreground leading-relaxed max-w-2xl">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FaqSection({ id }: { id?: string }) {
  // PSP-021: FAQPage JSON-LD for rich results in Google Search.
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  };

  return (
    <section id={id} className="relative py-12 md:py-24 px-6 w-full">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="max-w-3xl mx-auto">
        <motion.div
          {...fadeUp}
          initial={useReducedMotion() ? false : fadeUp.initial}
          className="text-center mb-16"
        >
          <span className="inline-block text-xs font-bold uppercase tracking-[0.25em] text-primary mb-4">
            FAQ
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-foreground">
            Common questions
          </h2>
        </motion.div>

        <motion.div
          {...fadeUp}
          initial={useReducedMotion() ? false : fadeUp.initial}
          className="rounded-3xl bg-card/30 backdrop-blur-md border border-border/40 p-6 md:p-10"
        >
          {FAQS.map((faq, i) => (
            <FAQItem
              key={faq.question}
              question={faq.question}
              answer={faq.answer}
              id={`${i}`}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
