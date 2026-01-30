import Link from 'next/link';
import './styles/Homepage.css'; // We will create this next

export default function Home() {
  return (
    <div className="home-container">
      {/* NAVIGATION */}
      <nav className="navbar">
        <div className="logo">LYFE</div>
        <div className="nav-links">
          <Link href="#services">Services</Link>
          <Link href="#about">About Us</Link>
          <Link href="/login" className="btn-login">
            Portal Login
          </Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <header className="hero">
        <div className="hero-content">
          <h1>Find Your Peace. Reclaim Your Life.</h1>
          <p>
            Professional, compassionate mental health care tailored to your unique journey. 
            Connect with certified therapists today.
          </p>
          <div className="hero-buttons">
            <Link href="/login" className="btn-primary">
              Book Appointment
            </Link>
            <Link href="#about" className="btn-secondary">
              Learn More
            </Link>
          </div>
        </div>
        <div className="hero-image">
             {/* Simple placeholder or use an <img> if you have one */}
             <div className="image-placeholder">🌿</div>
        </div>
      </header>

      {/* SERVICES SECTION */}
      <section id="services" className="services">
        <h2>Our Services</h2>
        <div className="service-grid">
          <div className="service-card">
            <h3>Individual Therapy</h3>
            <p>One-on-one sessions to help you navigate personal challenges.</p>
          </div>
          <div className="service-card">
            <h3>Couples Counseling</h3>
            <p>Strengthen your relationship with guided communication tools.</p>
          </div>
          <div className="service-card">
            <h3>Psychiatry</h3>
            <p>Medical management for mental health conditions.</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <p>&copy; 2026 LYFE Mental Health Clinic. All rights reserved.</p>
      </footer>
    </div>
  );
}