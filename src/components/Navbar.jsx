import { useState, useEffect, useRef } from 'react';
import { LeafIcon, MenuIcon, BarChartIcon, CalculatorIcon, Leaf2Icon } from './Icons';

const navItems = [
  { id: 'dashboard', label: 'City Dashboard', icon: BarChartIcon },
  { id: 'calculator', label: 'My Calculator', icon: CalculatorIcon },
  { id: 'how-it-works', label: 'How It Works', icon: Leaf2Icon },
];

export function Navbar({ activeSection, onSectionChange }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      onSectionChange(sectionId);
      setMobileMenuOpen(false);
    }
  };

  // Simple, reliable scroll handler
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 10);
          ticking = false;
        });
      }
    };

    // Initial check
    handleScroll();
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav 
      // ref={navbarRef}
      className={`navbar ${isScrolled ? 'scrolled' : ''}`} 
      role="navigation" 
      aria-label="Main navigation"
    >
      <div className="nav-container">
        <div className="logo" aria-label="EcoTracker Home">
          <div className="icon-box logo-bg">
            <LeafIcon size={22} aria-hidden="true" />
          </div>
          <span className="logo-text">EcoTracker</span>
        </div>

        <button
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-expanded={mobileMenuOpen}
          aria-controls="nav-links"
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          <MenuIcon size={24} aria-hidden="true" />
        </button>

        <ul className="nav-links" id="nav-links" role="menubar">
          {navItems.map(item => (
            <li key={item.id} role="none">
              <button
                role="menuitem"
                onClick={() => scrollToSection(item.id)}
                className={activeSection === item.id ? 'active' : ''}
                aria-current={activeSection === item.id ? 'page' : undefined}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', padding: '8px 12px', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-slate)', fontFamily: 'inherit', transition: 'all 0.2s' }}
              >
                <item.icon size={18} aria-hidden="true" style={{ color: activeSection === item.id ? 'var(--sky-blue)' : '#94A3B8', transition: 'color 0.2s' }} />
                {item.label}
              </button>
            </li>
          ))}
        </ul>

        <div className="nav-actions">
          <button className="btn-ghost" type="button">Sign In</button>
        </div>
      </div>
    </nav>
  );
}