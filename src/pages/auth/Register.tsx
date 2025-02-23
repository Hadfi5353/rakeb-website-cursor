
import { useRef } from "react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Confetti, type ConfettiRef } from "@/components/ui/confetti";
import { RegisterHeader } from "./components/RegisterHeader";
import { RegisterForm } from "./components/RegisterForm";

const Register = () => {
  const confettiRef = useRef<ConfettiRef>(null);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <Confetti
        ref={confettiRef}
        className="fixed inset-0 pointer-events-none"
        options={{
          disableForReducedMotion: true
        }}
      />
      
      <RegisterHeader />

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Inscription</CardTitle>
            <CardDescription>
              Remplissez les informations ci-dessous pour créer votre compte
            </CardDescription>
          </CardHeader>
          <RegisterForm />
        </Card>
      </div>
    </div>
  );
};

export default Register;
