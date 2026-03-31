"use client";

import Link from "next/link";
import { FormEvent, ReactNode, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ProductList } from "@/components/dashboard/product-list";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ApiError,
  createProduct,
  deleteProduct,
  getCurrentUser,
  getProducts,
  getProductSummary,
  updateProduct,
} from "@/lib/api";
import { clearToken, hasToken } from "@/lib/auth";
import { Product, ProductListResponse, ProductSummary, UserProfile } from "@/lib/types";
import { useAppUI } from "../providers";

const PAGE_SIZE = 8;

const EMPTY_META: ProductListResponse["meta"] = {
  page: 1,
  limit: PAGE_SIZE,
  totalItems: 0,
  totalPages: 1,
  hasNext: false,
  hasPrev: false,
};

const EMPTY_SUMMARY: ProductSummary = {
  totalUsers: 0,
  totalProducts: 0,
  totalRevenue: 0,
};

export default function DashboardPage() {
  const router = useRouter();
  const { success, error: toastError } = useAppUI();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [meta, setMeta] = useState<ProductListResponse["meta"]>(EMPTY_META);
  const [summary, setSummary] = useState<ProductSummary>(EMPTY_SUMMARY);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"createdAt" | "name" | "price">("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [page, setPage] = useState(1);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Product | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  const [editingName, setEditingName] = useState("");
  const [editingDescription, setEditingDescription] = useState("");
  const [editingPrice, setEditingPrice] = useState("");

  const [loading, setLoading] = useState(true);
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [listError, setListError] = useState<string | null>(null);

  const accountName = useMemo(() => {
    if (!user) {
      return "Loading profile...";
    }

    return `${user.firstName} ${user.lastName}`;
  }, [user]);

  const userInitials = useMemo(() => {
    if (!user) {
      return "U";
    }

    return `${user.firstName[0] ?? ""}${user.lastName[0] ?? ""}`.toUpperCase();
  }, [user]);

  const pageNumbers = useMemo(() => getVisiblePages(meta.page, meta.totalPages), [meta.page, meta.totalPages]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 320);

    return () => window.clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    if (!hasToken()) {
      router.replace("/login");
      return;
    }

    void loadUserAndSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!hasToken()) {
      return;
    }

    void loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search, sortBy, sortOrder, minPrice, maxPrice]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      if (!hasToken()) {
        clearToken();
        router.replace("/login");
      }
    }, 15000);

    return () => window.clearInterval(interval);
  }, [router]);

  async function loadUserAndSummary() {
    setLoadingSummary(true);

    try {
      const [profile, summaryResponse] = await Promise.all([
        getCurrentUser(),
        getProductSummary(),
      ]);
      setUser(profile);
      setSummary(summaryResponse);
    } catch (requestError) {
      handleAuthError(requestError);
    } finally {
      setLoadingSummary(false);
    }
  }

  async function loadProducts() {
    setLoading(true);
    setListError(null);

    try {
      const response = await getProducts({
        page,
        limit: PAGE_SIZE,
        search: search || undefined,
        sortBy,
        sortOrder,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
      });

      setProducts(response.items);
      setMeta(response.meta);
      if (page > response.meta.totalPages) {
        setPage(response.meta.totalPages);
      }
    } catch (requestError) {
      const handled = handleAuthError(requestError);
      if (!handled) {
        setListError(
          requestError instanceof Error
            ? requestError.message
            : "Unable to load products",
        );
      }
    } finally {
      setLoading(false);
    }
  }

  async function refreshAfterMutation(message: string) {
    await Promise.all([loadProducts(), loadUserAndSummary()]);
    success(message);
  }

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);

    try {
      await createProduct({
        name,
        description: description || undefined,
        price: Number(price),
      });

      setName("");
      setDescription("");
      setPrice("");
      setIsCreateOpen(false);
      await refreshAfterMutation("Product created successfully.");
    } catch (requestError) {
      if (!handleAuthError(requestError)) {
        toastError(
          requestError instanceof Error
            ? requestError.message
            : "Unable to create product",
        );
      }
    } finally {
      setSubmitting(false);
    }
  }

  function openEditModal(product: Product) {
    setEditingProductId(product.id);
    setEditingName(product.name);
    setEditingDescription(product.description ?? "");
    setEditingPrice(String(product.price));
    setIsEditOpen(true);
  }

  function resetEditState() {
    setEditingProductId(null);
    setEditingName("");
    setEditingDescription("");
    setEditingPrice("");
    setIsEditOpen(false);
  }

  async function handleUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!editingProductId) {
      return;
    }

    setUpdating(true);

    try {
      await updateProduct(editingProductId, {
        name: editingName,
        description: editingDescription || undefined,
        price: Number(editingPrice),
      });

      resetEditState();
      await refreshAfterMutation("Product updated successfully.");
    } catch (requestError) {
      if (!handleAuthError(requestError)) {
        toastError(
          requestError instanceof Error
            ? requestError.message
            : "Unable to update product",
        );
      }
    } finally {
      setUpdating(false);
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id);

    try {
      await deleteProduct(id);
      setPendingDelete(null);
      await refreshAfterMutation("Product deleted successfully.");
    } catch (requestError) {
      if (!handleAuthError(requestError)) {
        toastError(
          requestError instanceof Error
            ? requestError.message
            : "Unable to delete product",
        );
      }
    } finally {
      setDeletingId(null);
    }
  }

  function handleLogout() {
    clearToken();
    router.replace("/login");
  }

  function handleAuthError(requestError: unknown): boolean {
    if (requestError instanceof ApiError && requestError.status === 401) {
      clearToken();
      router.replace("/login");
      return true;
    }

    return false;
  }

  return (
    <main className="mx-auto w-full max-w-[1520px] flex-1 px-4 py-6 sm:px-6 lg:px-8">
      <div className="grid gap-5 lg:grid-cols-[auto_1fr]">
        <aside
          className={[
            "glass-panel gradient-border sticky top-4 hidden h-[calc(100vh-3rem)] rounded-[22px] p-4 lg:flex lg:flex-col lg:justify-between",
            "transition-all duration-300",
            isSidebarCollapsed ? "w-[84px]" : "w-[248px]",
          ].join(" ")}
        >
          <div>
            <button
              type="button"
              onClick={() => setIsSidebarCollapsed((prev) => !prev)}
              className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-[#ddd6fe] transition hover:bg-white/[0.1]"
              aria-label="Toggle sidebar"
            >
              {isSidebarCollapsed ? "»" : "«"}
            </button>

            <div className="mb-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#a78bfa]">SenzMate</p>
              {!isSidebarCollapsed ? (
                <h2 className="mt-2 text-lg font-semibold tracking-[0.01em] text-[#f5f3ff]">Product OS</h2>
              ) : null}
            </div>

            <nav className="space-y-2">
              <SidebarItem collapsed={isSidebarCollapsed} icon="◉" label="Dashboard" active />
              <SidebarItem collapsed={isSidebarCollapsed} icon="◌" label="Products" />
              <SidebarItem collapsed={isSidebarCollapsed} icon="◍" label="Analytics" />
              <SidebarItem collapsed={isSidebarCollapsed} icon="◎" label="Workflow" />
            </nav>
          </div>

          <div className="space-y-2">
            <Link
              href="/profile"
              className="flex h-11 items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-3 text-sm font-medium text-[#ddd6fe] transition hover:bg-white/[0.1]"
            >
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-white/10">◉</span>
              {!isSidebarCollapsed ? <span>Profile</span> : null}
            </Link>
            <button
              type="button"
              className="flex h-11 w-full items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-3 text-sm font-medium text-[#fda4af] transition hover:bg-white/[0.1]"
              onClick={handleLogout}
            >
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-white/10">◦</span>
              {!isSidebarCollapsed ? <span>Logout</span> : null}
            </button>
          </div>
        </aside>

        <section className="space-y-5">
          <header className="glass-panel gradient-border animate-fade-slide rounded-[20px] px-5 py-5 sm:px-7">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#a78bfa]">Product Management</p>
                <h1 className="mt-1 text-3xl font-bold tracking-[-0.02em] text-[#f5f3ff] sm:text-[2.05rem]">Premium Dashboard</h1>
                <p className="mt-2 max-w-2xl text-sm text-[#a1a1aa]">Build, refine, and scale your catalog with precision controls and live product intelligence.</p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[#a78bfa]">⌕</span>
                  <input
                    value={searchInput}
                    onChange={(event) => setSearchInput(event.target.value)}
                    className="h-11 w-64 rounded-xl border border-white/10 bg-white/[0.03] pl-8 pr-3 text-sm text-[#eaeaf0] placeholder:text-[#77788a] outline-none transition focus:border-[#a78bfa]/60 focus:shadow-[0_0_0_4px_rgba(127,90,240,0.16)]"
                    placeholder="Search products"
                  />
                </div>
                <button
                  type="button"
                  className="inline-flex h-11 items-center rounded-xl border border-white/10 bg-white/[0.03] px-3 text-sm text-[#eaeaf0]"
                >
                  <span className="mr-2 inline-flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#7f5af0] to-[#a78bfa] text-[11px] font-bold text-white">
                    {userInitials}
                  </span>
                  {accountName}
                </button>
              </div>
            </div>
          </header>

          <section className="grid gap-4 md:grid-cols-3 animate-fade-slide [animation-delay:80ms]">
            <StatCard label="Total Products" icon="◌" value={summary.totalProducts} loading={loadingSummary} />
            <StatCard label="Revenue" icon="◍" value={Number(summary.totalRevenue)} prefix="$" decimals={2} loading={loadingSummary} />
            <StatCard label="Users" icon="◎" value={summary.totalUsers} loading={loadingSummary} />
          </section>

          <section className="grid gap-4 xl:grid-cols-[1.5fr_1fr] animate-fade-slide [animation-delay:140ms]">
            <article className="gradient-border glass-panel rounded-[20px] p-5 sm:p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold tracking-[0.01em] text-[#f5f3ff]">Revenue Trend</h2>
                <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-[#a1a1aa]">Last 7 snapshots</span>
              </div>
              <RevenueChart products={products} totalRevenue={summary.totalRevenue} />
            </article>

            <article className="gradient-border glass-panel rounded-[20px] p-5 sm:p-6">
              <h2 className="text-lg font-semibold text-[#f5f3ff]">System Pulse</h2>
              <p className="mt-1 text-sm text-[#a1a1aa]">Realtime status of dashboard operations.</p>
              <div className="mt-5 space-y-3 text-sm">
                <PulseItem label="Catalog Sync" value={loading ? "Updating" : "Stable"} />
                <PulseItem label="Auth Security" value="Protected" />
                <PulseItem label="API Health" value={listError ? "Attention" : "Optimal"} />
              </div>
            </article>
          </section>

          <section className="gradient-border glass-panel animate-fade-slide rounded-[20px] p-5 [animation-delay:180ms] sm:p-7">
            <div className="mb-5 border-b border-white/10 pb-4">
              <h2 className="text-2xl font-bold tracking-[-0.015em] text-[#f5f3ff]">Products</h2>
              <p className="mt-1 text-sm leading-relaxed text-[#a1a1aa]">
                Search, filter, sort, and manage your product catalog with confidence.
              </p>
            </div>

        <div className="mb-5 grid gap-3 lg:grid-cols-4">
            <SearchField label="Search" icon="⌕">
            <input
                className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.03] pl-10 pr-3 text-sm text-[#eaeaf0] transition focus:border-[#a78bfa]/60 focus:outline-none focus:shadow-[0_0_0_4px_rgba(127,90,240,0.15)]"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Name or description"
            />
          </SearchField>

          <SearchField label="Min price" icon="$">
            <input
              className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.03] pl-10 pr-3 text-sm text-[#eaeaf0] transition focus:border-[#a78bfa]/60 focus:outline-none focus:shadow-[0_0_0_4px_rgba(127,90,240,0.15)]"
              type="number"
              min="0"
              step="0.01"
              value={minPrice}
              onChange={(event) => {
                setPage(1);
                setMinPrice(event.target.value);
              }}
            />
          </SearchField>

          <SearchField label="Max price" icon="$">
            <input
              className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.03] pl-10 pr-3 text-sm text-[#eaeaf0] transition focus:border-[#a78bfa]/60 focus:outline-none focus:shadow-[0_0_0_4px_rgba(127,90,240,0.15)]"
              type="number"
              min="0"
              step="0.01"
              value={maxPrice}
              onChange={(event) => {
                setPage(1);
                setMaxPrice(event.target.value);
              }}
            />
          </SearchField>

          <div className="grid grid-cols-2 gap-2">
            <label className="flex flex-col gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#a1a1aa]">
              Sort by
              <select
                className="h-12 rounded-2xl border border-white/10 bg-white/[0.03] px-3 text-sm text-[#eaeaf0] transition focus:border-[#a78bfa]/60 focus:outline-none focus:shadow-[0_0_0_4px_rgba(127,90,240,0.15)]"
                value={sortBy}
                onChange={(event) => {
                  setPage(1);
                  setSortBy(event.target.value as "createdAt" | "name" | "price");
                }}
              >
                <option value="createdAt">Created</option>
                <option value="name">Name</option>
                <option value="price">Price</option>
              </select>
            </label>
            <label className="flex flex-col gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#a1a1aa]">
              Order
              <select
                className="h-12 rounded-2xl border border-white/10 bg-white/[0.03] px-3 text-sm text-[#eaeaf0] transition focus:border-[#a78bfa]/60 focus:outline-none focus:shadow-[0_0_0_4px_rgba(127,90,240,0.15)]"
                value={sortOrder}
                onChange={(event) => {
                  setPage(1);
                  setSortOrder(event.target.value as "asc" | "desc");
                }}
              >
                <option value="desc">Desc</option>
                <option value="asc">Asc</option>
              </select>
            </label>
          </div>
        </div>

        <div className="mb-4 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <p className="text-sm text-[#a1a1aa]">Showing {products.length} of {meta.totalItems} items</p>
          <Button
            type="button"
            className="h-11 rounded-full px-6"
            onClick={() => setIsCreateOpen(true)}
          >
            <span className="mr-1 text-base">+</span>
            New Product
          </Button>
        </div>

        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-12 w-full rounded-xl" />
            ))}
          </div>
        ) : listError ? (
          <ApiFallbackCard message={listError} onRetry={() => void loadProducts()} />
        ) : (
          <ProductList
            products={products}
            onEdit={openEditModal}
            onRequestDelete={setPendingDelete}
            onCreateFirst={() => setIsCreateOpen(true)}
            deletingId={deletingId}
            editingId={updating ? editingProductId : null}
          />
        )}

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
          <button
            type="button"
            className="h-9 rounded-xl border border-white/10 bg-white/[0.03] px-3 text-sm font-semibold text-[#ddd6fe] transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!meta.hasPrev || loading}
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          >
            Previous
          </button>

          {pageNumbers.map((pageNumber) => (
            <button
              key={pageNumber}
              type="button"
              className={[
                "h-9 min-w-9 rounded-xl px-3 text-sm font-semibold transition",
                pageNumber === meta.page
                  ? "bg-gradient-to-r from-[#7f5af0] to-[#a78bfa] text-white shadow-[0_8px_20px_rgba(127,90,240,0.45)]"
                  : "border border-white/10 bg-white/[0.03] text-[#d4d4dd] hover:bg-white/[0.09]",
              ].join(" ")}
              onClick={() => setPage(pageNumber)}
            >
              {pageNumber}
            </button>
          ))}

          <button
            type="button"
            className="h-9 rounded-xl border border-white/10 bg-white/[0.03] px-3 text-sm font-semibold text-[#ddd6fe] transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!meta.hasNext || loading}
            onClick={() => setPage((prev) => prev + 1)}
          >
            Next
          </button>
        </div>
          </section>
        </section>
      </div>

      <Modal
        open={isCreateOpen}
        title="Create product"
        subtitle="Add a new product to your catalog"
        onClose={() => setIsCreateOpen(false)}
      >
        <form className="grid gap-4 md:grid-cols-[1fr_1fr_180px_auto]" onSubmit={handleCreate}>
          <Input
            label="Name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
          <Input
            label="Description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
          <Input
            label="Price"
            type="number"
            step="0.01"
            min="0"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            required
          />
          <div className="flex items-end">
            <Button className="w-full" loading={submitting} type="submit">
              Create
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        open={isEditOpen}
        title="Edit product"
        subtitle="Update your product details"
        onClose={resetEditState}
      >
        <form className="grid gap-4 md:grid-cols-[1fr_1fr_180px_auto_auto]" onSubmit={handleUpdate}>
          <Input
            label="Name"
            value={editingName}
            onChange={(event) => setEditingName(event.target.value)}
            required
          />
          <Input
            label="Description"
            value={editingDescription}
            onChange={(event) => setEditingDescription(event.target.value)}
          />
          <Input
            label="Price"
            type="number"
            step="0.01"
            min="0"
            value={editingPrice}
            onChange={(event) => setEditingPrice(event.target.value)}
            required
          />
          <div className="flex items-end">
            <Button className="w-full" loading={updating} type="submit">
              Save
            </Button>
          </div>
          <div className="flex items-end">
            <Button
              type="button"
              className="w-full bg-white text-foreground shadow-none hover:bg-black/5 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
              onClick={resetEditState}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete product"
        description={
          pendingDelete
            ? `Are you sure you want to delete \"${pendingDelete.name}\"? This action cannot be undone.`
            : ""
        }
        confirmText="Delete"
        loading={deletingId !== null}
        onCancel={() => setPendingDelete(null)}
        onConfirm={async () => {
          if (!pendingDelete) {
            return;
          }

          await handleDelete(pendingDelete.id);
        }}
      />
    </main>
  );
}

