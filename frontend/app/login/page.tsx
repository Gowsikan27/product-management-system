"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { login } from "@/lib/api";
import { hasToken, setToken } from "@/lib/auth";
import { useAppUI } from "../providers";

export default function LoginPage() {
  const router = useRouter();
  const { success, error: toastError } = useAppUI();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (hasToken()) {
      router.replace("/dashboard");
    }
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await login({ email, password });
      setToken(response.accessToken);
      success("Signed in successfully.");
      router.push("/dashboard");
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : "Unable to sign in right now";
      toastError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      eyebrow="SenzMate Console"
      title="Command your product ecosystem"
      description="Sign in to access a premium control center for catalog operations, pricing decisions, and growth insights."
    >
      <Card title="Welcome back" subtitle="Use your credentials to continue">
        <form className="space-y-4" onSubmit={handleSubmit}>
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
            Login
          </Button>
          <p className="text-sm text-muted">
            New here?{" "}
            <Link href="/register" className="font-semibold text-[#c4b5fd] transition hover:text-white">
              Create an account
            </Link>
          </p>
        </form>
      </Card>
    </AuthShell>
  );
}
