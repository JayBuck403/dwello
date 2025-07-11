"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/lib/firebase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function VerifyEmailPendingPage() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const checkVerification = async () => {
    if (auth.currentUser) {
      await auth.currentUser.reload();
      if (auth.currentUser.emailVerified) {
        router.push("/dashboard"); // or wherever you want to send verified users
      } else {
        setError("Your email is not verified yet. Please check your inbox.");
      }
    } else {
      setError("No user signed in.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="max-w-md w-full p-6">
        <CardHeader className="pb-0">
          <CardTitle className="text-2xl font-bold text-center text-yellow-500">
            Email Verification Pending
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600 text-center">
            Your email address has not yet been verified. Please check your
            inbox and click the verification link we sent.
          </p>
          <p className="text-gray-600 text-center">
            If you haven't received the email, please go to the{" "}
            <Link href="/verify-email" className="text-primary hover:underline">
              Verification Email Page
            </Link>{" "}
            to resend.
          </p>
          <Button
            onClick={checkVerification}
            className="w-full"
            variant="outline"
          >
            Check Verification
          </Button>
          {error && <p className="text-red-500 text-center">{error}</p>}
        </CardContent>
      </Card>
    </div>
  );
}
