
import { Car } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const OwnerTools = () => {
  const tools = [
    {
      title: "Calendrier de disponibilité",
      description: "Gérez facilement les disponibilités de vos véhicules"
    },
    {
      title: "Gestion des tarifs",
      description: "Définissez vos tarifs et ajustez-les selon la saison"
    },
    {
      title: "Statistiques et analyses",
      description: "Suivez vos performances et optimisez vos revenus"
    },
    {
      title: "Documents et contrats",
      description: "Accédez à tous vos documents administratifs"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white pt-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Car className="h-12 w-12 mx-auto text-primary mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Outils pour les propriétaires
            </h1>
            <p className="text-gray-600">
              Gérez vos locations et optimisez vos revenus avec nos outils dédiés
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tools.map((tool, index) => (
              <Card key={index} className="h-full">
                <CardHeader>
                  <CardTitle>{tool.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{tool.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Guide du propriétaire</h2>
            <div className="prose max-w-none">
              <p>
                Pour optimiser vos locations et maximiser vos revenus, suivez 
                nos conseils d'experts et utilisez nos outils dédiés.
              </p>

              <h3>Conseils pour réussir</h3>
              <ul>
                <li>Maintenez votre véhicule en parfait état</li>
                <li>Prenez des photos de qualité</li>
                <li>Répondez rapidement aux demandes</li>
                <li>Ajustez vos tarifs selon la demande</li>
              </ul>

              <h3>Support dédié</h3>
              <p>
                Notre équipe de support est disponible pour vous aider à optimiser 
                vos annonces et résoudre rapidement tout problème éventuel.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerTools;
