import { Product } from "@/lib/types";
import { Button } from "@/components/ui/button";

type ProductListProps = {
  products: Product[];
  onEdit: (product: Product) => void;
  onRequestDelete: (product: Product) => void;
  onCreateFirst?: () => void;
  deletingId: string | null;
  editingId: string | null;
};

export function ProductList({
  products,
  onEdit,
  onRequestDelete,
  onCreateFirst,
  deletingId,
  editingId,
}: ProductListProps) {
  if (!products.length) {
    return (
      <div className="gradient-border glass-panel rounded-[20px] p-8 text-center">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7f5af0]/30 to-[#a78bfa]/20 text-2xl text-[#ddd6fe]">
          📭
        </div>
        <h3 className="text-xl font-bold text-foreground">No Products Yet</h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted">
          Start building your catalog by creating your first product. You can manage prices,
          descriptions, and updates from this dashboard.
        </p>
        <Button
          type="button"
          className="mt-5 rounded-full px-5"
          onClick={onCreateFirst}
        >
          <span className="mr-1 text-base">+</span>
          Create Your First Product
        </Button>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-[18px] border border-white/10 bg-[#0d0d17]/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_20px_40px_rgba(3,3,10,0.4)] backdrop-blur">
      <table className="min-w-[760px] w-full text-left text-sm">
        <thead className="bg-[#131324]/75">
          <tr>
            <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#a1a1aa]">Name</th>
            <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#a1a1aa]">Description</th>
            <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#a1a1aa]">Price</th>
            <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#a1a1aa]">Created</th>
            <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#a1a1aa]">Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-t border-white/5 bg-transparent transition-colors hover:bg-[#1a1730]/55">
              <td className="px-4 py-3.5 font-medium text-[#eaeaf0]">{product.name}</td>
              <td className="px-4 py-3.5 text-[#a1a1aa]">{product.description ?? "-"}</td>
              <td className="px-4 py-3 font-semibold text-[#ddd6fe]">${Number(product.price).toFixed(2)}</td>
              <td className="px-4 py-3.5 text-[#a1a1aa]">{new Date(product.createdAt).toLocaleDateString()}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    className="h-8 rounded-xl px-3 text-[11px] shadow-none hover:translate-y-0"
                    loading={editingId === product.id}
                    onClick={() => onEdit(product)}
                  >
                    Edit
                  </Button>
                  <Button
                    type="button"
                    className="h-8 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 px-3 text-[11px] shadow-none hover:translate-y-0"
                    loading={deletingId === product.id}
                    onClick={() => onRequestDelete(product)}
                  >
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
