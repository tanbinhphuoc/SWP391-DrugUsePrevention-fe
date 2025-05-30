import React from 'react';
import Header from './Header';
import Hero from './Hero';
import Footer from './Footer';
import About from './About';
import Services from './Services';
import Blog from './Blog';
import LienHe from './LienHe';
import Testimonials from './Testimonials';


const HomePage = () => {
  return (
    <div className="min-h-screen">
    <Header />
    <main>
        <Hero />
        <About />
        <Services />
        <Blog />
        <Testimonials />
        <LienHe />
    </main>
      <Footer />
      
    </div>
  );
};

export default HomePage;