type SearchFieldProps = {
  label: string;
  icon: string;
  children: ReactNode;
};

function SearchField({ label, icon, children }: SearchFieldProps) {
  return (
    <label className="flex flex-col gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#a1a1aa]">
      {label}
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[14px] text-[#a78bfa]">{icon}</span>
        {children}
      </div>
    </label>
  );
}

type StatCardProps = {
  label: string;
  value: number;
  icon: string;
  prefix?: string;
  decimals?: number;
  loading: boolean;
};

function StatCard({ label, value, icon, prefix, decimals = 0, loading }: StatCardProps) {
  return (
    <article className="gradient-border glass-panel group rounded-[18px] p-5 transition duration-300 hover:-translate-y-1 hover:shadow-[0_0_0_1px_rgba(167,139,250,0.35),0_20px_38px_rgba(2,2,9,0.55)]">
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#7f5af0]/28 to-[#a78bfa]/20 text-base text-[#ddd6fe]">
          {icon}
        </div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#a1a1aa]">{label}</p>
      </div>
      {loading ? (
        <Skeleton className="h-10 w-32 rounded-xl" />
      ) : (
        <p className="text-3xl font-extrabold tracking-tight text-[#f5f3ff] sm:text-4xl">
          {prefix}
          <CountUp value={value} decimals={decimals} />
        </p>
      )}
    </article>
  );
}

function SidebarItem({
  collapsed,
  icon,
  label,
  active = false,
}: {
  collapsed: boolean;
  icon: string;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      className={[
        "relative flex h-11 w-full items-center gap-3 rounded-xl px-3 text-sm transition",
        active
          ? "bg-gradient-to-r from-[#7f5af0]/35 to-[#a78bfa]/20 text-[#f5f3ff] shadow-[inset_2px_0_0_#a78bfa]"
          : "text-[#b7b7c8] hover:bg-white/[0.08] hover:text-[#ececff]",
      ].join(" ")}
    >
      <span className={active ? "text-[#c4b5fd]" : "text-[#8b8ba1]"}>{icon}</span>
      {!collapsed ? <span>{label}</span> : null}
    </button>
  );
}

function PulseItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5">
      <span className="text-[#a1a1aa]">{label}</span>
      <span className="rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-1 text-xs text-[#ddd6fe]">{value}</span>
    </div>
  );
}

