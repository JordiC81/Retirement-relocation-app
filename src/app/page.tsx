import { Sun, Heart, Users, MessageCircle, Construction } from 'lucide-react';
import RetirementSurvey from './components/RetirementSurvey';
import BackgroundSlideshow from './components/BackgroundSlideshow';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section with Image Slideshow Background */}
      <div className="bg-transparent relative">
        <section className="relative h-screen overflow-hidden">
          <BackgroundSlideshow />

          {/* Hero Content */}
          <div className="relative z-20 container mx-auto px-4 h-full">
            {/* Work in Progress Banner */}
            <div className="absolute top-8 left-0 right-0">
              <div className="flex items-center justify-center gap-2">
                <Construction className="w-6 h-6 text-white" />
                <span className="text-lg font-semibold text-white">Work in Progress</span>
              </div>
            </div>

            <div className="flex flex-col justify-center h-full max-w-2xl text-white">
              {/* Badge with blog button */}
              <div className="mb-6 relative">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                  <div className="text-sm font-semibold">#1 Retirement Community</div>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star} className="text-yellow-400">★</span>
                    ))}
                  </div>
                  <div className="text-sm">SINCE 2025</div>
                </div>
                {/* Blog Button */}
                <Link 
                  href="/blog"
                  className="absolute right-0 top-0 px-4 py-2 bg-white/10 backdrop-blur-sm text-sm font-semibold text-white rounded-full hover:bg-white/20 transition-colors"
                >
                  Blog
                </Link>
              </div>

              {/* Main Title */}
              <h1 className="text-6xl font-bold mb-8">
                Retire in paradise
              </h1>

              {/* Features List */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <Sun className="w-6 h-6 text-yellow-400" />
                  <span className="text-xl">Research destinations for your retirement</span>
                </div>
                <div className="flex items-center gap-3">
                  <Heart className="w-6 h-6 text-red-400" />
                  <span className="text-xl">Meet people retiring in your new paradise</span>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-6 h-6 text-green-400" />
                  <span className="text-xl">Find activities tailored to your needs</span>
                </div>
                <div className="flex items-center gap-3">
                  <MessageCircle className="w-6 h-6 text-blue-400" />
                  <span className="text-xl">Join our chat to find your community</span>
                </div>
              </div>

              {/* Survey Prompt */}
              <div className="mt-12 text-white/90">
                <p className="text-lg">
                  At Retirely we&apos;re working to help you find the best retirement location. Take the 1 minute survey below to help us build the best product for you.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Wave Pattern */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg className="relative block w-full" height="70" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path 
              d="M0,120 C400,95 800,140 1200,95 L1200,120 L0,120 Z"
              className="fill-white"
            />
          </svg>
        </div>
      </div>

      <div className="bg-white">
        {/* Survey Section */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <RetirementSurvey />
          </div>
        </section>
      </div>
    </div>
  );
}