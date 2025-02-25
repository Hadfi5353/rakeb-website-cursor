
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
import { Link } from "react-router-dom";
import { ChevronRight, Star } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section Moderne */}
      <section className="relative pt-24 pb-12 md:pt-32 md:pb-20 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-transparent" />
          <img
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80"
            alt="Luxury car"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
              <Star className="w-4 h-4 fill-primary" />
              <span className="text-sm font-medium">Plus de 10 000 véhicules disponibles</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Trouvez la voiture parfaite pour chaque occasion
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8">
              Location de voitures entre particuliers, simple, sécurisée et économique
            </p>
            <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">
              <SearchBar />
            </div>
            <div className="flex flex-wrap gap-4">
              <Link to="/search">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  Rechercher une voiture
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/become-owner">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary hover:text-white"
                >
                  Mettre ma voiture en location
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Bande de confiance */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
              <span className="font-medium">Note 4.8/5</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="h-8" viewBox="0 0 94 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M92.0714 0H1.92857C0.863393 0 0 0.863393 0 1.92857V22.0714C0 23.1366 0.863393 24 1.92857 24H92.0714C93.1366 24 94 23.1366 94 22.0714V1.92857C94 0.863393 93.1366 0 92.0714 0Z" fill="#E23442"/>
                <path d="M17.6786 19.7143H13.8929V11.5714H10.1071V19.7143H6.32143V4.28571H10.1071V8.35714H13.8929V4.28571H17.6786V19.7143Z" fill="white"/>
                <path d="M25.9643 19.7143H22.1786V4.28571H25.9643V19.7143Z" fill="white"/>
                <path d="M41.5357 19.7143H37.75L34.5357 13.9286L31.3214 19.7143H27.5357L32.9286 11L27.5357 4.28571H31.3214L34.5357 10.0714L37.75 4.28571H41.5357L36.1429 11L41.5357 19.7143Z" fill="white"/>
              </svg>
            </div>
            <div className="h-8 border-l border-gray-300" />
            <div className="flex items-center gap-2">
              <img src="/trustpilot.svg" alt="Trustpilot" className="h-6" />
              <span className="font-medium">Excellent</span>
            </div>
          </div>
        </div>
      </section>

      {/* Comment ça marche - avec des images */}
      <section className="py-20">
        <HowItWorks />
      </section>

      {/* Véhicules populaires */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <PopularCars />
      </section>

      {/* Statistiques avec fond coloré */}
      <section className="py-20 bg-primary/5">
        <Stats />
      </section>

      {/* Pourquoi nous choisir avec image */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80"
                alt="Car rental experience"
                className="rounded-2xl shadow-xl"
              />
              <div className="absolute -bottom-8 -right-8 bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="text-lg font-bold">4.9/5</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">+10 000 avis clients</p>
              </div>
            </div>
            <div>
              <WhyChooseUs />
            </div>
          </div>
        </div>
      </section>

      {/* Témoignages avec design moderne */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <Testimonials />
        </div>
      </section>

      {/* FAQ sur fond blanc */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <FAQ />
        </div>
      </section>

      {/* Footer moderne */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold text-lg mb-4">À propos</h3>
              <ul className="space-y-3">
                <li><Link to="#" className="text-gray-400 hover:text-white transition-colors">Qui sommes-nous</Link></li>
                <li><Link to="#" className="text-gray-400 hover:text-white transition-colors">Comment ça marche</Link></li>
                <li><Link to="#" className="text-gray-400 hover:text-white transition-colors">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Location</h3>
              <ul className="space-y-3">
                <li><Link to="#" className="text-gray-400 hover:text-white transition-colors">Louer une voiture</Link></li>
                <li><Link to="#" className="text-gray-400 hover:text-white transition-colors">Assurance</Link></li>
                <li><Link to="#" className="text-gray-400 hover:text-white transition-colors">Aide</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Propriétaires</h3>
              <ul className="space-y-3">
                <li><Link to="#" className="text-gray-400 hover:text-white transition-colors">Mettre en location</Link></li>
                <li><Link to="#" className="text-gray-400 hover:text-white transition-colors">Tarifs</Link></li>
                <li><Link to="#" className="text-gray-400 hover:text-white transition-colors">Guide</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Support</h3>
              <ul className="space-y-3">
                <li><Link to="#" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
                <li><Link to="#" className="text-gray-400 hover:text-white transition-colors">FAQ</Link></li>
                <li><Link to="#" className="text-gray-400 hover:text-white transition-colors">Urgence</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800">
            <p className="text-center text-gray-400">&copy; 2024 Rakeb. Tous droits réservés.</p>
          </div>
        </div>
      </footer>

      <FloatingCTA />
    </div>
  );
};

export default Index;
