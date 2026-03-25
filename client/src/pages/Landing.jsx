import { ArrowRight, BarChart3, Leaf, ShieldCheck, Sprout, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const capabilityCards = [
  {
    icon: Leaf,
    title: 'Crop Intelligence',
    copy: 'Upload field images to detect disease early and get next-step actions you can apply the same day.',
  },
  {
    icon: BarChart3,
    title: 'Risk Engine',
    copy: 'See weather, soil, and operating risk in one view so you can prevent loss before it grows.',
  },
  {
    icon: ShieldCheck,
    title: 'Trust Readiness',
    copy: 'Build a lender-ready trust profile backed by transparent farm and sustainability signals.',
  },
];

export default function Landing() {
  return (
    <div className="landing-shell animate-fade">
      <div className="landing-bg-orb landing-bg-orb-left" aria-hidden="true" />
      <div className="landing-bg-orb landing-bg-orb-right" aria-hidden="true" />

      <header className="landing-header reveal reveal-1">
        <Link to="/" className="landing-brand">
          <span className="landing-brand-mark">
            <Sprout size={16} />
          </span>
          <span>AgriMitra 360</span>
        </Link>

        <nav className="landing-header-actions" aria-label="Primary navigation">
          <Link to="/login" className="landing-link-button">Sign In</Link>
          <Link to="/signup" className="landing-cta-soft">Get Started</Link>
        </nav>
      </header>

      <main>
        <section className="landing-hero">
          <h1 className="landing-title reveal reveal-2">
            See Problems Early.<br />
            <span>Decide With Confidence.</span>
          </h1>

          <p className="landing-subtitle reveal reveal-3">
            AgriMitra 360 helps farmers, FPOs, and agri teams catch crop issues early, track field risk clearly, and prepare stronger loan-ready records from one dashboard.
          </p>

          <p className="landing-kicker reveal reveal-4">FROM DAILY FIELD CHECKS TO LOAN CONFIDENCE.</p>
          <p className="landing-kicker-strong reveal reveal-5">Detect Early. Act Fast. Prove Progress.</p>

          <div className="landing-hero-actions reveal reveal-6">
            <Link to="/signup" className="landing-primary-button">
              Start Free Check
              <ArrowRight size={17} />
            </Link>
            <Link to="/login" className="landing-secondary-button">Sign In</Link>
          </div>
        </section>

        <section className="landing-capability-section reveal reveal-4">
          <div className="landing-section-head">
            <p className="landing-section-kicker">Platform Capabilities</p>
            <h2>Get clear answers on crop condition, risk level, and credit readiness.</h2>
          </div>

          <div className="landing-capability-grid">
            {capabilityCards.map((card) => {
              const Icon = card.icon;
              return (
                <article key={card.title} className="landing-capability-card">
                  <div className="landing-capability-icon">
                    <Icon size={20} />
                  </div>
                  <h3>{card.title}</h3>
                  <p>{card.copy}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="landing-bottom-cta reveal reveal-5">
          <div className="landing-bottom-cta-inner">
            <div>
              <p className="landing-section-kicker">Ready To Improve Outcomes This Season?</p>
              <h2>Turn daily farm data into actions your team can trust.</h2>
              <p>
                Use guided crop checks, transparent risk scoring, and progress tracking to improve field performance and strengthen lender conversations.
              </p>
            </div>

            <div className="landing-bottom-actions">
              <Link to="/signup" className="landing-primary-button">
                Create Free Account
                <TrendingUp size={17} />
              </Link>
              <Link to="/login" className="landing-secondary-button">Sign In</Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