function ApiFallbackCard({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="mb-4 rounded-2xl border border-rose-400/35 bg-rose-500/10 p-5 text-rose-100 backdrop-blur">
      <p className="text-sm leading-relaxed">Unable to load products right now. {message}</p>
      <Button
        type="button"
        className="mt-4 h-10 rounded-xl bg-gradient-to-r from-[#7f5af0] to-[#a78bfa] px-4 text-xs"
        onClick={onRetry}
      >
        Retry
      </Button>
    </div>
  );
}

function RevenueChart({ products, totalRevenue }: { products: Product[]; totalRevenue: number }) {
  const points = useMemo(() => {
    const baseSeries = products
      .slice(0, 7)
      .map((item) => Number(item.price))
      .reverse();

    const fallback = [12, 18, 15, 24, 22, 30, 34];
    const merged = (baseSeries.length ? baseSeries : fallback).map((point, index) =>
      point + (totalRevenue > 0 ? (Number(totalRevenue) / 100) * (index / 8) : 0),
    );

    const max = Math.max(...merged, 1);
    const min = Math.min(...merged, 0);

    return merged.map((point, index) => {
      const x = (index / (merged.length - 1 || 1)) * 100;
      const normalized = (point - min) / (max - min || 1);
      const y = 86 - normalized * 66;
      return `${x},${y}`;
    });
  }, [products, totalRevenue]);

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0b0b14] p-3">
      <svg viewBox="0 0 100 100" className="h-44 w-full">
        <defs>
          <linearGradient id="chartStroke" x1="0" y1="0" x2="100" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#7f5af0" />
            <stop offset="100%" stopColor="#a78bfa" />
          </linearGradient>
          <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#7f5af0" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <polyline points={points.join(" ")} fill="none" stroke="url(#chartStroke)" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" />
        <polygon points={`${points.join(" ")} 100,96 0,96`} fill="url(#chartFill)" />
      </svg>
    </div>
  );
}

type CountUpProps = {
  value: number;
  decimals?: number;
};

function CountUp({ value, decimals = 0 }: CountUpProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const duration = 800;
    const start = performance.now();

    let frameId = 0;
    function animate(timestamp: number) {
      const progress = Math.min(1, (timestamp - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(value * eased);

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      }
    }

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [value]);

  return <>{displayValue.toFixed(decimals)}</>;
}

function getVisiblePages(current: number, total: number) {
  if (total <= 1) {
    return [1];
  }

  const start = Math.max(1, current - 2);
  const end = Math.min(total, start + 4);
  const adjustedStart = Math.max(1, end - 4);

  const pages: number[] = [];
  for (let page = adjustedStart; page <= end; page += 1) {
    pages.push(page);
  }

  return pages;
}
