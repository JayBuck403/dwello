"use client";

import Navbar from "@/components/header";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail } from "lucide-react";
import Footer from "@/components/Footer";

export default function ContactPage() {
  return (
    <div>
      <Navbar />
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-4xl font-bold text-center text-primary mb-12">
            Contact Us
          </h1>

          {/* Contact Form */}
          <Card className="shadow-sm hover:shadow-md transition-all mb-10">
            <CardContent className="p-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Send Us a Message
              </h2>
              <form className="grid gap-5">
                <Input type="text" placeholder="Your Name" required />
                <Input type="email" placeholder="Your Email Address" required />
                <Input type="text" placeholder="Subject" />
                <Textarea
                  placeholder="Type your message..."
                  rows={5}
                  required
                />
                <Button type="submit" className="w-full">
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <Card className="shadow-sm hover:shadow-md transition-all">
            <CardContent className="p-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Our Contact Information
              </h2>
              <div className="space-y-4 text-gray-700">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-1" />
                  <p>
                    Dwello Homes
                    <br />
                    Tema, Ghana
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-primary mt-1" />
                  <p>+233 592 564 030</p>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-primary mt-1" />
                  <p>info@dwello.com</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
      <Footer />
    </div>
  );
}
