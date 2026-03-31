"use client";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  onConfirm: () => Promise<void> | void;
  onCancel: () => void;
};

export function ConfirmDialog({
  open,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#03030a]/70 px-4 backdrop-blur-md">
      <div className="gradient-border glass-panel w-full max-w-md rounded-[20px] p-6">
        <h3 className="text-lg font-bold text-foreground">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            className="h-10 rounded-xl border border-white/10 bg-white/[0.03] px-4 text-sm font-semibold text-foreground transition hover:bg-white/[0.08]"
            onClick={onCancel}
            disabled={loading}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className="h-10 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 px-4 text-sm font-semibold text-white shadow-[0_8px_22px_rgba(244,63,94,0.35)] transition hover:brightness-110 disabled:opacity-60"
            onClick={() => void onConfirm()}
            disabled={loading}
          >
            {loading ? "Please wait..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
