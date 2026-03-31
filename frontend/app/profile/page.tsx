"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ApiError, getCurrentUser } from "@/lib/api";
import { clearToken, hasToken } from "@/lib/auth";
import { UserProfile } from "@/lib/types";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hasToken()) {
      router.replace("/login");
      return;
    }

    void loadProfile();
  }, []);

  async function loadProfile() {
    setLoading(true);

    try {
      const response = await getCurrentUser();
      setUser(response);
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        clearToken();
        router.replace("/login");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <header className="gradient-border glass-panel flex items-center justify-between rounded-[20px] p-6 text-white">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#a78bfa]">Account</p>
          <h1 className="mt-2 text-3xl font-bold text-[#f5f3ff]">Profile</h1>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard"
            className="inline-flex h-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] px-3 text-sm font-semibold text-[#ddd6fe] transition hover:bg-white/[0.1]"
          >
            Dashboard
          </Link>
        </div>
      </header>

      <Card title="Personal Information" subtitle="Your authenticated account details">
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-11 w-full" />
            <Skeleton className="h-11 w-full" />
            <Skeleton className="h-11 w-full" />
          </div>
        ) : (
          <div className="grid gap-4 text-sm md:grid-cols-2">
            <InfoItem label="First name" value={user?.firstName ?? "-"} />
            <InfoItem label="Last name" value={user?.lastName ?? "-"} />
            <InfoItem label="Email" value={user?.email ?? "-"} />
            <InfoItem label="Role" value={user?.role ?? "-"} />
          </div>
        )}
      </Card>
    </main>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#a1a1aa]">{label}</p>
      <p className="mt-2 text-base font-semibold text-[#f5f3ff]">{value}</p>
    </div>
  );
}
