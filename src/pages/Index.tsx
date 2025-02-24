
import Navbar from "@/components/Navbar";
import SearchBar from "@/components/SearchBar";
import HowItWorks from "@/components/HowItWorks";
import PopularCars from "@/components/PopularCars";
import WhyChooseUs from "@/components/WhyChooseUs";
import Testimonials from "@/components/Testimonials";
import Stats from "@/components/Stats";
import FAQ from "@/components/FAQ";
import FloatingCTA from "@/components/FloatingCTA";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section avec image de fond */}
      <section className="relative min-h-screen">
        {/* Image de fond avec overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&q=80"
            alt="Luxury car background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
        </div>

        {/* Contenu du hero */}
        <div className="relative z-10 pt-32 pb-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
                La location de voiture 
                <span className="block text-primary-light">simplifiée</span>
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-8">
                Trouvez et réservez la voiture idéale en quelques clics
              </p>
              <div className="bg-white/95 backdrop-blur-md p-6 rounded-xl shadow-lg">
                <SearchBar />
              </div>
              
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-primary hover:bg-primary-dark">
                  <Link to="/search">
                    Explorer les voitures
                    <ArrowRight className="ml-2" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                  <Link to="/become-owner">
                    Devenir propriétaire
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section de confiance */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-center">
            <img src="/brands/mercedes.svg" alt="Mercedes" className="h-12 w-auto mx-auto opacity-50 hover:opacity-100 transition-opacity" />
            <img src="/brands/bmw.svg" alt="BMW" className="h-12 w-auto mx-auto opacity-50 hover:opacity-100 transition-opacity" />
            <img src="/brands/audi.svg" alt="Audi" className="h-12 w-auto mx-auto opacity-50 hover:opacity-100 transition-opacity" />
            <img src="/brands/volkswagen.svg" alt="Volkswagen" className="h-12 w-auto mx-auto opacity-50 hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </section>

      {/* Contenu principal avec images */}
      <main className="space-y-24">
        <HowItWorks />
        
        {/* Section PopularCars avec un fond stylisé */}
        <section className="relative py-20 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <img
              src="https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&q=80"
              alt="Pattern background"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative z-10">
            <PopularCars />
          </div>
        </section>

        <Stats />

        {/* Section WhyChooseUs avec image latérale */}
        <section className="relative py-20 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&q=80"
                alt="Happy car owner"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-primary text-white p-6 rounded-xl shadow-lg">
                <p className="text-2xl font-bold">4.9/5</p>
                <p className="text-sm opacity-90">Note moyenne</p>
              </div>
            </div>
            <div>
              <WhyChooseUs />
            </div>
          </div>
        </section>

        {/* Section Testimonials avec arrière-plan moderne */}
        <section className="relative py-20 bg-gradient-to-br from-primary/5 via-white to-gray-50">
          <div className="absolute inset-0 opacity-30 mix-blend-overlay">
            <img
              src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80"
              alt="Testimonials background"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative z-10">
            <Testimonials />
          </div>
        </section>

        <FAQ />
      </main>

      {/* Footer amélioré */}
      <footer className="mt-24 bg-gray-900 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            <div>
              <h3 className="font-bold mb-4">À propos</h3>
              <ul className="space-y-2">
                <li><Link to="#" className="text-gray-400 hover:text-primary-light">Qui sommes-nous</Link></li>
                <li><Link to="#" className="text-gray-400 hover:text-primary-light">Comment ça marche</Link></li>
                <li><Link to="#" className="text-gray-400 hover:text-primary-light">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Location</h3>
              <ul className="space-y-2">
                <li><Link to="#" className="text-gray-400 hover:text-primary-light">Louer une voiture</Link></li>
                <li><Link to="#" className="text-gray-400 hover:text-primary-light">Assurance</Link></li>
                <li><Link to="#" className="text-gray-400 hover:text-primary-light">Aide</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Propriétaires</h3>
              <ul className="space-y-2">
                <li><Link to="#" className="text-gray-400 hover:text-primary-light">Mettre en location</Link></li>
                <li><Link to="#" className="text-gray-400 hover:text-primary-light">Tarifs</Link></li>
                <li><Link to="#" className="text-gray-400 hover:text-primary-light">Guide</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><Link to="#" className="text-gray-400 hover:text-primary-light">Contact</Link></li>
                <li><Link to="#" className="text-gray-400 hover:text-primary-light">FAQ</Link></li>
                <li><Link to="#" className="text-gray-400 hover:text-primary-light">Urgence</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-16 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; 2024 Rakeb. Tous droits réservés.</p>
          </div>
        </div>
      </footer>

      <FloatingCTA />
    </div>
  );
};

export default Index;
