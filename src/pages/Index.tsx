
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50/50 to-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-12 md:pt-28 md:pb-20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
              Louez la voiture idéale près de chez vous
            </h1>
            <p className="text-base md:text-lg text-gray-600 mb-8">
              Des milliers de voitures disponibles partout au Maroc. 
              Location simple, sécurisée et économique entre particuliers.
            </p>
          </div>
          <div className="max-w-2xl mx-auto">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main>
        <div className="space-y-16 md:space-y-24">
          <HowItWorks />
          <Stats />
          <PopularCars />
          <WhyChooseUs />
          <Testimonials />
          <FAQ />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">À propos</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-600 hover:text-primary transition-colors">Qui sommes-nous</a></li>
                <li><a href="#" className="text-gray-600 hover:text-primary transition-colors">Comment ça marche</a></li>
                <li><a href="#" className="text-gray-600 hover:text-primary transition-colors">Blog</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Propriétaires</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-600 hover:text-primary transition-colors">Mettre en location</a></li>
                <li><a href="#" className="text-gray-600 hover:text-primary transition-colors">Assurance</a></li>
                <li><a href="#" className="text-gray-600 hover:text-primary transition-colors">Tarifs</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Locataires</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-600 hover:text-primary transition-colors">Comment louer</a></li>
                <li><a href="#" className="text-gray-600 hover:text-primary transition-colors">Assurance</a></li>
                <li><a href="#" className="text-gray-600 hover:text-primary transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Contact</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-600 hover:text-primary transition-colors">Support</a></li>
                <li><a href="#" className="text-gray-600 hover:text-primary transition-colors">Urgence</a></li>
                <li><a href="#" className="text-gray-600 hover:text-primary transition-colors">Réclamations</a></li>
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
