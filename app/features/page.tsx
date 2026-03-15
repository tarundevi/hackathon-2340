'use client'

import {
  BellIcon,
  CalendarIcon,
  FileTextIcon,
  GlobeIcon,
  InputIcon,
} from "@radix-ui/react-icons";

import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";

const features = [
  {
    Icon: FileTextIcon,
    name: "Auto-Save Diagrams",
    description: "Your UML diagrams are automatically saved as you work in real-time.",
    href: "/",
    cta: "Learn more",
    background: (
      <div className="absolute inset-0 bg-gt-navy/10" />
    ),
    className: "lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3",
  },
  {
    Icon: InputIcon,
    name: "Diagram Search",
    description: "Search through all your diagram entities and relationships instantly.",
    href: "/",
    cta: "Learn more",
    background: (
      <div className="absolute inset-0 bg-blue-100" />
    ),
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
  },
  {
    Icon: GlobeIcon,
    name: "Real-Time Collaboration",
    description: "Work with your team on diagrams simultaneously with live updates.",
    href: "/",
    cta: "Learn more",
    background: (
      <div className="absolute inset-0 bg-emerald-100" />
    ),
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
  },
  {
    Icon: CalendarIcon,
    name: "Timeline & History",
    description: "Replay your diagram changes and track when modifications were made.",
    href: "/",
    cta: "Learn more",
    background: (
      <div className="absolute inset-0 bg-gray-100" />
    ),
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2",
  },
  {
    Icon: BellIcon,
    name: "Smart Validation",
    description:
      "Get AI-powered feedback on your UML diagrams to catch logical errors early.",
    href: "/",
    cta: "Learn more",
    background: (
      <div className="absolute inset-0 bg-orange-100" />
    ),
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4",
  },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-gt-navy mb-4 tracking-tight">
            🏛️ CS2340 UML Workspace
          </h1>
          <p className="text-lg text-gt-navy/60 font-medium max-w-2xl mx-auto">
            Powerful diagram collaboration tools built for Georgia Tech students
          </p>
        </div>

        {/* Bento Grid */}
        <BentoGrid className="lg:grid-rows-3">
          {features.map((feature) => (
            <BentoCard key={feature.name} {...feature} />
          ))}
        </BentoGrid>
      </div>
    </div>
  );
}
