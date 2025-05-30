import React from 'react';
import { Calendar, User, ArrowRight } from 'lucide-react';

const Blog = () => {
  const articles = [
    {
      id: 1,
      title: 'Understanding the Warning Signs of Substance Abuse',
      excerpt: 'Learn to recognize early indicators of potential substance use problems and how to approach the situation with compassion.',
      image: 'https://images.pexels.com/photos/3184405/pexels-photo-3184405.jpeg?auto=compress&cs=tinysrgb&w=800',
      date: 'May 15, 2025',
      author: 'Dr. Sarah Johnson',
      category: 'Education'
    },
    {
      id: 2,
      title: 'Talking to Teens About Drug Prevention: A Guide for Parents',
      excerpt: 'Effective strategies for parents to discuss substance abuse prevention with teenagers in a way that builds trust.',
      image: 'https://images.pexels.com/photos/5905445/pexels-photo-5905445.jpeg?auto=compress&cs=tinysrgb&w=800',
      date: 'April 28, 2025',
      author: 'Michael Torres, LCSW',
      category: 'Parenting'
    },
    {
      id: 3,
      title: 'The Role of Community in Substance Abuse Prevention',
      excerpt: 'How community-based approaches can create protective environments and reduce substance abuse risks.',
      image: 'https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=800',
      date: 'April 10, 2025',
      author: 'Lisa Chen, MPH',
      category: 'Community'
    }
  ];

  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Latest Resources</h2>
            <div className="w-24 h-1 bg-blue-600 mb-4"></div>
            <p className="text-lg text-gray-600">
              Insights, stories, and expert guidance for drug prevention and awareness.
            </p>
          </div>
          <button className="hidden md:flex items-center text-blue-600 hover:text-blue-800 font-medium">
            View All Articles <ArrowRight className="ml-2 h-4 w-4" />
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {articles.map((article) => (
            <div key={article.id} className="bg-white rounded-lg overflow-hidden shadow-md transition-all hover:shadow-xl">
              <div className="h-48 overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center text-sm text-gray-500 mb-3">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{article.date}</span>
                  </div>
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    <span>{article.author}</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">{article.title}</h3>
                <p className="text-gray-700 mb-4">{article.excerpt}</p>
                <div className="flex justify-between items-center">
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
                    {article.category}
                  </span>
                  <button className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
                    Read More <ArrowRight className="ml-1 h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <button className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
            View All Articles <ArrowRight className="ml-2 h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Blog;