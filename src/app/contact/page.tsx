import type { Metadata } from 'next';
import { ContactClient } from './contact-client';

export const metadata: Metadata = {
  title: 'Contact — Get in Touch',
  description:
    'Get in touch with the Miqaat team for questions, feedback, or contributions. Email or GitHub.',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact — Miqaat',
    description: 'Get in touch with the Miqaat team.',
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
