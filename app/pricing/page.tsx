"use client";

import Navbar from "@/components/header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const pricingPlans = [
  {
    name: "Basic",
    price: "GH₵ 99/month",
    features: [
      "Limited property listings",
      "Basic search functionality",
      "Contact agents",
    ],
    cta: "Sign Up for Free",
    ctaVariant: "outline",
  },
  {
    name: "Pro",
    price: "GH₵ 375/month",
    features: [
      "Unlimited property listings",
      "Advanced search filters",
      "Featured property placements",
      "Analytics dashboard",
      "Priority support",
    ],
    cta: "Get Started",
    ctaVariant: "default",
  },
  {
    name: "Premium",
    price: "GH₵ 2,000/6 months",
    features: [
      "All Pro features",
      "Dedicated account manager",
      "Exclusive market insights",
      "Lead generation tools",
      "Custom reporting",
    ],
    cta: "Contact Us",
    ctaVariant: "ghost",
  },
];

// Dummy FAQ data - replace with your actual pricing FAQs
const pricingFAQs = [
  {
    question: "What payment methods do you accept in Ghana?",
    answer:
      "We currently accept Mobile Money (MTN Mobile Money, Vodafone Cash, AirtelTigo Money), bank transfers, and credit/debit cards for our paid plans.",
  },
  {
    question: "Is there a discount for annual subscriptions?",
    answer:
      "Yes, we offer a 15% discount on all annual subscriptions. Please select the annual billing cycle during signup to avail this offer.",
  },
  {
    question: "Can I upgrade or downgrade my plan later?",
    answer:
      "Absolutely! You can upgrade or downgrade your subscription at any time from your account settings. The changes will be applied at the start of the next billing cycle.",
  },
  {
    question: 'Is the "Free" plan really free?',
    answer:
      "Yes, our Basic plan is completely free to use. It includes a limited number of property listings and basic search functionality.",
  },
  {
    question: "Do your prices include VAT?",
    answer:
      "Our prices are exclusive of VAT. The applicable VAT will be added during the checkout process.",
  },
];

export default function PricingPage() {
  return (
    <div>
      <Navbar />
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Flexible Pricing for Every Stage
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-12">
            Choose the plan that fits your property goals — from individuals to
            enterprises.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: index * 0.15,
                  duration: 0.5,
                  ease: "easeOut",
                }}
              >
                <Card className="rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
                  <CardContent className="p-8 flex flex-col h-full justify-between">
                    <div>
                      <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                        {plan.name}
                      </h2>
                      <div className="text-3xl font-bold text-primary mb-6">
                        {plan.price}
                      </div>
                      <ul className="text-gray-700 mb-8 space-y-3 text-left">
                        {plan.features.map((feature) => (
                          <li key={feature} className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Button variant={plan.ctaVariant as any} className="w-full">
                      {plan.cta}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* FAQ Section using Shadcn UI Accordion */}
          <div className="max-w-2xl mx-auto mt-16">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
              Frequently Asked Questions
            </h2>
            <Accordion type="single" collapsible>
              {pricingFAQs.map((faq, index) => (
                <AccordionItem key={index} value={`question-${index + 1}`}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
