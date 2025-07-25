import Header from "./Header.jsx"
import Hero from "./Hero.jsx"
import Footer from "./Footer.jsx"
import About from "./About.jsx"
import Services from "./Services.jsx"
import Blog from "./Blog.jsx"
import LienHe from "./LienHe.jsx"
import Testimonials from "./Testimonials.jsx"

const HomePage = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <About />
        <Services />
        {/* <Blog /> */}
        {/* <Testimonials /> */}
      </main>
      <Footer />
      
    </div>
  )
}

export default HomePage;
