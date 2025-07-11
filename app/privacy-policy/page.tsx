"use client";

import Navbar from "@/components/header";
import Footer from "@/components/Footer";

export default function PrivacyPolicyPage() {
  return (
    <div>
      <Navbar />
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-4xl font-bold text-primary mb-8 text-center">
            Privacy Policy
          </h1>

          <div className="space-y-8 text-gray-700 text-sm leading-relaxed">
            <p>
              Your privacy is important to us. This Privacy Policy explains how
              <strong className="text-gray-900"> Dwello </strong>
              collects, uses, and protects your personal information.
            </p>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                1. Information We Collect
              </h2>
              <p>
                We may collect information such as your name, email address,
                phone number, location, and preferences when you register,
                browse properties, or interact with features on our platform.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                2. How We Use Your Information
              </h2>
              <p>
                Your data helps us provide personalized property listings,
                improve user experience, and communicate updates, offers, or
                service-related notices.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                3. Data Sharing
              </h2>
              <p>
                We may share limited information with trusted partners and
                agents to facilitate inquiries and transactions. We do not sell
                your personal data.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                4. Data Security
              </h2>
              <p>
                We implement appropriate measures to safeguard your information
                against unauthorized access, alteration, or disclosure.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                5. Your Rights
              </h2>
              <p>
                You may access, correct, or delete your data at any time by
                managing your account settings or contacting our support team.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                6. Cookies and Tracking Technologies
              </h2>
              <p>
                We use cookies to enhance your browsing experience and gather
                insights into site performance. You can control cookie
                preferences through your browser settings.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                7. Third-Party Links
              </h2>
              <p>
                Our platform may include links to third-party websites. We are
                not responsible for the content or privacy practices of those
                sites.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                8. Children’s Privacy
              </h2>
              <p>
                Our services are not intended for individuals under the age of
                18. We do not knowingly collect data from children.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                9. Changes to This Policy
              </h2>
              <p>
                We may update this policy occasionally. If significant changes
                are made, we will notify you via email or an in-app
                notification.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                10. Contact Us
              </h2>
              <p>
                For questions or concerns about this policy, please contact us
                at{" "}
                <a
                  href="mailto:jaybuck403@gmail.com"
                  className="text-primary underline"
                >
                  jaybuck403@gmail.com
                </a>
                .
              </p>
            </div>

            <p className="text-sm text-gray-500 mt-6">
              Last updated: May 2, 2025
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
