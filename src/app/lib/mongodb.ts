import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema({
  country: String,
  city: String,
  region: String,
  latitude: Number,
  longitude: Number
});

const surveyResponseSchema = new mongoose.Schema({
  // Form fields
  email: {
    type: String,
    required: true
  },
  helpRequest: {
    type: String,
    required: true
  },
  interestedCountries: [{
    type: String,
    enum: [
      'Austria', 'Belgium', 'Bulgaria', 'Croatia', 'Cyprus',
      'Czech Republic', 'Denmark', 'Estonia', 'Finland', 'France',
      'Germany', 'Greece', 'Hungary', 'Ireland', 'Italy',
      'Latvia', 'Lithuania', 'Luxembourg', 'Malta', 'Netherlands',
      'Poland', 'Portugal', 'Romania', 'Slovakia', 'Slovenia',
      'Spain', 'Sweden'
    ]
  }],
  desiredInformation: [{
    type: String,
    enum: [
      'Safety',
      'Living expenses',
      'Rent',
      'House prices',
      'Healthcare quality',
      'Transport to airport',
      'Internet',
      'Activities',
      'Air quality',
      'English speaking',
      'Walkability',
      'Traffic safety',
      'Friendly to foreigners',
      'LGBTQ+ friendly',
      'Weather'
    ]
  }],
  additionalComments: String,

  // Tracking fields
  ipAddress: {
    type: String,
    required: true
  },
  geoLocation: {
    type: locationSchema,
    required: true
  },
  
  // Timestamp fields
  submittedAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true // This will automatically handle createdAt and updatedAt
});

// Add indexes for better query performance
surveyResponseSchema.index({ email: 1 });
surveyResponseSchema.index({ 'geoLocation.country': 1 });
surveyResponseSchema.index({ submittedAt: -1 });

// Prevent duplicate model registration
export const SurveyResponse = mongoose.models.SurveyResponse || 
  mongoose.model('SurveyResponse', surveyResponseSchema);

// Export type for TypeScript support
export type SurveyResponseType = mongoose.InferSchemaType<typeof surveyResponseSchema>;