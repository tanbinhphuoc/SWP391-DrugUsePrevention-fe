  import Header from '../components/common/Header';
  import Hero from '../components/common/Hero';
  import Footer from '../components/common/Footer';
  import About from '../components/features/home/About';
  import Services from '../components/features/home/Services';
  import Blog from '../components/features/home/Blog';
  import Contact from '../components/features/home/Contact';
  import Testimonials from '../components/features/home/Testimonials';


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
          <Contact />
      </main>
        <Footer />
        
      </div>
    );
  };

  export default HomePage;