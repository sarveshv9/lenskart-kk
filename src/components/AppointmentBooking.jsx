import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, User, Phone, MessageSquare, Clock, AlertCircle, CheckCircle, Loader2, Info } from 'lucide-react';
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
    name: '',
    phone: '',
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
  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        if (value.length < 2) return 'Name must be at least 2 characters';
        if (!/^[a-zA-Z\s]+$/.test(value)) return 'Name should only contain letters';
        break;
      case 'phone':
        const cleanPhone = value.replace(/\s/g, '');
        if (!cleanPhone.startsWith('+')) return 'Phone must start with + and country code';
        if (!/^\+?[1-9]\d{7,14}$/.test(cleanPhone)) return 'Invalid phone number format';
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
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) errors[key] = error;
    });

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setTouched({ name: true, phone: true, service: true, date: true, time: true });
      return;
    }

    setLoading(true);
    setStatus('');
    setError(null);

    try {
      const response = await fetch('/api/send-whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setShowSuccess(true);
        setStatus('Appointment booked successfully! Check your WhatsApp for confirmation.');

        // Reset form after delay
        setTimeout(() => {
          setFormData({
            name: '',
            phone: '',
            service: 'Eye Exam',
            date: '',
            time: ''
          });
          setTouched({});
          setFieldErrors({});
          setShowSuccess(false);
        }, 5000);
      } else {
        setError(data.details || data.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('Connection error:', error);
      setError('Cannot connect to server. Make sure the backend is running on port 5000.');
    } finally {
      setLoading(false);
    }
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
            {/* Sandbox Info Banner */}
            <div className="sandbox-banner">
              <Info size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>Using Twilio Sandbox?</strong>
                Make sure you've joined the sandbox by sending "join &lt;your-sandbox-keyword&gt;" to the Twilio WhatsApp number first!
              </div>
            </div>

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

              {/* Phone Field */}
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