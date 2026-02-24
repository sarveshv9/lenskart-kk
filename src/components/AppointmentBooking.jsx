import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, User, Phone, MessageSquare, Clock, AlertCircle, CheckCircle, Loader2, Info, Mail } from 'lucide-react';
import emailjs from '@emailjs/browser';
import '../styles/AppointmentBooking.css';

const ACCENT_COLORS = {
  primary: '#0E2A4F',
  secondary: '#0B3A44',
  dark: '#050607',
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6'
};

const AppointmentBooking = () => {
  const [formData, setFormData] = useState({
    method: 'whatsapp', // 'whatsapp' or 'email'
    name: '',
    phone: '',
    email: '',
    service: 'Eye Exam',
    date: '',
    time: ''
  });
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [touched, setTouched] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  // Set minimum date to today
  const today = new Date().toISOString().split('T')[0];

  // Validate individual fields
  const validateField = (name, value, method = formData.method) => {
    switch (name) {
      case 'name':
        if (value.length < 2) return 'Name must be at least 2 characters';
        if (!/^[a-zA-Z\s]+$/.test(value)) return 'Name should only contain letters';
        break;
      case 'phone':
        if (method === 'whatsapp') {
          const cleanPhone = value.replace(/\s/g, '');
          if (!cleanPhone.startsWith('+')) return 'Phone must start with + and country code';
          if (!/^\+?[1-9]\d{7,14}$/.test(cleanPhone)) return 'Invalid phone number format';
        }
        break;
      case 'email':
        if (method === 'email') {
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address';
        }
        break;
      case 'date':
        if (value < today) return 'Date cannot be in the past';
        break;
      case 'time':
        if (!value) return 'Please select a time';
        break;
    }
    return null;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError(null);

    // Real-time validation
    if (touched[name]) {
      const error = validateField(name, value);
      setFieldErrors({ ...fieldErrors, [name]: error });
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });
    const error = validateField(name, value);
    setFieldErrors({ ...fieldErrors, [name]: error });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    const errors = {};
    const fieldsToValidate = ['name', 'service', 'date', 'time', formData.method === 'whatsapp' ? 'phone' : 'email'];

    fieldsToValidate.forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) errors[key] = error;
    });

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setTouched(fieldsToValidate.reduce((acc, key) => ({ ...acc, [key]: true }), {}));
      return;
    }

    setLoading(true);
    setStatus('');
    setError(null);

    try {
      if (formData.method === 'whatsapp') {
        // --- WHATSAPP TWILIO LOGIC ---
        const response = await fetch('/api/send-whatsapp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        let data;
        const text = await response.text();
        try {
          data = JSON.parse(text);
        } catch (e) {
          throw new Error(`Server returned non-JSON response: ${text.substring(0, 50)}...`);
        }

        if (response.ok) {
          handleSuccess('Appointment booked successfully! Check your WhatsApp for confirmation.');
        } else {
          setError(data.details || data.error || 'Failed to send WhatsApp message');
        }
      } else {
        // --- EMAILJS LOGIC ---
        // Pull credentials from Vite environment variables
        const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
        const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
        const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

        // Format date nicely for email
        const formattedDate = new Date(formData.date).toLocaleDateString('en-US', {
          weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        });

        // The template variables must match what you define in EmailJS template builder
        const templateParams = {
          to_name: formData.name,
          to_email: formData.email,
          service: formData.service,
          date: formattedDate,
          time: formData.time
        };

        try {
          // Send via EmailJS API. 
          // Note: Will throw an error until credentials are valid
          await emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_ID,
            templateParams,
            EMAILJS_PUBLIC_KEY
          );
          handleSuccess('Appointment booked successfully! Check your Email for confirmation.');
        } catch (emailError) {
          console.error("EmailJS Error:", emailError);
          // Special fallback message for unconfigured setup
          if (emailError.text && emailError.text.includes('invalid')) {
            setError('Developer Notice: EmailJS credentials not yet configured in AppointmentBooking.jsx');
          } else {
            setError(`Failed to send email: ${emailError.text || emailError.message}`);
          }
        }
      }
    } catch (error) {
      console.error('Connection/Parsing error:', error);
      setError(`Cannot process request: ${error.message}. If on Vercel, check the logs.`);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = (message) => {
    setShowSuccess(true);
    setStatus(message);
    setTimeout(() => {
      setFormData(prev => ({
        ...prev,
        name: '',
        phone: '',
        email: '',
        date: '',
        time: ''
      }));
      setTouched({});
      setFieldErrors({});
      setShowSuccess(false);
    }, 5000);
  };

  const services = [
    { value: 'Eye Exam', icon: '👁️', description: 'Comprehensive eye examination' },
    { value: 'Frame Fitting', icon: '👓', description: 'Find your perfect frames' },
    { value: 'Contact Lens Consultation', icon: '🔍', description: 'Expert lens guidance' }
  ];

  return (
    <div className="appointment-container">
      {/* Background blobs */}
      <div className="appointment-bg">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>

      <div className="appointment-header">
        <button
          onClick={() => window.history.back()}
          className="glass-btn"
        >
          <ArrowLeft size={20} /> Back
        </button>
      </div>

      <div className="appointment-content">
        <div className="glass-panel" style={{ padding: '2.5rem 2rem' }}>
          {/* Main Header */}
          <div className="appointment-title-area">
            <div className="appointment-subtitle">
              Services
            </div>
            <h1 className="appointment-title">
              Book Your Consultation
            </h1>
            <p className="appointment-description">
              Schedule your appointment and receive instant WhatsApp confirmation
            </p>
          </div>

          {/* Form Content */}
          <div>
            {/* Method Toggle */}
            <div className="method-toggle">
              <label className="field-label">How would you like to receive confirmation?</label>
              <div className="method-options">
                <button
                  type="button"
                  className={`method-btn ${formData.method === 'whatsapp' ? 'active' : ''}`}
                  onClick={() => {
                    setFormData({ ...formData, method: 'whatsapp' });
                    setError(null);
                  }}
                >
                  <MessageSquare size={18} /> WhatsApp
                </button>
                <button
                  type="button"
                  className={`method-btn ${formData.method === 'email' ? 'active' : ''}`}
                  onClick={() => {
                    setFormData({ ...formData, method: 'email' });
                    setError(null);
                  }}
                >
                  <Mail size={18} /> Email
                </button>
              </div>
            </div>

            {/* Sandbox Info Banner - Only show if WhatsApp is selected */}
            {formData.method === 'whatsapp' && (
              <div className="sandbox-banner">
                <Info size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong>Using Twilio Sandbox?</strong>
                  Make sure you've joined the sandbox by sending "join &lt;your-sandbox-keyword&gt;" to the Twilio WhatsApp number first!
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="appointment-form">
              {/* Name Field */}
              <FormField
                label="Full Name"
                icon={<User size={18} />}
                error={touched.name && fieldErrors.name}
              >
                <input
                  type="text"
                  name="name"
                  required
                  className={`glass-input ${touched.name && fieldErrors.name ? 'has-error' : ''}`}
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter your full name"
                />
              </FormField>

              {/* Conditional Contact Field */}
              {formData.method === 'whatsapp' ? (
                <FormField
                  label="WhatsApp Number"
                  icon={<Phone size={18} />}
                  helper="Include country code with + (e.g., +919876543210)"
                  error={touched.phone && fieldErrors.phone}
                >
                  <input
                    type="tel"
                    name="phone"
                    required
                    className={`glass-input ${touched.phone && fieldErrors.phone ? 'has-error' : ''}`}
                    value={formData.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="+919876543210"
                  />
                </FormField>
              ) : (
                <FormField
                  label="Email Address"
                  icon={<Mail size={18} />}
                  error={touched.email && fieldErrors.email}
                >
                  <input
                    type="email"
                    name="email"
                    required
                    className={`glass-input ${touched.email && fieldErrors.email ? 'has-error' : ''}`}
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="you@example.com"
                  />
                </FormField>
              )}

              {/* Service Selection */}
              <FormField
                label="Select Service"
                icon={<MessageSquare size={18} />}
              >
                <div className="service-options">
                  {services.map((service) => (
                    <label
                      key={service.value}
                      className={`service-label ${formData.service === service.value ? 'selected' : ''}`}
                    >
                      <input
                        type="radio"
                        name="service"
                        value={service.value}
                        checked={formData.service === service.value}
                        onChange={handleChange}
                        style={{ display: 'none' }}
                      />
                      <span className="service-icon">{service.icon}</span>
                      <div className="service-info">
                        <div className="service-name">
                          {service.value}
                        </div>
                        <div className="service-desc">
                          {service.description}
                        </div>
                      </div>
                      {formData.service === service.value && (
                        <CheckCircle size={20} className="service-check" />
                      )}
                    </label>
                  ))}
                </div>
              </FormField>

              {/* Date and Time */}
              <div className="date-time-grid">
                <FormField
                  label="Date"
                  icon={<Calendar size={18} />}
                  error={touched.date && fieldErrors.date}
                >
                  <input
                    type="date"
                    name="date"
                    required
                    min={today}
                    className={`glass-input ${touched.date && fieldErrors.date ? 'has-error' : ''}`}
                    value={formData.date}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </FormField>

                <FormField
                  label="Time"
                  icon={<Clock size={18} />}
                  error={touched.time && fieldErrors.time}
                >
                  <input
                    type="time"
                    name="time"
                    required
                    className={`glass-input ${touched.time && fieldErrors.time ? 'has-error' : ''}`}
                    value={formData.time}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </FormField>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || showSuccess}
                className="submit-btn"
              >
                {loading && <Loader2 size={20} className="spin-icon" />}
                {showSuccess && <CheckCircle size={20} />}
                {loading ? 'Sending...' : showSuccess ? 'Confirmed!' : 'Confirm Appointment'}
              </button>

              {/* Success Message */}
              {status && (
                <div className="form-alert alert-success">
                  <CheckCircle size={22} />
                  <span>{status}</span>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="form-alert alert-error">
                  <AlertCircle size={22} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{error}</span>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div >
  );
};

// Helper Components
const FormField = ({ label, icon, helper, error, children }) => (
  <div className="form-field-wrapper">
    <label className="field-label">
      <span style={{ opacity: 0.8 }}>{icon}</span>
      {label}
    </label>
    {children}
    {helper && !error && (
      <small className="field-helper">
        {helper}
      </small>
    )}
    {error && (
      <small className="field-error-msg">
        <AlertCircle size={14} />
        {error}
      </small>
    )}
  </div>
);

export default AppointmentBooking;