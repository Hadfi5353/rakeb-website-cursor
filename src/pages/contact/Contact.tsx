
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Contact = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white pt-16">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <Mail className="h-12 w-12 text-primary" />
              </div>
              <CardTitle className="text-center text-3xl">Contactez-nous</CardTitle>
              <CardDescription className="text-center">
                Notre équipe est à votre disposition pour répondre à vos questions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Nom complet
                  </label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john.doe@example.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                    Sujet
                  </label>
                  <Input
                    id="subject"
                    type="text"
                    placeholder="Comment pouvons-nous vous aider ?"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={6}
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary focus:ring-primary"
                    placeholder="Votre message..."
                    required
                  />
                </div>

                <Button type="submit" className="w-full">
                  Envoyer le message
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="mt-12 text-center text-gray-600">
            <p className="mb-4">Vous pouvez aussi nous contacter :</p>
            <div className="space-y-2">
              <p>Email: contact@rakeb.com</p>
              <p>Téléphone: +33 1 23 45 67 89</p>
              <p>Du lundi au vendredi, de 9h à 18h</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
