// Footer Component
import { LeafIcon } from './Icons';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer" role="contentinfo">
      <div className="footer-container">
        <div className="footer-brand">
          <div className="logo">
            <div className="icon-box logo-bg">
              <LeafIcon size={18} aria-hidden="true" />
            </div>
            <span className="logo-text">EcoTracker</span>
          </div>
          <p>Empowering cities and citizens through actionable environmental analytics.</p>
        </div>
        <div className="footer-bottom">
          <p>&copy; {currentYear} EcoTracker Project. All rights reserved .</p>
        </div>
      </div>
    </footer>
  );
}