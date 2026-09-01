export default function MarketingLoading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4">
      <div
        className="h-10 w-10 animate-spin rounded-full border-4 border-navy/20 border-t-terracotta"
        role="status"
        aria-label="Loading"
      />
      <p className="text-sm text-slate-500">Loading...</p>
    </div>
  );
}
