import React from 'react';
import { Quote } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      quote: "The educational courses provided valuable insights that helped me talk to my teenage children about drugs in an informative, non-judgmental way.",
      name: "Rebecca Chen",
      role: "Parent",
      image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
      quote: "The risk assessment tools gave me a clear understanding of potential issues and connected me with resources I wouldn't have found otherwise.",
      name: "Marcus Johnson",
      role: "Community Leader",
      image: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
      quote: "As a teacher, the specialized training has equipped me with strategies to recognize warning signs and support students who might be at risk.",
      name: "Sophia Rivera",
      role: "High School Teacher",
      image: "https://images.pexels.com/photos/762080/pexels-photo-762080.jpeg?auto=compress&cs=tinysrgb&w=800"
    }
  ];

  return (
    <div className="py-16 bg-gradient-to-r from-sky-800 to-blue-950 text-white"> {/* Changed gradient from emerald to sky/blue */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Success Stories</h2>
          <div className="w-24 h-1 bg-cyan-400 mx-auto mb-8"></div> {/* Changed accent color to cyan */}
          <p className="max-w-3xl mx-auto text-lg text-sky-100"> {/* Changed text color to sky-100 */}
            Hear from those who have benefited from our programs and services.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-md rounded-lg p-6 hover:bg-opacity-20 transition-all duration-300 shadow-md hover:shadow-lg border border-sky-800/20" // Changed border color
            >
              <Quote className="h-8 w-8 text-cyan-400 mb-4" /> {/* Changed accent color to cyan */}
              <p className="text-lg mb-6 text-sky-50">"{testimonial.quote}"</p> {/* Changed text color to sky-50 */}
              <div className="flex items-center">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover mr-4 shadow-md"
                />
                <div>
                  <h4 className="font-semibold text-white">{testimonial.name}</h4>
                  <p className="text-sm text-sky-200">{testimonial.role}</p> {/* Changed text color to sky-200 */}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold mb-4 text-white">Ready to Make a Difference?</h3>
          <p className="max-w-2xl mx-auto mb-8 text-sky-100"> {/* Changed text color to sky-100 */}
            Join our community of volunteers, educators, and advocates committed to substance abuse prevention.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-white text-sky-800 hover:bg-sky-50 transition-all px-6 py-3 rounded-md font-semibold shadow-md hover:shadow-lg"> {/* Changed text color to sky-800 */}
              Join Our Effort
            </button>
            <button className="border-2 border-white text-white hover:bg-cyan-500 hover:border-cyan-500 transition-all px-6 py-3 rounded-md font-semibold shadow-md hover:shadow-lg"> {/* Changed hover color to cyan */}
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;