"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebase";
import { sendEmailVerification } from "firebase/auth";
import { useState, useEffect } from "react";

const COOLDOWN_DURATION = 120; // seconds (e.g., 2 minutes)

export default function VerifyEmailPage() {
  const [verificationSent, setVerificationSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(COOLDOWN_DURATION);

  const resendVerificationEmail = async () => {
    if (resendCooldown > 0 || isResending) {
      return; // Prevent resending during cooldown or active resend
    }

    setIsResending(true);
    try {
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser);
        setVerificationSent(true);
        setError(null);
        setResendCooldown(COOLDOWN_DURATION); // Start the cooldown again
      } else {
        setError("No user signed in.");
      }
    } catch (err: any) {
      setError(err.message);
      setVerificationSent(false);
    } finally {
      setIsResending(false);
    }
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (resendCooldown > 0) {
      intervalId = setInterval(() => {
        setResendCooldown((prevCooldown) => prevCooldown - 1);
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [resendCooldown]);

  const isButtonDisabled = resendCooldown > 0 || isResending;
  const buttonText = isButtonDisabled
    ? `Resend Email in ${resendCooldown} seconds`
    : "Resend Verification Email";

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="max-w-md w-full p-6">
        <CardHeader className="pb-0">
          <CardTitle className="text-2xl font-bold text-center">
            Verify Your Email
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            A verification link has been sent to your email address. Please
            check your inbox and click the link to verify your account.
          </p>
          {verificationSent && (
            <p className="text-green-500">
              Verification email resent successfully!
            </p>
          )}
          {error && <p className="text-red-500">{error}</p>}
          <Button
            onClick={resendVerificationEmail}
            className="w-full"
            disabled={isButtonDisabled}
          >
            {buttonText}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
