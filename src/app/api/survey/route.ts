import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { SurveyResponse } from '@/app/lib/mongodb';
import nodemailer from 'nodemailer';

// MongoDB connection function with timeout
const connectDB = async () => {
  try {
    if (mongoose.connection.readyState >= 1) return;
    
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined');
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

export async function POST(request: Request) {
  try {
    console.log('Starting request processing');
    const body = await request.json();
    const ip = request.headers.get('x-forwarded-for') || 'unknown';

    // Run operations in parallel
    const [locationData] = await Promise.all([
      // Get IP location with shorter timeout (1.5s)
      (async () => {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 1500);
          const geoResponse = await fetch(`https://ipapi.co/${ip}/json/`, {
            signal: controller.signal
          });
          clearTimeout(timeoutId);
          const geoData = await geoResponse.json();
          console.log('Location data fetched successfully');
          return {
            country: geoData.country_name || 'Unknown',
            city: geoData.city || 'Unknown',
            region: geoData.region || 'Unknown',
            latitude: geoData.latitude || null,
            longitude: geoData.longitude || null
          };
        } catch (error) {
          console.log('IP location fetch failed, using defaults');
          return {
            country: 'Unknown',
            city: 'Unknown',
            region: 'Unknown',
            latitude: null,
            longitude: null
          };
        }
      })(),
      // Connect to MongoDB
      connectDB()
    ]);

    console.log('Saving survey response to database');
    // Save survey response
    const surveyData = {
      ...body,
      ipAddress: ip,
      geoLocation: locationData,
      submittedAt: new Date()
    };

    const surveyResponse = new SurveyResponse(surveyData);
    await surveyResponse.save();
    console.log('Survey response saved successfully');

    console.log('Configuring email transport');
    // Configure and send email
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    console.log('Sending email notification');
    // Send email with a timeout
    const emailPromise = new Promise(async (resolve, reject) => {
      const timeoutId = setTimeout(() => reject(new Error('Email timeout')), 5000);
      try {
        await transporter.sendMail({
          from: process.env.SMTP_FROM,
          to: process.env.NOTIFICATION_EMAIL,
          subject: 'New Retirement Survey Response',
          html: `
            <h2>New Survey Response Received</h2>
            
            <h3>Contact Information</h3>
            <p><strong>Email:</strong> ${body.email}</p>
            
            <h3>Survey Response</h3>
            <p><strong>Help Request:</strong> ${body.helpRequest}</p>
            
            <h3>Countries of Interest</h3>
            <p><strong>Selected Countries:</strong> ${body.interestedCountries.join(', ')}</p>
            
            <h3>Information Requests</h3>
            <p><strong>Desired Information:</strong> ${body.desiredInformation.join(', ')}</p>
            
            <h3>Additional Information</h3>
            <p><strong>Comments:</strong> ${body.additionalComments || 'None provided'}</p>
            
            <h3>Submission Details</h3>
            <p><strong>IP Address:</strong> ${ip}</p>
            <p><strong>Location:</strong> ${locationData.city}, ${locationData.country}</p>
            <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
          `
        });
        clearTimeout(timeoutId);
        console.log('Email sent successfully');
        resolve(true);
      } catch (error) {
        clearTimeout(timeoutId);
        console.error('Email sending failed:', error);
        reject(error);
      }
    });

    await emailPromise;

    return NextResponse.json({ 
      message: 'Survey response submitted successfully' 
    }, { status: 201 });

  } catch (error: unknown) {
    // Explicitly handle the error
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    console.error('Error processing survey request:', errorMessage);
    
    return NextResponse.json({ 
      error: 'Failed to save survey response',
      details: errorMessage
    }, { status: 500 });
  } finally {
    console.log('Request processing completed');
  }
}