
import Navbar from "@/components/Navbar";
import SearchBar from "@/components/SearchBar";
import HowItWorks from "@/components/HowItWorks";
import PopularCars from "@/components/PopularCars";
import WhyChooseUs from "@/components/WhyChooseUs";
import Testimonials from "@/components/Testimonials";
import Stats from "@/components/Stats";
import FAQ from "@/components/FAQ";
import FloatingCTA from "@/components/FloatingCTA";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white">
      <Navbar />
      
      {/* Hero Section avec recherche */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[url('/placeholder.svg')] opacity-5"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
              Location de voitures entre particuliers
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Trouvez la voiture idéale pour votre prochain trajet, ou rentabilisez la vôtre en toute simplicité
            </p>
            <div className="flex gap-4 justify-center mb-12">
              <Button size="lg" className="text-lg px-8" asChild>
                <a href="/cars/search">
                  Trouver une voiture
                  <ArrowRight className="ml-2" />
                </a>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8" asChild>
                <a href="/cars/add">
                  Mettre en location
                </a>
              </Button>
            </div>
          </div>

          <div className="max-w-2xl mx-auto backdrop-blur-lg bg-white/80 rounded-xl shadow-lg p-4">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* Section Statistiques */}
      <div className="py-12 bg-white">
        <Stats />
      </div>

      {/* Section Comment ça marche */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <HowItWorks />
      </section>

      {/* Section Voitures Populaires */}
      <section className="py-16 bg-gray-50">
        <PopularCars />
      </section>

      {/* Section Pourquoi nous choisir */}
      <section className="py-16 bg-white">
        <WhyChooseUs />
      </section>

      {/* Section Témoignages */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <Testimonials />
      </section>

      {/* Section FAQ */}
      <section className="py-16 bg-white">
        <FAQ />
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold text-lg mb-4">À propos</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Qui sommes-nous</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Comment ça marche</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Location</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Louer une voiture</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Assurance</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Aide</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Propriétaires</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Mettre en location</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Tarifs</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Guide</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Urgence</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; 2024 Rakeb. Tous droits réservés.</p>
          </div>
        </div>
      </footer>

      <FloatingCTA />
    </div>
  );
};

export default Index;
