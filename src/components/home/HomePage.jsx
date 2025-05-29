import React from 'react';
import Header from './Header';
import Hero from './Hero';
import Footer from './Footer';
import About from './About';


const HomePage = () => {
  return (
    <div className="min-h-screen">
    <Header />
    <main>
        <Hero />
        <About />
    </main>
      <Footer />
      
    </div>
  );
};

export default HomePage;