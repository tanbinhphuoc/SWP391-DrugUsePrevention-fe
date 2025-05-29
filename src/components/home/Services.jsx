import React from 'react';
import { BookOpen, ClipboardCheck, CalendarClock, Users, ArrowRight } from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: <BookOpen className="h-8 w-8 text-blue-600" />,
      title: 'Educational Courses',
      description:
        'Age-appropriate courses on drug awareness, prevention skills, and refusal techniques for students, parents, teachers, and community members.',
      features: ['Tailored by age group', 'Online learning', 'Interactive modules', 'Completion certificates'],
      cta: 'Browse Courses',
      color: 'bg-blue-50'
    },
    {
      icon: <ClipboardCheck className="h-8 w-8 text-teal-600" />,
      title: 'Risk Assessment',
      description:
        'Take research-based questionnaires like ASSIST and CRAFFT to evaluate substance use risk levels and receive personalized recommendations.',
      features: ['Confidential screening', 'Instant results', 'Custom action plans', 'Follow-up resources'],
      cta: 'Take Assessment',
      color: 'bg-teal-50'
    },
    {
      icon: <CalendarClock className="h-8 w-8 text-indigo-600" />,
      title: 'Counseling Services',
      description:
        'Schedule online appointments with qualified prevention specialists and counselors for personalized guidance and support.',
      features: ['Virtual consultations', 'Flexible scheduling', 'Expert advisors', 'Ongoing support'],
      cta: 'Book Appointment',
      color: 'bg-indigo-50'
    },
    {
      icon: <Users className="h-8 w-8 text-purple-600" />,
      title: 'Community Programs',
      description:
        'Join awareness campaigns, workshops, and educational events designed to strengthen community knowledge and resilience against substance abuse.',
      features: ['Local events', 'Volunteer opportunities', 'Impact measurement', 'Resource sharing'],
      cta: 'Explore Programs',
      color: 'bg-purple-50'
    }
  ];

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-8"></div>
          <p className="max-w-3xl mx-auto text-lg text-gray-600">
            Comprehensive resources and support to prevent substance abuse and promote healthier communities.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className={`${service.color} rounded-lg overflow-hidden shadow-md transition-transform hover:shadow-lg hover:-translate-y-1`}
            >
              <div className="p-8">
                <div className="mb-4">{service.icon}</div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900">{service.title}</h3>
                <p className="text-gray-700 mb-6">{service.description}</p>

                <ul className="mb-6 space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-gray-600">
                      <span className="mr-2 text-green-500">✓</span> {feature}
                    </li>
                  ))}
                </ul>

                <button className="flex items-center font-medium text-blue-600 hover:text-blue-700 transition-colors">
                  {service.cta} <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;