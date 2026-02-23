import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, User, Phone, MessageSquare, Clock, AlertCircle, CheckCircle, Loader2, Info } from 'lucide-react';

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
    <div style={{
      fontFamily: 'system-ui, -apple-system, sans-serif',
      background: '#ffffff',
      minHeight: '100vh',
      padding: '2rem 1rem'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto 3rem',
        padding: '0 1rem',
        display: 'flex'
      }}>
        <button
          onClick={() => window.history.back()}
          style={{
            background: 'transparent',
            border: 'none',
            color: ACCENT_COLORS.primary,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '500',
            padding: '0.5rem',
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
        >
          <ArrowLeft size={20} /> Back
        </button>
      </div>

      <div style={{ maxWidth: '650px', margin: '0 auto', padding: '0 1rem' }}>

        {/* Main Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{
            color: ACCENT_COLORS.primary,
            fontSize: '0.85rem',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginBottom: '1rem'
          }}>
            Services
          </div>
          <h1 style={{
            fontSize: 'clamp(1.75rem, 5vw, 2.5rem)',
            fontWeight: '400',
            color: ACCENT_COLORS.dark,
            marginBottom: '0.5rem',
            lineHeight: 1.2
          }}>
            Book Your Consultation
          </h1>
          <p style={{
            margin: 0,
            color: '#666',
            fontSize: '1rem'
          }}>
            Schedule your appointment and receive instant WhatsApp confirmation
          </p>
        </div>

        {/* Form Content */}
        <div>
          {/* Sandbox Info Banner */}
          <div style={{
            background: 'linear-gradient(135deg, #FFF9E6 0%, #FFF4CC 100%)',
            border: '1px solid #FFE69C',
            padding: '1rem 1.25rem',
            marginBottom: '2rem',
            borderRadius: '12px',
            fontSize: '0.9rem',
            color: '#856404',
            display: 'flex',
            gap: '12px',
            alignItems: 'flex-start'
          }}>
            <Info size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong style={{ display: 'block', marginBottom: '4px' }}>Using Twilio Sandbox?</strong>
              Make sure you've joined the sandbox by sending "join &lt;your-sandbox-keyword&gt;" to the Twilio WhatsApp number first!
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
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
                style={getInputStyle(touched.name && fieldErrors.name)}
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
                style={getInputStyle(touched.phone && fieldErrors.phone)}
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {services.map((service) => (
                  <label
                    key={service.value}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '1rem',
                      border: `1px solid ${formData.service === service.value ? ACCENT_COLORS.primary : '#d1d5db'}`,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      background: formData.service === service.value ? `${ACCENT_COLORS.primary}05` : 'white',
                    }}
                    onMouseEnter={(e) => {
                      if (formData.service !== service.value) {
                        e.currentTarget.style.background = '#f9fafb';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (formData.service !== service.value) {
                        e.currentTarget.style.background = 'white';
                      }
                    }}
                  >
                    <input
                      type="radio"
                      name="service"
                      value={service.value}
                      checked={formData.service === service.value}
                      onChange={handleChange}
                      style={{ display: 'none' }}
                    />
                    <span style={{ fontSize: '1.5rem' }}>{service.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '600', color: ACCENT_COLORS.dark, marginBottom: '2px' }}>
                        {service.value}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                        {service.description}
                      </div>
                    </div>
                    {formData.service === service.value && (
                      <CheckCircle size={20} color={ACCENT_COLORS.primary} />
                    )}
                  </label>
                ))}
              </div>
            </FormField>

            {/* Date and Time */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
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
                  style={getInputStyle(touched.date && fieldErrors.date)}
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
                  style={getInputStyle(touched.time && fieldErrors.time)}
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
              style={{
                width: '100%',
                background: loading || showSuccess ? '#94a3b8' : ACCENT_COLORS.primary,
                color: 'white',
                border: 'none',
                padding: '1rem 2rem',
                fontSize: '1rem',
                fontWeight: '500',
                cursor: loading || showSuccess ? 'not-allowed' : 'pointer',
                transition: 'opacity 0.2s',
                marginTop: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
              }}
              onMouseEnter={(e) => {
                if (!loading && !showSuccess) {
                  e.currentTarget.style.opacity = '0.9';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading && !showSuccess) {
                  e.currentTarget.style.opacity = '1';
                }
              }}
            >
              {loading && <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />}
              {showSuccess && <CheckCircle size={20} />}
              {loading ? 'Sending...' : showSuccess ? 'Confirmed!' : 'Confirm Appointment'}
            </button>

            {/* Success Message */}
            {status && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '1rem 1.25rem',
                background: 'linear-gradient(135deg, #D4EDDA 0%, #C3E6CB 100%)',
                border: `1px solid ${ACCENT_COLORS.success}`,
                borderRadius: '10px',
                color: '#155724',
                animation: 'slideIn 0.3s ease-out',
                fontWeight: '500'
              }}>
                <CheckCircle size={22} color={ACCENT_COLORS.success} />
                <span>{status}</span>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                padding: '1rem 1.25rem',
                background: 'linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%)',
                border: `1px solid ${ACCENT_COLORS.error}`,
                borderRadius: '10px',
                color: '#991B1B',
                animation: 'slideIn 0.3s ease-out'
              }}>
                <AlertCircle size={22} color={ACCENT_COLORS.error} style={{ flexShrink: 0, marginTop: '2px' }} />
                <span style={{ fontSize: '0.95rem' }}>{error}</span>
              </div>
            )}
          </form>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        input[type="date"]::-webkit-calendar-picker-indicator,
        input[type="time"]::-webkit-calendar-picker-indicator {
          cursor: pointer;
          filter: opacity(0.6);
        }

        input[type="date"]::-webkit-calendar-picker-indicator:hover,
        input[type="time"]::-webkit-calendar-picker-indicator:hover {
          filter: opacity(1);
        }
      `}</style>
    </div >
  );
};

// Helper Components
const FormField = ({ label, icon, helper, error, children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
    <label style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '0.9rem',
      fontWeight: '600',
      color: ACCENT_COLORS.dark,
      marginBottom: '0.25rem'
    }}>
      {icon}
      {label}
    </label>
    {children}
    {helper && !error && (
      <small style={{ color: '#6b7280', fontSize: '0.85rem', marginTop: '-0.25rem' }}>
        {helper}
      </small>
    )}
    {error && (
      <small style={{
        color: ACCENT_COLORS.error,
        fontSize: '0.85rem',
        marginTop: '-0.25rem',
        display: 'flex',
        alignItems: 'center',
        gap: '4px'
      }}>
        <AlertCircle size={14} />
        {error}
      </small>
    )}
  </div>
);

const getInputStyle = (hasError) => ({
  width: '100%',
  padding: '0.875rem 1rem',
  border: `1px solid ${hasError ? ACCENT_COLORS.error : '#d1d5db'}`,
  fontSize: '0.95rem',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'all 0.2s',
  background: hasError ? '#FEF2F2' : 'white',
  fontFamily: 'inherit'
});

export default AppointmentBooking;