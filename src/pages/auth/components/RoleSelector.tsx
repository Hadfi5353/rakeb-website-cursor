
import { Button } from "@/components/ui/button";
import { Car, Search } from "lucide-react";

type RoleSelectorProps = {
  selectedRole: "renter" | "owner";
  onRoleChange: (role: "renter" | "owner") => void;
  disabled?: boolean;
};

export function RoleSelector({ selectedRole, onRoleChange, disabled }: RoleSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">Je suis un</label>
      <div className="grid grid-cols-2 gap-4">
        <Button
          type="button"
          variant={selectedRole === "renter" ? "default" : "outline"}
          onClick={() => onRoleChange("renter")}
          className="w-full"
          disabled={disabled}
        >
          <Search className="w-4 h-4 mr-2" />
          Locataire
        </Button>
        <Button
          type="button"
          variant={selectedRole === "owner" ? "default" : "outline"}
          onClick={() => onRoleChange("owner")}
          className="w-full"
          disabled={disabled}
        >
          <Car className="w-4 h-4 mr-2" />
          Propriétaire
        </Button>
      </div>
    </div>
  );
}
