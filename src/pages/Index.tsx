
import Navbar from "@/components/Navbar";
import SearchBar from "@/components/SearchBar";
import HowItWorks from "@/components/HowItWorks";
import PopularCars from "@/components/PopularCars";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 animate-fadeIn">
            Louez la voiture parfaite,<br />entre particuliers
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto animate-fadeIn" style={{ animationDelay: "200ms" }}>
            Location de voitures simple, sécurisée et économique au Maroc
          </p>

          <div className="animate-fadeIn" style={{ animationDelay: "400ms" }}>
            <SearchBar />
          </div>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fadeIn" style={{ animationDelay: "600ms" }}>
            <Button size="lg" variant="outline" className="group">
              Mettre ma voiture en location
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <p className="text-sm text-gray-500">Plus de 1000 propriétaires nous font confiance</p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main>
        <HowItWorks />
        <PopularCars />
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-4">À propos</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-primary transition-colors">Qui sommes-nous</a></li>
                <li><a href="#" className="text-gray-600 hover:text-primary transition-colors">Comment ça marche</a></li>
                <li><a href="#" className="text-gray-600 hover:text-primary transition-colors">Blog</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Propriétaires</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-primary transition-colors">Mettre en location</a></li>
                <li><a href="#" className="text-gray-600 hover:text-primary transition-colors">Assurance</a></li>
                <li><a href="#" className="text-gray-600 hover:text-primary transition-colors">Tarifs</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Locataires</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-primary transition-colors">Comment louer</a></li>
                <li><a href="#" className="text-gray-600 hover:text-primary transition-colors">Assurance</a></li>
                <li><a href="#" className="text-gray-600 hover:text-primary transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <ul className="space-y-2">
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
    </div>
  );
};

export default Index;
