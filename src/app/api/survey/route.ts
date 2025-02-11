import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { SurveyResponse } from '@/app/lib/mongodb';
import nodemailer from 'nodemailer';

// MongoDB connection function with timeout
const connectDB = async () => {
  try {
    console.log('Checking MongoDB connection state...');
    if (mongoose.connection.readyState >= 1) {
      console.log('MongoDB already connected');
      return;
    }
    
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined');
    }

    console.log('Initiating new MongoDB connection...');
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // 5 seconds timeout
      socketTimeoutMS: 45000, // 45 seconds timeout
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

export async function POST(request: Request) {
  console.log('=== Starting survey submission process ===');
  try {
    console.log('Parsing request body...');
    const body = await request.json();
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    console.log('Request parsed successfully, IP:', ip);

    // Run operations in parallel
    console.log('Starting parallel operations...');
    const [locationData] = await Promise.all([
      // Get IP location with shorter timeout (1.5s)
      (async () => {
        try {
          console.log('Fetching IP location data...');
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 1500);
          const geoResponse = await fetch(`https://ipapi.co/${ip}/json/`, {
            signal: controller.signal
          });
          clearTimeout(timeoutId);
          const geoData = await geoResponse.json();
          console.log('Location data fetched successfully:', geoData);
          return {
            country: geoData.country_name || 'Unknown',
            city: geoData.city || 'Unknown',
            region: geoData.region || 'Unknown',
            latitude: geoData.latitude || null,
            longitude: geoData.longitude || null
          };
        } catch (error) {
          console.error('IP location fetch failed:', error);
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
      (async () => {
        console.log('Initiating MongoDB connection...');
        await connectDB();
        console.log('MongoDB connection successful');
      })()
    ]);

    console.log('Preparing survey data for database...');
    const surveyData = {
      ...body,
      ipAddress: ip,
      geoLocation: locationData,
      submittedAt: new Date()
    };

    console.log('Creating survey document...');
    const surveyResponse = new SurveyResponse(surveyData);
    console.log('Saving survey to database...');
    await surveyResponse.save();
    console.log('Survey saved successfully to database');

    console.log('Configuring email transport...');
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

    console.log('Preparing to send email notification...');
    // Send email with a timeout
    const emailPromise = new Promise(async (resolve, reject) => {
      const timeoutId = setTimeout(() => {
        console.error('Email sending timed out');
        reject(new Error('Email timeout'));
      }, 5000);

      try {
        console.log('Sending email...');
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

    console.log('Waiting for email to send...');
    await emailPromise;
    console.log('=== Survey submission process completed successfully ===');

    return NextResponse.json({ 
      message: 'Survey response submitted successfully' 
    }, { status: 201 });

  } catch (error) {
    // Explicitly handle the error
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    console.error('Error in survey submission process:', errorMessage);
    if (error instanceof Error) {
      console.error('Error stack:', error.stack);
    }
    
    return NextResponse.json({ 
      error: 'Failed to save survey response',
      details: errorMessage
    }, { status: 500 });
  } finally {
    console.log('=== Survey submission process ended ===');
  }
}