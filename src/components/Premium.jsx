import { CheckIcon, CrownIcon } from "./ui/Icons";
import { PageHeader } from "./ui/States";

const plans = [
  {
    name: "Silver",
    price: "₹299",
    period: "3 months",
    features: ["Chat with any connection", "100 requests per day", "Blue verified tick"],
    highlight: false,
  },
  {
    name: "Gold",
    price: "₹699",
    period: "6 months",
    features: ["Everything in Silver", "Unlimited requests", "See who liked you", "Priority in feed"],
    highlight: true,
  },
];

const Premium = () => (
  <section>
    <PageHeader
      tag="npm install premium"
      title={<>Upgrade to <span className="text-gradient">Premium</span></>}
      subtitle="Get more matches and stand out in the feed."
    />

    <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
      {plans.map((p, i) => (
        <article
          key={p.name}
          className={`glass-card rounded-box p-8 flex flex-col animate-fade-up ${
            p.highlight ? "ring-gradient shadow-2xl shadow-primary/20" : ""
          }`}
          style={{ animationDelay: `${i * 80}ms` }}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <CrownIcon className={`w-6 h-6 ${p.highlight ? "text-warning" : "text-base-content/50"}`} />
              {p.name}
            </h2>
            {p.highlight && <span className="badge badge-primary">Most popular</span>}
          </div>
          <p className="mt-6">
            <span className="text-4xl font-bold font-display">{p.price}</span>
            <span className="text-base-content/50"> / {p.period}</span>
          </p>
          <ul className="mt-6 space-y-3 flex-1">
            {p.features.map((f) => (
              <li key={f} className="flex items-center gap-3 text-sm">
                <span className="grid place-items-center w-5 h-5 rounded-full bg-success/15 text-success">
                  <CheckIcon className="w-3 h-3" />
                </span>
                {f}
              </li>
            ))}
          </ul>
          {/* No payment gateway wired up yet — button is honest about it */}
          <button className={`btn mt-8 ${p.highlight ? "btn-primary btn-glow" : "btn-outline"}`} disabled>
            Coming soon
          </button>
        </article>
      ))}
    </div>
  </section>
);

export default Premium;
