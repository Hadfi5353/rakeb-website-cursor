import Navbar from "@/components/Navbar";
import SearchBar from "@/components/SearchBar";
import HowItWorks from "@/components/HowItWorks";
import PopularCars from "@/components/PopularCars";
import WhyChooseUs from "@/components/WhyChooseUs";
import Testimonials from "@/components/Testimonials";
import Stats from "@/components/Stats";
import FAQ from "@/components/FAQ";
import FloatingCTA from "@/components/FloatingCTA";
import { Shield, Star, MessageCircle } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 animate-fadeIn">
            Trouvez votre voiture idéale<br />en 3 clics
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto animate-fadeIn" style={{ animationDelay: "200ms" }}>
            Location de voitures simple, sécurisée et économique au Maroc.<br />
            Réservez auprès de propriétaires vérifiés.
          </p>

          <div className="animate-fadeIn" style={{ animationDelay: "400ms" }}>
            <SearchBar />
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">100% Sécurisé</h3>
              <p className="text-gray-600">Vérification d'identité et assurance complète incluse</p>
            </div>
            <div className="p-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">4.8/5 étoiles</h3>
              <p className="text-gray-600">Note moyenne sur plus de 10 000 locations</p>
            </div>
            <div className="p-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Support 24/7</h3>
              <p className="text-gray-600">Une équipe à votre écoute à tout moment</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main>
        <HowItWorks />
        <Stats />
        <PopularCars />
        <WhyChooseUs />
        <Testimonials />
        <FAQ />
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

      <FloatingCTA />
    </div>
  );
};

export default Index;
