
import { CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { VerificationStatus as Status } from '@/types/user';

interface VerificationStatusProps {
  status: Status;
  role: 'owner' | 'renter';
}

export const VerificationStatus = ({ status, role }: VerificationStatusProps) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'verified':
        return `${role === 'owner' ? 'Propriétaire' : 'Locataire'} Vérifié`;
      case 'pending':
        return 'Vérification en cours';
      case 'rejected':
        return 'Vérification rejetée';
    }
  };

  return (
    <div className="flex items-center gap-2 p-2 rounded-full bg-background border">
      {getStatusIcon()}
      <span className="text-sm font-medium">{getStatusText()}</span>
    </div>
  );
};
