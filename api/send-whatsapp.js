import twilio from 'twilio';

export default async function handler(req, res) {
    // CORS configuration for Vercel Serverless
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    // Handle preflight request
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const configTwilioNumber = process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886';
    const twilioWhatsAppNumber = configTwilioNumber.startsWith('whatsapp:') ? configTwilioNumber : `whatsapp:${configTwilioNumber}`;

    let client;
    if (accountSid && authToken) {
        try {
            client = twilio(accountSid, authToken);
        } catch (error) {
            console.error('Failed to initialize Twilio:', error);
            return res.status(500).json({ error: 'Twilio Client Initialization Failed' });
        }
    } else {
        return res.status(500).json({ error: 'Twilio credentials missing in Environment Variables' });
    }

    try {
        const { name, phone, service, date, time } = req.body;

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
                details: 'Phone number must start with + and country code (e.g., +91XXXXXXXXXX)'
            });
        }

        // Format phone number and date
        const formattedPhone = phone.startsWith('whatsapp:') ? phone : `whatsapp:${phone}`;
        const appointmentDate = new Date(date);
        const formattedDate = appointmentDate.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // Handle Demo mode parsing based on Vercel Environment logic
        // We treat USE_REAL_TWILIO boolean evaluation strictly
        const isDemoMode = process.env.NODE_ENV === 'development' && process.env.USE_REAL_TWILIO !== 'true';

        if (isDemoMode) {
            console.log('📱 DEMO MODE - WhatsApp message not sent to:', formattedPhone);
            await new Promise(resolve => setTimeout(resolve, 1000));
            return res.status(200).json({
                success: true,
                message: '[DEMO] Appointment booked successfully! (No actual message sent)',
                demo: true
            });
        }

        console.log('📤 Sending WhatsApp message to:', formattedPhone);
        let message;

        try {
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
                message = await client.messages.create({
                    from: twilioWhatsAppNumber,
                    body: `🎉 Appointment Confirmed!\n\nHi ${name},\nYour ${service} is scheduled for:\n📅 ${formattedDate}\n⏰ ${time}\n\nThank you for choosing our Optical Shop!\n\nReply STOP to unsubscribe.`,
                    to: formattedPhone
                });
            }

            console.log('✅ WhatsApp message sent! SID:', message.sid);

        } catch (twilioError) {
            console.error('❌ Twilio API error:', twilioError);

            if (twilioError.code === 21211) {
                return res.status(400).json({ error: 'Invalid phone number format' });
            } else if (twilioError.code === 21608) {
                return res.status(400).json({ error: 'Sandbox opt-in required (Join sandbox on WhatsApp first)' });
            } else if (twilioError.code === 21910) {
                return res.status(400).json({ error: 'Format mismatch (WhatsApp vs SMS string mismatch)' });
            }

            return res.status(500).json({ error: 'Twilio API error', details: twilioError.message, code: twilioError.code });
        }

        // Success response
        res.status(200).json({
            success: true,
            message: 'Appointment confirmed! Check your WhatsApp for details.',
            messageSid: message.sid
        });

    } catch (error) {
        console.error('💥 Server error:', error);
        res.status(500).json({
            error: 'Server error',
            details: error.message
        });
    }
}
