import React from 'react';
import Header from './Header';
import Hero from './Hero';
import Footer from './Footer';
import About from './About';
import Services from './Services';


const HomePage = () => {
  return (
    <div className="min-h-screen">
    <Header />
    <main>
        <Hero />
        <About />
        <Services />
    </main>
      <Footer />
      
    </div>
  );
};

export default HomePage;