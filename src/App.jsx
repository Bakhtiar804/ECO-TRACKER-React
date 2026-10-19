// Main App Component
import { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { Calculator } from './components/Calculator';
import { HowItWorks } from './components/HowItWorks';
import { Footer } from './components/Footer';
import './styles/main.css';

function App() {
  const [activeSection, setActiveSection] = useState('dashboard');

  // Handle scroll spy for active nav link
  useEffect(() => {
    const sections = ['dashboard', 'calculator', 'how-it-works'];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: [0.3, 0.5, 0.7], rootMargin: '-100px 0px -60% 0px' }
    );

    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Smooth scroll to section
  const scrollToSection = useCallback((sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
    }
  }, []);

  return (
    <div className="app">
      <Navbar activeSection={activeSection} onSectionChange={scrollToSection} />

      <Dashboard />
      <Calculator />
      <HowItWorks />

      <Footer />
    </div>
  );
}

export default App;