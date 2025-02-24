
import Navbar from "@/components/Navbar";
import SearchBar from "@/components/SearchBar";
import HowItWorks from "@/components/HowItWorks";
import PopularCars from "@/components/PopularCars";
import WhyChooseUs from "@/components/WhyChooseUs";
import Testimonials from "@/components/Testimonials";
import Stats from "@/components/Stats";
import FAQ from "@/components/FAQ";
import FloatingCTA from "@/components/FloatingCTA";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Section de recherche principale */}
      <section className="pt-24 pb-12 px-4 md:pt-32 md:pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
              La location de voiture simplifiée
            </h1>
            <p className="text-base md:text-lg text-gray-600">
              Trouvez et réservez la voiture idéale en quelques clics
            </p>
          </div>
          <div className="max-w-2xl mx-auto">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* Contenu principal */}
      <main className="space-y-12 md:space-y-24">
        <HowItWorks />
        <PopularCars />
        <Stats />
        <WhyChooseUs />
        <Testimonials />
        <FAQ />
      </main>

      {/* Footer */}
      <footer className="mt-24 bg-gray-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-4">À propos</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-primary">Qui sommes-nous</a></li>
                <li><a href="#" className="text-gray-600 hover:text-primary">Comment ça marche</a></li>
                <li><a href="#" className="text-gray-600 hover:text-primary">Blog</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Location</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-primary">Louer une voiture</a></li>
                <li><a href="#" className="text-gray-600 hover:text-primary">Assurance</a></li>
                <li><a href="#" className="text-gray-600 hover:text-primary">Aide</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Propriétaires</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-primary">Mettre en location</a></li>
                <li><a href="#" className="text-gray-600 hover:text-primary">Tarifs</a></li>
                <li><a href="#" className="text-gray-600 hover:text-primary">Guide</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-primary">Contact</a></li>
                <li><a href="#" className="text-gray-600 hover:text-primary">FAQ</a></li>
                <li><a href="#" className="text-gray-600 hover:text-primary">Urgence</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-200 text-center text-gray-600">
            <p>&copy; 2024 Rakeb. Tous droits réservés.</p>
          </div>
        </div>
      </footer>

      <FloatingCTA />
    </div>
  );
};

export default Index;
