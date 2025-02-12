'use client';

import { useEffect } from 'react';
import { ArrowUp, Share2 } from 'lucide-react';
import Image from 'next/image';

interface BlogPost {
  id: string;
  title: string;
  date: string;
  content: string;
  imageUrl?: string;
}

export default function BlogPage() {
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
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

  const formatContent = (content: string) => {
    // Split content by newlines while preserving them
    const lines = content.split(/(?<=\n)/);
    return lines.map((line, index) => {
      // Check if the line is a heading
      if (/^\d+\.|\b(The Importance of|Challenges Faced|Strategies to Build|Conclusion|The Retirement Dream Awaits)\b/.test(line)) {
        return <p key={index} className="font-bold text-black">{line}</p>;
      }
      
      // Replace retirely.eu references with hyperlinks
      const processedLine = line.replace(
        /\b(retirely\.eu|www\.retirely\.eu)\b/g,
        '<a href="https://www.retirely.eu" className="text-blue-600 hover:text-blue-800 underline">www.retirely.eu</a>'
      );
      
      return <p key={index} dangerouslySetInnerHTML={{ __html: processedLine }} />;
    });
  };

  const blogPosts: BlogPost[] = [
    {
      id: 'why-retire-southern-europe',
      title: 'Why Retire in Southern Europe?',
      date: '2025-02-11',
      content: `Retirement marks the beginning of a new chapter---a chance to embrace a lifestyle that combines relaxation, adventure, and a sense of fulfillment. Southern Europe is fast becoming one of the most sought-after retirement destinations, and it's not hard to see why. From its idyllic climate to its incredible affordability, this sun-kissed region offers everything retirees could dream of. Let's explore some of the top reasons why retiring in Southern Europe might be the perfect choice for you.

1. A Climate That Feels Like Paradise

Imagine waking up to sunny skies and mild temperatures almost year-round. Southern Europe, with its Mediterranean climate, offers warm summers and mild winters, making it a haven for those looking to escape the cold or unpredictable weather elsewhere. Whether it's the stunning beaches of Portugal, the olive groves of Spain, or the picturesque islands of Greece, Southern Europe promises endless opportunities to enjoy the great outdoors in comfort.

2. An Unparalleled Quality of Life

Southern Europe is synonymous with excellent quality of life. Its rich culinary traditions make every meal a celebration---think freshly baked bread, locally sourced seafood, world-class olive oil, and, of course, fine wine. Beyond the food, the relaxed pace of life encourages you to savor every moment, whether that's strolling through historic towns, lounging in seaside cafes, or joining in local festivals. Plus, access to top-notch healthcare ensures peace of mind as you enjoy your golden years.

3. Affordable Living That Stretches Your Savings

One of the biggest draws of retiring in Southern Europe is its affordability. The cost of living in countries like Spain, Portugal, and Greece is significantly lower compared to many parts of the United States, Canada, or Northern Europe. Housing is more affordable, whether you're looking to rent a cozy apartment or buy your dream home by the sea. Groceries, dining out, and even healthcare are budget-friendly, giving your savings and pension greater purchasing power. You can enjoy a higher standard of living without worrying about breaking the bank.

4. Friendly Locals and a Thriving Expat Community

The warmth of Southern Europe extends beyond the climate. The locals are famously friendly, welcoming newcomers with open arms. Language barriers are often easier to overcome with their patience and charm. What's more, Southern Europe is home to large, well-established communities of retired expats, offering a built-in support network. Whether it's joining social clubs, attending language classes, or sharing experiences, you'll never feel isolated.

The Retirement Dream Awaits

Retiring in Southern Europe is about more than just finding a place to live---it's about embracing a lifestyle that prioritizes well-being, adventure, and connection. With its incredible climate, unbeatable quality of life, affordability, and sense of community, Southern Europe is the perfect place to make the most of your retirement years. Why settle for ordinary when you can experience extraordinary? At www.retirely.eu we help you find the right place to retire in paradise.`,
      imageUrl: '/Why Retire in Southern Europe.png'
    },
    {
      id: 'spain-dominates',
      title: 'Best Country to Retire In? Spain Dominates.',
      date: '2025-02-10',
      content: `In the latest Expat Insider 2024 survey by InterNations, as reported by Forbes, Spain has emerged as a top destination for expatriates, boasting five cities in the top 25 rankings. Valencia leads at #1, followed by Málaga (#2), Alicante (#3), Madrid (#7), and Barcelona (#21).

Valencia is celebrated for its exceptional quality of life, with expatriates praising its affordable public transportation and abundant recreational opportunities. The city's relaxed lifestyle, friendly locals, delectable cuisine, vibrant culture, and pleasant climate make it an attractive place to live.

Málaga ranks second globally and first in ease of settling in, with expatriates highlighting its high quality of life, favorable climate, and welcoming atmosphere. However, challenges in the local job market and limited professional opportunities are noted. Despite these challenges, Málaga remains an appealing choice, especially for retirees, with 99% of expatriates appreciating its sunny weather.

Alicante secures the third spot, standing out for its affordable housing and accessible digital infrastructure. Approximately 70% of expatriates find housing in Alicante to be affordable, contributing to its appeal as a desirable place to live.

Madrid and Barcelona also feature prominently, offering rich cultural experiences, diverse culinary scenes, and dynamic urban lifestyles. These cities continue to attract expatriates seeking a blend of modern amenities and historical charm.

Spain's dominance in these rankings underscores its allure as a premier destination for those seeking a fulfilling and enriching living experience abroad.

At www.retirely.eu, we specialize in helping you discover the perfect place to retire in paradise. Let us guide you to your ideal retirement destination.`,
      imageUrl: '/Best Country to Retire In Spain Dominates.jpg'
    },
    {
      id: 'importance-of-community',
      title: 'Thinking of Retiring Abroad? The Importance of Finding a Supporting Community.',
      date: '2025-02-09',
      content: `Retiring abroad offers the allure of new experiences, cultures, and often a more relaxed lifestyle. However, one of the most significant challenges expatriate retirees face is the potential for social isolation. Establishing a supportive community in a foreign land is not just beneficial---it's essential for a fulfilling retirement.

The Importance of Community

Human beings are inherently social creatures, and this need for connection doesn't diminish with age. For seniors, maintaining a sense of community is crucial for overall well-being. Isolation and loneliness can lead to adverse effects on both physical and mental health, including increased risks of mortality, cognitive decline, and depression. A strong community provides seniors with a support network, a sense of belonging, and opportunities for social interaction.

Challenges Faced by Expat Retirees

Many retirees move abroad seeking a better quality of life, favorable climates, and lower living costs. However, without a supportive community, the dream can become challenging. Some retirees, unable to find a sense of belonging, decide to return to their home countries. Factors influencing this decision include the presence of family, financial situations, health conditions, and a sense of belonging.

Strategies to Build Your Community Abroad

1. Engage with Expat Groups: Many popular retirement destinations have well-established expat communities. www.retirely.eu helps you join these groups, offering a sense of camaraderie and support. Participating in social events and shared activities can foster friendships and create a sense of belonging.

2. Integrate with Locals: While expat communities provide familiarity, integrating into the local community can enhance your experience. Engaging with locals, participating in community events, and supporting local businesses allow you to experience the authentic essence of the culture. www.retirely.eu helps you integrate with the local community to build meaningful connections.

3. Choose a Location with Transport Links: For retirees living abroad, staying connected to loved ones back home is essential. Choosing a location with good transport links---such as proximity to major airports or train routes---ensures that visiting home is convenient and affordable. At www.retirely.eu, we help you find the perfect retirement destination with excellent connectivity, so you never feel too far away from your roots.

4. Participate in Local Activities: Engaging in hobbies, joining clubs, or attending local festivals can help you meet new people and immerse yourself in the culture. These activities provide opportunities to build a social network and feel more connected to your new home. www.retirely.eu helps you find activities tailored to your needs in your new paradise retirement.

Conclusion

Finding and nurturing a community is paramount for retirees settling abroad. A strong support network not only enriches your daily life but also provides practical assistance and emotional well-being. At www.retirely.eu, we help you discover the perfect place to retire in paradise. Let us guide you to your ideal retirement destination, ensuring you find a community where you can truly belong.`,
      imageUrl: '/the importance of community.png'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="space-y-12">
        {blogPosts.map((post) => (
          <article 
            key={post.id} 
            id={post.id} 
            className="border-b pb-8 last:border-b-0"
          >
            <h2 className="text-2xl font-semibold mb-4">{post.title}</h2>
            <div className="text-sm text-gray-500 mb-4">
              {new Date(post.date).toLocaleDateString('en-GB')}
            </div>
            
            {post.imageUrl && (
              <Image
                src={post.imageUrl}
                alt={post.title}
                className={`w-full h-[300px] object-cover rounded-lg mb-6 ${
                  post.id === 'importance-of-community' ? 'object-top' : 'object-center'
                }`}
                width={800}
                height={300}
              />
            )}
            
            <div className="prose prose-a:text-blue-600 prose-a:underline hover:prose-a:text-blue-800 max-w-none mb-6 space-y-8">
              {formatContent(post.content)}
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