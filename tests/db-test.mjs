// tests/db-test.mjs
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define the schema here since we can't import from src directory in test
const locationSchema = new mongoose.Schema({
  country: String,
  city: String,
  region: String,
  latitude: Number,
  longitude: Number
});

const surveyResponseSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  helpRequest: {
    type: String,
    required: true
  },
  interestedCountries: [{
    type: String
  }],
  desiredInformation: [{
    type: String
  }],
  additionalComments: String,
  ipAddress: {
    type: String,
    required: true
  },
  geoLocation: {
    type: locationSchema,
    required: true
  }
}, {
  timestamps: true
});

const SurveyResponse = mongoose.models.SurveyResponse || 
  mongoose.model('SurveyResponse', surveyResponseSchema);

async function testConnection() {
  try {
    // Connect to MongoDB
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }
    
    await mongoose.connect(uri);
    console.log('Successfully connected to MongoDB.');

    // Test creating a document
    const testSurvey = new SurveyResponse({
      email: 'test@test.com',
      helpRequest: 'This is a test survey response',
      interestedCountries: ['Spain'],
      desiredInformation: ['Safety'],
      ipAddress: '127.0.0.1',
      geoLocation: {
        country: 'Test Country',
        city: 'Test City',
        region: 'Test Region'
      }
    });

    // Save the test document
    await testSurvey.save();
    console.log('Successfully created test document');

    // Retrieve the document
    const found = await SurveyResponse.findOne({ email: 'test@test.com' });
    console.log('Retrieved test document:', found);

    // Delete the test document
    await SurveyResponse.deleteOne({ email: 'test@test.com' });
    console.log('Successfully deleted test document');

  } catch (error) {
    console.error('Database test failed:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the test
testConnection();