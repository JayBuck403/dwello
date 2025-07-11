"use client";

import Navbar from "@/components/header";
import Footer from "@/components/Footer";

export default function TermsOfServicePage() {
  return (
    <div>
      <Navbar />
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-4xl font-bold text-primary mb-8 text-center">
            Terms of Service
          </h1>

          <div className="space-y-8 text-gray-700 text-sm leading-relaxed">
            <p>
              Welcome to <strong className="text-gray-900">Dwello</strong>. By
              accessing or using our platform, you agree to comply with and be
              bound by these Terms of Service ("Terms"). Please read them
              carefully before using our services.
            </p>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                1. Acceptance of Terms
              </h2>
              <p>
                These Terms form a legally binding agreement between you and
                <strong className="text-gray-900"> Dwello </strong> regarding
                your access to and use of the platform.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                2. User Accounts
              </h2>
              <p>
                When you create an account, you agree to provide accurate and
                complete information. You are solely responsible for maintaining
                the confidentiality of your account credentials and for all
                activities that occur under your account.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                3. Property Listings
              </h2>
              <p>
                Listings must be accurate, lawful, and not misleading. We
                reserve the right to remove any listing that violates our
                guidelines or applicable laws.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                4. User Conduct
              </h2>
              <p>
                You agree not to misuse the platform, including but not limited
                to engaging in fraudulent activities, posting spam, or violating
                intellectual property rights.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                5. Intellectual Property
              </h2>
              <p>
                All content, trademarks, and data on this platform are the
                property of Dwello or its licensors and are protected by
                copyright and trademark laws.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                6. Limitation of Liability
              </h2>
              <p>
                We are not liable for any indirect, incidental, or consequential
                damages arising out of your use of the platform. All services
                are provided “as is.”
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                7. Governing Law
              </h2>
              <p>
                These Terms are governed by the laws of Ghana, without regard to
                its conflict of law provisions.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                8. Changes to Terms
              </h2>
              <p>
                We reserve the right to modify these Terms at any time.
                Continued use of the platform following changes constitutes your
                acceptance of the new Terms.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                9. Contact Us
              </h2>
              <p>
                If you have any questions regarding these Terms, please contact
                us at
                <a
                  href="mailto:jaybuck403@gmail.com"
                  className="text-primary underline"
                >
                  {" "}
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
