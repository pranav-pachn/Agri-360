import {
  Activity,
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Home,
  Leaf,
  LineChart,
  MessageSquare,
  ShieldCheck,
  Sprout,
  User,
} from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const topNavItems = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Analytics', to: '/analytics' },
  { label: 'Architecture', to: '/architecture' },
  { label: 'Support Chat', to: '/chat' },
];

const featureCards = [
  {
    icon: Leaf,
    title: 'Precision Disease Detection',
    copy: 'Catch early disease risk from field images before spread impacts yield and intervention cost.',
    to: '/upload',
    cta: 'Open Crop Scan',
    accent: 'emerald',
  },
  {
    icon: BarChart3,
    title: 'Yield Forecasting',
    copy: 'Track expected season outcomes with weather and crop signals in one clear progress view.',
    to: '/analytics',
    cta: 'View Analytics',
    accent: 'blue',
  },
  {
    icon: ShieldCheck,
    title: 'Trust Readiness',
    copy: 'Build lender confidence with transparent operational, sustainability, and reliability indicators.',
    to: '/dashboard',
    cta: 'Open Dashboard',
    accent: 'gold',
  },
];

const proofItems = ['Trusted by 12,000+ Farmers', 'Used across 15+ banking partners', 'India-ready crop intelligence'];

const mobileTabs = [
  { label: 'Home', to: '/', icon: Home },
  { label: 'Crops', to: '/upload', icon: Sprout },
  { label: 'Analytics', to: '/analytics', icon: LineChart },
  { label: 'Profile', to: '/profile', icon: User },
];

export default function Landing() {
  const { user } = useAuth();

  // Redirect to dashboard if already logged in
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="landing-shell animate-fade">
      <div className="landing-grid-overlay" aria-hidden="true" />
      <div className="landing-glow landing-glow-left" aria-hidden="true" />
      <div className="landing-glow landing-glow-right" aria-hidden="true" />

      <header className="landing-header reveal reveal-1">
        <div className="landing-header-inner">
          <Link to="/" className="landing-brand" aria-label="AgriMitra 360 home">
            <span className="landing-brand-mark">
              <Sprout size={16} />
            </span>
            <span>AgriMitra 360</span>
          </Link>

          <nav className="landing-nav-links" aria-label="Primary navigation">
            {topNavItems.map((item) => (
              <Link key={item.label} to={item.to} className="landing-nav-link">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="landing-header-actions">
            <Link to="/login" className="landing-link-button">Sign In</Link>
            <Link to="/signup" className="landing-cta-soft">Get Started</Link>
          </div>
        </div>
      </header>

      <main className="landing-main-content">
        <section className="landing-hero reveal reveal-2">
          <span className="landing-chip">Digital Agronomist v2.0</span>

          <h1 className="landing-title">
            From <span className="landing-title-primary">Crop Health</span><br />
            to <span className="landing-title-secondary">Credit Wealth.</span>
          </h1>

          <p className="landing-subtitle reveal reveal-3">
            The bridge between field intelligence and financial confidence for Indian agriculture teams.
            Detect risk sooner, act faster, and carry stronger trust into every lender conversation.
          </p>

          <div className="landing-hero-actions reveal reveal-4">
            <Link to="/signup" className="landing-primary-button">
              Start Free Check
              <ArrowRight size={18} />
            </Link>
            <Link to="/dashboard" className="landing-secondary-button">Open Dashboard</Link>
          </div>

          <div className="landing-proof-strip reveal reveal-5" role="list" aria-label="Trust indicators">
            {proofItems.map((item) => (
              <p key={item} role="listitem">{item}</p>
            ))}
          </div>
        </section>

        <section className="landing-metric-stage reveal reveal-3" aria-label="Credit pulse summary">
          <div className="landing-metric-panel">
            <div className="landing-metric-icon">
              <Activity size={28} />
            </div>

            <p className="landing-metric-label">Credit Pulse Score</p>
            <p className="landing-metric-score">842</p>

            <div className="landing-metric-row">
              <article>
                <p>Crop Yield</p>
                <h3>Excellent</h3>
              </article>
              <article>
                <p>Loan Limit</p>
                <h3>₹5.2 Lakhs</h3>
              </article>
            </div>

            <div className="landing-floating-note landing-floating-note-top">
              <Leaf size={15} />
              <div>
                <strong>Disease Alert</strong>
                <span>Wheat Rust detected on Plot 4</span>
              </div>
            </div>

            <div className="landing-floating-note landing-floating-note-bottom">
              <BadgeCheck size={15} />
              <div>
                <strong>Bank Verified</strong>
                <span>Ready for disbursement review</span>
              </div>
            </div>
          </div>
        </section>

        <section className="landing-feature-section reveal reveal-4" aria-label="Platform capabilities">
          <div className="landing-section-head">
            <p className="landing-section-kicker">Platform Capabilities</p>
            <h2>The Digital Agronomist ecosystem for crop, risk, and credit readiness.</h2>
          </div>

          <div className="landing-feature-grid">
            {featureCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <article
                  key={card.title}
                  className={`landing-feature-card landing-accent-${card.accent} reveal reveal-${Math.min(6, index + 3)}`}
                >
                  <div className="landing-feature-icon">
                    <Icon size={20} />
                  </div>
                  <h3>{card.title}</h3>
                  <p>{card.copy}</p>
                  <Link to={card.to} className="landing-feature-link">
                    {card.cta}
                    <ArrowRight size={16} />
                  </Link>
                </article>
              );
            })}
          </div>
        </section>

        <section className="landing-bottom-cta reveal reveal-5">
          <div className="landing-bottom-cta-inner">
            <div>
              <p className="landing-section-kicker">Ready For This Season?</p>
              <h2>Turn daily farm signals into decisions your team and lenders can trust.</h2>
              <p>
                Use guided crop checks, transparent risk scoring, and verified progress records to
                improve outcomes and accelerate credit confidence.
              </p>
            </div>

            <div className="landing-bottom-actions">
              <Link to="/signup" className="landing-primary-button">
                Create Free Account
                <ArrowRight size={18} />
              </Link>
              <Link to="/chat" className="landing-utility-button">
                <MessageSquare size={17} />
                Speak To Support
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <div className="landing-footer-inner">
          <div>
            <h3>AgriMitra 360</h3>
            <p>
              Leading digital transformation in agriculture by combining trustworthy AI with
              credit-ready farm intelligence.
            </p>
          </div>
          <div className="landing-footer-links" aria-label="Footer links">
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/analytics">Analytics</Link>
            <Link to="/architecture">Architecture</Link>
            <Link to="/chat">Support</Link>
            <Link to="/profile">Profile</Link>
          </div>
        </div>
      </footer>

      <nav className="landing-mobile-nav" aria-label="Mobile quick navigation">
        {mobileTabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Link key={tab.label} to={tab.to} className="landing-mobile-link">
              <Icon size={16} />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
