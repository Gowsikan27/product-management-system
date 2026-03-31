"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { register } from "@/lib/api";
import { hasToken, setToken } from "@/lib/auth";
import { useAppUI } from "../providers";

export default function RegisterPage() {
  const router = useRouter();
  const { success, error: toastError } = useAppUI();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (hasToken()) {
      router.replace("/dashboard");
    }
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await register({ firstName, lastName, email, password });
      setToken(response.accessToken);
      success("Registration complete. Welcome aboard.");
      router.push("/dashboard");
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : "Unable to register right now";
      toastError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      eyebrow="Create account"
      title="Launch your premium workspace"
      description="Create your account and step into a modern operating system for product teams and decision makers."
    >
      <Card title="Register" subtitle="Use your work details to sign up">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="First name"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              required
            />
            <Input
              label="Last name"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              required
            />
          </div>
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          <Button className="w-full" loading={loading} type="submit">
            Register
          </Button>
          <p className="text-sm text-muted">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-[#c4b5fd] transition hover:text-white">
              Sign in
            </Link>
          </p>
        </form>
      </Card>
    </AuthShell>
  );
}
