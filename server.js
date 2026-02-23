// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import twilio from 'twilio';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// CORS configuration - VERY IMPORTANT FOR LOCAL DEVELOPMENT
const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:8080'],
  methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Handle preflight requests for all routes
app.options('*', cors(corsOptions));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test endpoint to verify CORS is working
app.get('/api/test-cors', (req, res) => {
  res.json({
    message: 'CORS is working!',
    timestamp: new Date().toISOString(),
    allowedOrigins: corsOptions.origin
  });
});

// Twilio configuration
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioWhatsAppNumber = process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886';

// Initialize Twilio client
let client;
if (accountSid && authToken) {
  try {
    client = twilio(accountSid, authToken);
    console.log('✅ Twilio client initialized');
  } catch (error) {
    console.error('❌ Failed to initialize Twilio:', error.message);
  }
} else {
  console.warn('⚠️ Twilio credentials missing. Set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN in .env');
}

// API endpoint to send WhatsApp message
app.post('/api/send-whatsapp', async (req, res) => {
  // Set CORS headers for this specific endpoint
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  
  try {
    // Check if Twilio is configured
    if (!client) {
      return res.status(500).json({
        error: 'Twilio not configured',
        details: 'Please check your .env file for TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN'
      });
    }

    const { name, phone, service, date, time } = req.body;
    console.log('📨 Received appointment request:', { name, phone: phone?.substring(0, 6) + '...', service, date, time });

    // Validate required fields
    const missingFields = [];
    if (!name) missingFields.push('name');
    if (!phone) missingFields.push('phone');
    if (!service) missingFields.push('service');
    if (!date) missingFields.push('date');
    if (!time) missingFields.push('time');
    
    if (missingFields.length > 0) {
      return res.status(400).json({ 
        error: 'Missing fields',
        details: `Please provide: ${missingFields.join(', ')}`,
        missingFields
      });
    }

    // Validate phone format
    if (!phone.startsWith('+')) {
      return res.status(400).json({
        error: 'Invalid phone format',
        details: 'Phone number must start with + and country code (e.g., +91XXXXXXXXXX)',
        example: '+919876543210'
      });
    }

    // Format phone number
    const formattedPhone = phone.startsWith('whatsapp:') ? phone : `whatsapp:${phone}`;

    // Format date for display
    const appointmentDate = new Date(date);
    const formattedDate = appointmentDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // For development/demo - log instead of sending actual message
    if (process.env.NODE_ENV === 'development' && !process.env.USE_REAL_TWILIO) {
      console.log('\n📱 DEMO MODE - WhatsApp message not sent');
      console.log('To:', formattedPhone);
      console.log('Message:', {
        name,
        service,
        date: formattedDate,
        time
      });
      
      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return res.status(200).json({
        success: true,
        message: '[DEMO] Appointment booked successfully! (No actual message sent)',
        demo: true,
        appointment: {
          name,
          phone: formattedPhone,
          service,
          date: formattedDate,
          time
        }
      });
    }

    // REAL MODE - Send actual WhatsApp message
    console.log('📤 Sending WhatsApp message to:', formattedPhone);
    
    let message;
    try {
      // Try using template if available
      if (process.env.TWILIO_CONTENT_SID) {
        message = await client.messages.create({
          from: twilioWhatsAppNumber,
          contentSid: process.env.TWILIO_CONTENT_SID,
          contentVariables: JSON.stringify({
            "1": name,
            "2": service,
            "3": formattedDate,
            "4": time,
            "5": "Optical Shop"
          }),
          to: formattedPhone
        });
      } else {
        // Fallback to regular message
        message = await client.messages.create({
          from: twilioWhatsAppNumber,
          body: `🎉 Appointment Confirmed!\n\nHi ${name},\nYour ${service} is scheduled for:\n📅 ${formattedDate}\n⏰ ${time}\n\nThank you for choosing our Optical Shop!\n\nReply STOP to unsubscribe.`,
          to: formattedPhone
        });
      }
      
      console.log('✅ WhatsApp message sent! SID:', message.sid);

    } catch (twilioError) {
      console.error('❌ Twilio API error:', {
        code: twilioError.code,
        message: twilioError.message,
        moreInfo: twilioError.moreInfo
      });
      
      // User-friendly error messages
      if (twilioError.code === 21211) {
        return res.status(400).json({
          error: 'Invalid phone number',
          details: 'Please check the phone number format (include country code with +)'
        });
      } else if (twilioError.code === 21608) {
        return res.status(400).json({
          error: 'Sandbox opt-in required',
          details: 'Please send "join [sandbox-keyword]" to the Twilio WhatsApp number first',
          solution: 'Open WhatsApp and send the join message to activate the sandbox'
        });
      } else if (twilioError.code === 63007) {
        return res.status(400).json({
          error: 'Template error',
          details: 'The message template is not properly configured'
        });
      }
      
      // Generic Twilio error
      return res.status(500).json({
        error: 'Twilio API error',
        details: twilioError.message,
        code: twilioError.code
      });
    }

    // Success response
    res.status(200).json({
      success: true,
      message: 'Appointment confirmed! Check your WhatsApp for details.',
      messageSid: message.sid,
      appointment: {
        name,
        service,
        date: formattedDate,
        time,
        phone: phone // Return masked phone for security
      }
    });

  } catch (error) {
    console.error('💥 Server error:', error);
    
    res.status(500).json({
      error: 'Server error',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'WhatsApp Appointment Service',
    timestamp: new Date().toISOString(),
    cors: {
      allowedOrigins: corsOptions.origin,
      methods: corsOptions.methods
    },
    twilio: client ? 'configured' : 'not_configured',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Debug endpoint for checking environment
app.get('/api/env-check', (req, res) => {
  // Safe logging - don't expose full tokens
  const maskedSid = process.env.TWILIO_ACCOUNT_SID 
    ? `AC...${process.env.TWILIO_ACCOUNT_SID.slice(-4)}` 
    : 'not_set';
  
  res.json({
    node: process.version,
    serverTime: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    port: process.env.PORT,
    twilio: {
      accountSid: maskedSid,
      hasAuthToken: !!process.env.TWILIO_AUTH_TOKEN,
      whatsappNumber: process.env.TWILIO_WHATSAPP_NUMBER,
      hasContentSid: !!process.env.TWILIO_CONTENT_SID
    }
  });
});

// Start server
app.listen(port, () => {
  console.log('\n' + '='.repeat(50));
  console.log('🚀 APPOINTMENT BOOKING SERVER');
  console.log('='.repeat(50));
  console.log(`✅ Server running on http://localhost:${port}`);
  console.log(`🔗 Frontend should be at http://localhost:5173`);
  console.log(`📞 API endpoint: POST http://localhost:${port}/api/send-whatsapp`);
  console.log(`🩺 Health check: GET http://localhost:${port}/api/health`);
  console.log(`🧪 CORS test: GET http://localhost:${port}/api/test-cors`);
  
  if (client) {
    console.log(`🔐 Twilio: ✅ Configured`);
    console.log(`   Using WhatsApp number: ${twilioWhatsAppNumber}`);
    
    if (process.env.NODE_ENV === 'development' && !process.env.USE_REAL_TWILIO) {
      console.log(`   ⚠️  DEMO MODE: WhatsApp messages will be logged but not sent`);
      console.log(`   To enable real messages, set USE_REAL_TWILIO=true in .env`);
    }
  } else {
    console.log(`⚠️  Twilio: ❌ NOT CONFIGURED`);
    console.log(`   To configure, create a .env file with:`);
    console.log(`   TWILIO_ACCOUNT_SID=your_account_sid`);
    console.log(`   TWILIO_AUTH_TOKEN=your_auth_token`);
    console.log(`   TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886`);
    console.log(`   (Get credentials from https://console.twilio.com)`);
  }
  console.log('='.repeat(50) + '\n');
});