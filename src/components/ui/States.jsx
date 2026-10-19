// Reusable page header, empty-state and skeleton components.

export const PageHeader = ({ tag, title, subtitle, right }) => (
  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 animate-fade-up">
    <div>
      {tag && (
        <p className="font-mono text-xs text-secondary mb-2">
          <span className="opacity-60">~/devtinder</span> $ {tag}
        </p>
      )}
      <h1 className="text-3xl sm:text-4xl font-bold">{title}</h1>
      {subtitle && <p className="mt-2 text-base-content/60">{subtitle}</p>}
    </div>
    {right}
  </div>
);

export const EmptyState = ({ icon: Icon, title, text, action }) => (
  <div className="glass-card rounded-box max-w-md mx-auto text-center px-8 py-12 animate-fade-up">
    {Icon && (
      <div className="mx-auto mb-5 grid place-items-center w-14 h-14 rounded-2xl bg-primary/15 text-primary">
        <Icon className="w-7 h-7" />
      </div>
    )}
    <h2 className="text-xl font-semibold">{title}</h2>
    {text && <p className="mt-2 text-base-content/60 text-sm">{text}</p>}
    {action && <div className="mt-6">{action}</div>}
  </div>
);

export const CardSkeleton = () => (
  <div className="w-full max-w-sm glass-card rounded-box overflow-hidden">
    <div className="skeleton h-96 w-full rounded-none" />
    <div className="p-6 space-y-3">
      <div className="skeleton h-6 w-1/2" />
      <div className="skeleton h-4 w-1/3" />
      <div className="skeleton h-4 w-full" />
    </div>
  </div>
);

export const ListSkeleton = ({ rows = 3 }) => (
  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="glass-card rounded-box p-5 flex gap-4">
        <div className="skeleton w-16 h-16 rounded-full shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="skeleton h-5 w-2/3" />
          <div className="skeleton h-4 w-1/3" />
          <div className="skeleton h-4 w-full" />
        </div>
      </div>
    ))}
  </div>
);
