import React from 'react';
// --- Optimization: Added Icon Pack Imports ---
// To fulfill the request for an icon pack, we import
// named components from a library like `lucide-react`.
import {
  Twitter,
  Linkedin,
  Instagram,
  Mail,
  MessageCircle,
  HelpCircle,
} from 'lucide-react';
import '../styles/Footer.css';

// --- Optimization: Data-Driven UI ---
// The `icon` property now holds the imported React component.
// We pass a `size` prop for consistent styling, which is
// more robust and explicit than relying on CSS font-size.
const socialLinks = [
  {
    href: '#',
    label: 'Visit our Twitter',
    // --- Change: Using icon component ---
    icon: <Twitter size={18} />,
  },
  {
    href: '#',
    label: 'Visit our Instagram',
    // --- Change: Using icon component ---
    icon: <Instagram size={18} />,
  },
  {
    href: '#',
    label: 'Visit our LinkedIn',
    // --- Change: Using icon component ---
    icon: <Linkedin size={18} />,
  },
];

const quickLinks = [
  { href: '#eyeglasses', label: 'Eyeglasses' },
  { href: '#sunglasses', label: 'Sunglasses' },
  { href: '#contact-lenses', label: 'Contact Lenses' },
  { href: '#home-eye-test', label: 'Home Eye Test' },
];

const supportLinks = [
  { href: '#help', label: 'Help Center' },
  { href: '#track-order', label: 'Track Order' },
  { href: '#store-locator', label: 'Store Locator' },
  { href: '#eye-care', label: 'Eye Care Tips' },
];

const contactItems = [
  // --- Change: Using icon component ---
  { icon: <Mail size={16} />, text: 'support@lenskart.com' },
  {
    icon: <MessageCircle size={16} />,
    text: 'Live Chat Available 24/7',
  },
  {
    icon: <HelpCircle size={16} />,
    text: 'Book Free Eye Checkup',
  },
];

const bottomLinks = [
  { href: '#privacy', label: 'Privacy Policy' },
  { href: '#terms', label: 'Terms of Service' },
  { href: '#warranty', label: 'Warranty Policy' },
];

// --- Optimization: Performance (Memoization) ---
// Still memoized as the content is static.
const Footer = React.memo(() => (
  <footer className="footer" id="footer">
    <div className="footer-container">
      <div className="footer-content">
        <div className="footer-section company-info">
          <h3 className="footer-logo">lenskart</h3>
          <p className="footer-description">
            Experience the joy of perfect vision with India's most trusted eyewear 
            destination. Quality frames, advanced lenses, and expert care delivered 
            to your doorstep.
          </p>
          <div className="social-links">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="social-link"
                // --- Optimization: Accessibility ---
                // This `aria-label` is CRITICAL. It provides the
                // accessible name for the icon-only link.
                aria-label={link.label}
              >
                {/* --- Change: Render the icon component --- */}
                {/* The icon component itself is automatically
                    marked as decorative (aria-hidden="true")
                    by the `lucide-react` library. */}
                {link.icon}
              </a>
            ))}
          </div>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul className="footer-links">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-section">
          <h4>Support</h4>
          <ul className="footer-links">
            {supportLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-section contact-section">
          <h4>Get in Touch</h4>
          <div className="contact-info">
            {contactItems.map((item) => (
              <div className="contact-item" key={item.text}>
                {/* --- Change: Render the icon component --- */}
                {/* We keep the `contact-icon` span as a
                    wrapper to respect the original CSS layout. */}
                <span className="contact-icon">{item.icon}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p>&copy; 2025 Lenskart. All rights reserved.</p>
          <div className="footer-bottom-links">
            {bottomLinks.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  </footer>
));

Footer.displayName = 'Footer';

export default Footer;