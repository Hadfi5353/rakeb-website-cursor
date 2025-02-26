
import { Button } from '@/components/ui/button';
import { UserRole } from '@/types/user';

interface RoleSelectionProps {
  currentRole?: UserRole;
  onRoleChange: (role: UserRole) => void;
}

export const RoleSelection = ({ currentRole, onRoleChange }: RoleSelectionProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Je suis un</label>
      <div className="grid grid-cols-2 gap-4">
        <Button
          variant={currentRole === 'renter' ? 'default' : 'outline'}
          onClick={() => onRoleChange('renter')}
          className="w-full"
        >
          Locataire
        </Button>
        <Button
          variant={currentRole === 'owner' ? 'default' : 'outline'}
          onClick={() => onRoleChange('owner')}
          className="w-full"
        >
          Propriétaire
        </Button>
      </div>
    </div>
  );
};
