// app/page.jsx (Landing Homepage)
'use client';

import { useRouter } from 'next/navigation';
import './landing.css';

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="landing-wrapper">
      <div className="floating-bg"></div>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content fade-in">
          <h1>🎧 Hire the Best <span>Music Artists</span></h1>
          <p>Discover & connect with talented musicians across the world.</p>
          <div className="hero-buttons">
            <button className="primary" onClick={() => router.push("/signup")}>Hire Now</button>
            <button className="secondary" onClick={() => router.push('/login')}>Login</button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about fade-in-up">
        <h2>About Us</h2>
        <p>
          We connect music creators with clients looking for quality, creativity, and passion. Our platform makes it easy to find the perfect artist for your event, track, or project.
        </p>
      </section>

      {/* Features Section */}
      <section className="features fade-in-up">
        <h2>Why Hire With Us?</h2>
        <div className="feature-cards">
          <div className="card">🎼 Verified Artists</div>
          <div className="card">💬 Direct Messaging</div>
          <div className="card">🔒 Secure Payments</div>
        </div>
      </section>

      {/* Featured Artists */}
      <section className="artists fade-in-up">
        <h2>Featured Artists</h2>
        <div className="artist-grid">
          <div className="artist-card">🎤 Mr.Pavan | Vocalist</div>
          <div className="artist-card">🎸 Kavi M | Guitarist</div>
          <div className="artist-card">🎧 DJ Flow | EDM</div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials fade-in-up">
        <h2>What People Say</h2>
        <div className="quotes">
          <blockquote>“Absolutely amazing experience!”</blockquote>
          <blockquote>“Top-tier artists. Easy process.”</blockquote>
          <blockquote>“Would 100% hire again!”</blockquote>
        </div>
      </section>

      {/* Contact */}
      <section className="contact fade-in-up">
        <h2>Contact Us</h2>
        <form onSubmit={e => e.preventDefault()}>
          <input type="text" placeholder="Your Name" required />
          <input type="email" placeholder="Your Email" required />
          <textarea placeholder="Your Message" required></textarea>
          <button type="submit">Send Message</button>
        </form>
      </section>

      {/* Footer */}
      <footer>
        <p>© {new Date().getFullYear()} MusicHire. All rights reserved.</p>
        <div className="socials">
          <a href="#">Instagram</a>
          <a href="#">YouTube</a>
          <a href="#">LinkedIn</a>
        </div>
      </footer>
    </div>
  );
}
