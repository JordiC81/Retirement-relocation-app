'use client';

import { useState, useEffect } from 'react';
import { ArrowUp, Share2 } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  date: string;
  content: string;
  imageUrl?: string;
}

export default function BlogPage() {
  const [activePost, setActivePost] = useState<string | null>(null);

  useEffect(() => {
    // Handle URL fragment on load
    const hash = window.location.hash.slice(1);
    if (hash) {
      setActivePost(hash);
      const element = document.getElementById(hash);
      element?.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const handleShare = (postId: string) => {
    const url = `${window.location.origin}/blog#${postId}`;
    if (navigator.share) {
      navigator.share({
        title: 'Retirely.eu Blog',
        url: url
      });
    } else {
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Sample blog posts - in production, these would come from your content files
  const blogPosts: BlogPost[] = [
    {
      id: 'retire-in-portugal',
      title: 'Complete Guide to Retiring in Portugal: From Golden Visa to Healthcare',
      date: '2025-01-20',
      content: 'Portugal has become one of Europe\'s most popular retirement destinations, and for good reason. This comprehensive guide will walk you through everything you need to know about retiring in Portugal.\n\nThe Golden Visa program offers a path to residency through investment. Key benefits include access to the Schengen Area, path to Portuguese citizenship, minimal stay requirements, and family inclusion.\n\nPortugal\'s healthcare system ranks among the best in Europe, with universal public healthcare (SNS), high-quality private hospitals, and affordable health insurance options.',
      imageUrl: '/api/placeholder/800/400'
    },
    {
      id: 'european-healthcare-systems',
      title: 'Understanding Healthcare Systems Across Southern Europe',
      date: '2025-01-15',
      content: 'One of the most crucial factors when choosing a retirement destination is the quality and accessibility of healthcare. Southern European countries generally offer universal healthcare coverage, a mix of public and private options, and high standard of medical care.\n\nSpain provides universal public healthcare (SNS) with excellent specialist care. Italy offers the National Health Service (SSN) with strong preventive care programs. Greece has a National Healthcare System (ESY) with a growing private healthcare sector.',
      imageUrl: '/api/placeholder/800/400'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Retirement in Europe: Insights and Guides</h1>
      
      <div className="space-y-12">
        {blogPosts.map((post) => (
          <article 
            key={post.id} 
            id={post.id} 
            className="border-b pb-8 last:border-b-0"
          >
            <h2 className="text-2xl font-semibold mb-4">{post.title}</h2>
            <div className="text-sm text-gray-500 mb-4">
              {new Date(post.date).toLocaleDateString()}
            </div>
            
            {post.imageUrl && (
              <img 
                src={post.imageUrl} 
                alt={post.title}
                className="w-full rounded-lg mb-6"
              />
            )}
            
            <div className="prose max-w-none mb-6 whitespace-pre-wrap">
              {post.content}
            </div>
            
            <button
              onClick={() => handleShare(post.id)}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
            >
              <Share2 size={16} />
              Share this article
            </button>
          </article>
        ))}
      </div>

      <button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
        aria-label="Scroll to top"
      >
        <ArrowUp size={24} />
      </button>
    </div>
  );
}