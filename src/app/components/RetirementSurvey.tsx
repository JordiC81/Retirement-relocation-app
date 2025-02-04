'use client';

import { useState } from 'react';

interface SurveyFormData {
  email: string;
  helpRequest: string;
  interestedCountries: string[];
  desiredInformation: string[];
  additionalComments?: string;
}

export default function RetirementSurvey() {
  const [formData, setFormData] = useState<SurveyFormData>({
    email: '',
    helpRequest: '',
    interestedCountries: [],
    desiredInformation: [],
    additionalComments: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);
  const [emailError, setEmailError] = useState('');
  const [helpWordCount, setHelpWordCount] = useState(0);
  const [helpWordLimitError, setHelpWordLimitError] = useState('');
  const [commentsWordCount, setCommentsWordCount] = useState(0);
  const [commentsWordLimitError, setCommentsWordLimitError] = useState('');

  const countWords = (text: string) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const isFormValid = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return (
      formData.email !== '' &&
      emailRegex.test(formData.email) &&
      formData.helpRequest !== '' &&
      formData.interestedCountries.length > 0 &&
      formData.desiredInformation.length > 0
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('/api/survey', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Submission failed');
      
      setSubmitStatus('success');
      setFormData({
        email: '',
        helpRequest: '',
        interestedCountries: [],
        desiredInformation: [],
        additionalComments: ''
      });
    } catch {  // Removed unused error parameter
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {submitStatus === 'success' && (
        <div className="mb-4 p-4 bg-green-50 text-green-800 rounded-md">
          Thank you for completing our survey! We&apos;ll reach out when our app launches.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        <div>
          <label className="block text-sm font-medium mb-1">Email Address</label>
          <input
            type="email"
            required
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={formData.email}
            onChange={(e) => {
              const newEmail = e.target.value;
              setFormData({
                ...formData,
                email: newEmail
              });
              if (newEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
                setEmailError('Please include a valid email address');
              } else {
                setEmailError('');
              }
            }}
            placeholder="your@email.com"
          />
          {emailError && (
            <p className="mt-1 text-sm text-red-600">
              {emailError}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">How can we help you? For example:</label>
          <textarea
            required
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-20"
            value={formData.helpRequest}
            onChange={(e) => {
              const text = e.target.value;
              const words = countWords(text);
              if (words <= 100) {
                setFormData({
                  ...formData,
                  helpRequest: text
                });
                setHelpWordCount(words);
                setHelpWordLimitError('');
              } else {
                setHelpWordLimitError('Word limit reached. Maximum 100 words allowed.');
              }
            }}
            placeholder={`I want to retire somewhere but I do not know where\nI know where to retire but would like to meet other people there\nother`}
            style={{ fontStyle: 'italic' }}
          />
          <div className="mt-1 flex justify-between">
            <span className="text-sm text-gray-500">
              {helpWordCount}/100 words
            </span>
            {helpWordLimitError && (
              <span className="text-sm text-red-600">
                {helpWordLimitError}
              </span>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            In which countries are you interested in retiring? (maximum 5 options)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
            {[
              'Austria', 'Belgium', 'Bulgaria', 'Croatia', 'Cyprus',
              'Czech Republic', 'Denmark', 'Estonia', 'Finland', 'France',
              'Germany', 'Greece', 'Hungary', 'Ireland', 'Italy',
              'Latvia', 'Lithuania', 'Luxembourg', 'Malta', 'Netherlands',
              'Poland', 'Portugal', 'Romania', 'Slovakia', 'Slovenia',
              'Spain', 'Sweden'
            ].map((country) => (
              <div key={country} className="flex items-center">
                <input
                  type="checkbox"
                  id={`country-${country}`}
                  className="mr-2 rounded border-gray-300 focus:ring-blue-500"
                  checked={formData.interestedCountries.includes(country)}
                  onChange={(e) => {
                    if (e.target.checked && formData.interestedCountries.length >= 5) {
                      alert('You can only select up to 5 countries');
                      return;
                    }
                    const updatedCountries = e.target.checked
                      ? [...formData.interestedCountries, country]
                      : formData.interestedCountries.filter(c => c !== country);
                    setFormData({ ...formData, interestedCountries: updatedCountries });
                  }}
                />
                <label htmlFor={`country-${country}`} className="text-sm">
                  {country}
                </label>
              </div>
            ))}
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Selected: {formData.interestedCountries.length}/5 countries
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            What information would you like to know about a potential retirement place? (maximum 5 options)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
            {[
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
            ].map((info) => (
              <div key={info} className="flex items-center">
                <input
                  type="checkbox"
                  id={`info-${info}`}
                  className="mr-2 rounded border-gray-300 focus:ring-blue-500"
                  checked={formData.desiredInformation.includes(info)}
                  onChange={(e) => {
                    if (e.target.checked && formData.desiredInformation.length >= 5) {
                      alert('You can only select up to 5 options');
                      return;
                    }
                    const updatedInfo = e.target.checked
                      ? [...formData.desiredInformation, info]
                      : formData.desiredInformation.filter(i => i !== info);
                    setFormData({ ...formData, desiredInformation: updatedInfo });
                  }}
                />
                <label htmlFor={`info-${info}`} className="text-sm">
                  {info}
                </label>
              </div>
            ))}
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Selected: {formData.desiredInformation.length}/5 options
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Additional Comments</label>
          <textarea
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-24"
            value={formData.additionalComments}
            onChange={(e) => {
              const text = e.target.value;
              const words = countWords(text);
              if (words <= 100) {
                setFormData({
                  ...formData,
                  additionalComments: text
                });
                setCommentsWordCount(words);
                setCommentsWordLimitError('');
              } else {
                setCommentsWordLimitError('Word limit reached. Maximum 100 words allowed.');
              }
            }}
            placeholder="Any other requirements or preferences?"
          />
          <div className="mt-1 flex justify-between">
            <span className="text-sm text-gray-500">
              {commentsWordCount}/100 words
            </span>
            {commentsWordLimitError && (
              <span className="text-sm text-red-600">
                {commentsWordLimitError}
              </span>
            )}
          </div>
        </div>

        {submitStatus === 'error' && (
          <div className="p-4 bg-red-50 text-red-800 rounded-md">
            There was an error submitting your response. Please try again.
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting || !isFormValid()}
          className={`w-full p-3 text-white rounded transition-colors ${
            isSubmitting || !isFormValid()
              ? 'bg-blue-300 cursor-not-allowed' 
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
}