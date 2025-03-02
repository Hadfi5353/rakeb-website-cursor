
import { RegisterSidebar } from "@/components/auth/RegisterSidebar";
import { RegisterCard } from "@/components/auth/RegisterCard";
import { useIsMobile } from "@/hooks/use-mobile";

const Register = () => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen flex flex-col md:flex-row overflow-hidden">
      {/* Left side - Sidebar with benefits */}
      <RegisterSidebar />
      
      {/* Right side - Registration form */}
      <div className={`w-full ${isMobile ? '' : 'w-1/2'} flex items-center justify-center p-4 md:p-8 bg-white overflow-y-auto`}>
        <RegisterCard />
      </div>
    </div>
  );
};

export default Register;
