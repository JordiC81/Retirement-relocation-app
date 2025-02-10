import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { SurveyResponse } from '@/app/lib/mongodb';
import nodemailer from 'nodemailer';

// MongoDB connection function
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
    // Connect to MongoDB
    await connectDB();
    console.log('Starting to process survey submission');
    
    const body = await request.json();
    console.log('Received request body:', body);
    
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    console.log('IP Address:', ip);

    // Get IP location with timeout
    let locationData = { 
      country: 'Unknown', 
      city: 'Unknown', 
      region: 'Unknown', 
      latitude: null, 
      longitude: null 
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      const geoResponse = await fetch(`https://ipapi.co/${ip}/json/`, {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (geoResponse.ok) {
        const geoData = await geoResponse.json();
        locationData = {
          country: geoData.country_name || 'Unknown',
          city: geoData.city || 'Unknown',
          region: geoData.region || 'Unknown',
          latitude: geoData.latitude || null,
          longitude: geoData.longitude || null
        };
        console.log('Location data fetched:', locationData);
      }
    } catch (error) {
      console.error('Error fetching location data:', error);
      // Continue with default location data
    }

    // Create new survey response with location data
    const surveyData = {
      ...body,
      ipAddress: ip,
      geoLocation: locationData,
      submittedAt: new Date()
    };

    console.log('Creating survey response');
    const surveyResponse = new SurveyResponse(surveyData);
    await surveyResponse.save();
    console.log('Survey response saved to database');

    // Configure email
    console.log('Configuring email transport');
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // Send notification email
    console.log('Sending notification email');
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
        <p><strong>Coordinates:</strong> ${locationData.latitude}, ${locationData.longitude}</p>
        <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
      `
    });
    console.log('Email sent successfully');

    return NextResponse.json({ 
      message: 'Survey response submitted successfully' 
    }, { status: 201 });

  } catch (error) {
    console.error('Detailed error:', error instanceof Error ? error.stack : error);
    return NextResponse.json({ 
      error: 'Failed to save survey response',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  } finally {
    // Optional: Close MongoDB connection if needed
    // await mongoose.connection.close();
  }
}