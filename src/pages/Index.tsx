
import Navbar from "@/components/Navbar";
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
    <div className="min-h-screen">
      <Navbar />
      
      {/* Main Content */}
      <main className="pt-16">
        <HowItWorks />
        <Stats />
        <PopularCars />
        <WhyChooseUs />
        <Testimonials />
        <FAQ />

        {/* CTA Section */}
        <section className="bg-primary/5 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Button 
              size="lg" 
              variant="outline" 
              className="group border-primary text-primary hover:bg-primary hover:text-white"
            >
              Mettre ma voiture en location
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </section>

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
      </main>

      <FloatingCTA />
    </div>
  );
};

export default Index;
