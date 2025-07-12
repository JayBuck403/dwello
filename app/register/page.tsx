"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { auth, googleProvider, facebookProvider } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
  sendEmailVerification,
} from "firebase/auth";
import { FacebookIcon } from "@/components/icons/FacebookIcon";
import { GoogleIcon } from "@/components/icons/GoogleIcon";
import { saveUserToFirestore } from "@/lib/firestore";
import { motion } from "framer-motion";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(userCredential.user, { displayName: name });
      await saveUserToFirestore({
        uid: userCredential.user.uid,
        name,
        email,
        photoURL: userCredential.user.photoURL,
        provider: "email",
      });

      await sendEmailVerification(userCredential.user);
      console.log("Verification email sent!");
      router.push("/verify-email");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: "google" | "facebook") => {
    setError(null);
    try {
      const chosenProvider =
        provider === "google" ? googleProvider : facebookProvider;
      const result = await signInWithPopup(auth, chosenProvider);
      const user = result.user;

      await saveUserToFirestore({
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        provider,
      });

      const idToken = await user.getIdToken();
      console.log(`Firebase ${provider} ID Token (Register):`, idToken);
      localStorage.setItem("authToken", idToken); // Store the token

      // Check if user is admin and redirect accordingly
      const token = await user.getIdTokenResult();
      if (token.claims.admin || token.claims.role === "admin") {
        router.push("/admin/overview");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 p-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <Card className="w-full max-w-md shadow-xl rounded-2xl border border-gray-200">
          <CardHeader className="text-center space-y-1 pb-0">
            <CardTitle className="text-3xl font-semibold tracking-tight text-gray-800">
              Create an Account
            </CardTitle>
            <p className="text-sm text-gray-500">
              Sign up with your email or social login
            </p>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <Button
                type="submit"
                className="w-full text-base"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900 inline-block align-middle mr-2"></span>
                    Signing up...
                  </>
                ) : (
                  "Sign Up"
                )}
              </Button>
            </form>

            <div className="flex items-center gap-2 py-4">
              <div className="flex-grow h-px bg-gray-200" />
              <span className="text-xs text-gray-400">OR</span>
              <div className="flex-grow h-px bg-gray-200" />
            </div>

            <div className="grid gap-3">
              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
                onClick={() => handleSocialLogin("google")}
              >
                <GoogleIcon />
                Continue with Google
              </Button>
              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
                onClick={() => handleSocialLogin("facebook")}
              >
                <FacebookIcon />
                Continue with Facebook
              </Button>
            </div>

            <p className="text-sm text-center text-gray-600 pt-4">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-primary hover:underline font-medium"
              >
                Log In
              </Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
