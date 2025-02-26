
import { Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserMenuContent } from "./UserMenuContent";
import { GuestMenuContent } from "./GuestMenuContent";
import { CommonMenuItems } from "./CommonMenuItems";

interface DesktopMenuProps {
  user: any;
  onSignOut: () => void;
  getInitials: (user: any) => string;
}

export const DesktopMenu = ({ user, onSignOut, getInitials }: DesktopMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className="border border-gray-200 rounded-full p-2 hover:shadow-md transition-all duration-200"
        >
          <Menu className="w-4 h-4 mr-2" />
          {user ? (
            <Avatar className="h-6 w-6">
              <AvatarImage src={user.user_metadata?.avatar_url} />
              <AvatarFallback>{getInitials(user)}</AvatarFallback>
            </Avatar>
          ) : (
            <User className="w-4 h-4" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        {user ? (
          <UserMenuContent user={user} onSignOut={onSignOut} getInitials={getInitials} />
        ) : (
          <GuestMenuContent />
        )}
        <CommonMenuItems />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
