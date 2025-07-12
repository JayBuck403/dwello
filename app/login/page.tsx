"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import SocialLoginButton from "@/components/SocialLoginButton";
import { GoogleIcon } from "@/components/icons/GoogleIcon";
import { FacebookIcon } from "@/components/icons/FacebookIcon";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider, facebookProvider } from "@/lib/firebase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      // User is signed in, you can now get the ID token
      const idToken = await user.getIdToken();
      console.log("Firebase ID Token:", idToken);

      // Store the token in local storage or a state management solution
      localStorage.setItem("authToken", idToken);

      // Check if user is admin and redirect accordingly
      const token = await user.getIdTokenResult();
      if (token.claims.admin || token.claims.role === "admin") {
        router.push("/admin/overview");
      } else {
        router.push("/dashboard");
      }
    } catch (error: any) {
      setError(error.message); // Display Firebase error message
      console.error("Firebase Login Error:", error);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const user = userCredential.user;
      const idToken = await user.getIdToken();
      console.log("Firebase Google ID Token:", idToken);
      localStorage.setItem("authToken", idToken);
      
      // Check if user is admin and redirect accordingly
      const token = await user.getIdTokenResult();
      if (token.claims.admin || token.claims.role === "admin") {
        router.push("/admin/overview");
      } else {
        router.push("/dashboard");
      }
    } catch (error: any) {
      setError(error.message);
      console.error("Firebase Google Sign-in Error:", error);
    }
  };

  const handleFacebookSignIn = async () => {
    try {
      const userCredential = await signInWithPopup(auth, facebookProvider);
      const user = userCredential.user;
      const idToken = await user.getIdToken();
      console.log("Firebase Facebook ID Token:", idToken);
      localStorage.setItem("authToken", idToken);
      
      // Check if user is admin and redirect accordingly
      const token = await user.getIdTokenResult();
      if (token.claims.admin || token.claims.role === "admin") {
        router.push("/admin/overview");
      } else {
        router.push("/dashboard");
      }
    } catch (error: any) {
      setError(error.message);
      console.error("Firebase Facebook Sign-in Error:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <Card className="shadow-lg rounded-xl border bg-white">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-primary">
              Welcome Back
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Log in to your Dwello account
            </p>
          </CardHeader>

          <CardContent className="p-6">
            <form onSubmit={handleLogin} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && (
                <p className="text-sm text-red-600 font-medium -mt-1">
                  {error}
                </p>
              )}

              <Button type="submit" className="w-full mt-2">
                Log In
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="text-primary font-medium hover:underline"
              >
                Sign Up
              </Link>
            </div>

            <div className="mt-2 text-center text-sm text-gray-600">
              <Link
                href="/forgot-password"
                className="text-primary hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            <div className="mt-6 border-t pt-4 space-y-3">
              <SocialLoginButton onClick={handleGoogleSignIn}>
                <GoogleIcon />
                Continue with Google
              </SocialLoginButton>

              <SocialLoginButton onClick={handleFacebookSignIn}>
                <FacebookIcon />
                Continue with Facebook
              </SocialLoginButton>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
