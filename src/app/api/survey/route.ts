import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { SurveyResponse } from '@/app/lib/mongodb';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const ip = request.headers.get('x-forwarded-for') || 'unknown';

    // Connect to MongoDB if not already connected
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI!);
    }

    // Get IP location
    let locationData = { country: 'Unknown', city: 'Unknown', region: 'Unknown', latitude: null, longitude: null };
    try {
      const geoResponse = await fetch(`https://ipapi.co/${ip}/json/`);
      const geoData = await geoResponse.json();
      locationData = {
        country: geoData.country_name,
        city: geoData.city,
        region: geoData.region,
        latitude: geoData.latitude,
        longitude: geoData.longitude
      };
    } catch (error) {
      console.error('Error fetching location data:', error);
    }

    // Create new survey response with location data
    const surveyData = {
      ...body,
      ipAddress: ip,
      geoLocation: locationData
    };

    const surveyResponse = new SurveyResponse(surveyData);
    await surveyResponse.save();

    // Configure email
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // Send notification email
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

    return NextResponse.json({ 
      message: 'Survey response submitted successfully' 
    }, { status: 201 });

  } catch (error) {
    console.error('Error saving survey response:', error);
    return NextResponse.json({ 
      error: 'Failed to save survey response' 
    }, { status: 500 });
  }
}