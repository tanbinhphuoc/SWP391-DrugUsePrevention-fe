import React from 'react';
import { Shield, Award, Users } from 'lucide-react';

const About = () => {
  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">About Our Organization</h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-8"></div>
          <p className="max-w-3xl mx-auto text-lg text-gray-600">
            We are a volunteer-based organization dedicated to preventing substance abuse through education,
            community engagement, and personalized support services.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-blue-50 p-8 rounded-lg text-center transform transition-all hover:shadow-lg">
            <div className="inline-flex items-center justify-center p-3 bg-blue-600 rounded-full text-white mb-5">
              <Shield className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">Our Mission</h3>
            <p className="text-gray-600">
              To reduce substance abuse through evidence-based prevention programs and community support systems.
            </p>
          </div>
          <div className="bg-blue-50 p-8 rounded-lg text-center transform transition-all hover:shadow-lg">
            <div className="inline-flex items-center justify-center p-3 bg-blue-600 rounded-full text-white mb-5">
              <Award className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">Our Values</h3>
            <p className="text-gray-600">
              Compassion, integrity, education, and empowerment are the core principles guiding our approach.
            </p>
          </div>
          <div className="bg-blue-50 p-8 rounded-lg text-center transform transition-all hover:shadow-lg">
            <div className="inline-flex items-center justify-center p-3 bg-blue-600 rounded-full text-white mb-5">
              <Users className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">Our Impact</h3>
            <p className="text-gray-600">
              We've helped thousands of individuals and families build skills and knowledge to resist substance use.
            </p>
          </div>
        </div>

        <div className="bg-gray-100 p-8 rounded-lg">
          <div className="md:flex items-center">
            <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Story</h3>
              <p className="text-gray-700 mb-4">
                Founded in 2025 by a group of dedicated healthcare professionals and community leaders, our organization
                grew from a local support group into a comprehensive resource center for drug prevention education.
              </p>
              <p className="text-gray-700">
                Today, we collaborate with schools, community centers, and healthcare providers to deliver
                programs that reach people of all ages and backgrounds, providing them with the tools they need
                to make informed decisions.
              </p>
            </div>
            <div className="md:w-1/2 grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded shadow-sm text-center">
                <div className="text-3xl font-bold text-blue-600">5000+</div>
                <div className="text-gray-600">Individuals Helped</div>
              </div>
              <div className="bg-white p-4 rounded shadow-sm text-center">
                <div className="text-3xl font-bold text-blue-600">200+</div>
                <div className="text-gray-600">Volunteer Experts</div>
              </div>
              <div className="bg-white p-4 rounded shadow-sm text-center">
                <div className="text-3xl font-bold text-blue-600">50+</div>
                <div className="text-gray-600">Educational Courses</div>
              </div>
              <div className="bg-white p-4 rounded shadow-sm text-center">
                <div className="text-3xl font-bold text-blue-600">20+</div>
                <div className="text-gray-600">Community Partners</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;