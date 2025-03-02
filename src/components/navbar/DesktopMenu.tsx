
import React, { memo } from "react";
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

export const DesktopMenu = memo(({ user, onSignOut, getInitials }: DesktopMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className="border border-gray-200 rounded-full p-2 hover:shadow-md transition-all duration-200 focus:ring-2 focus:ring-primary/20"
          aria-label="Menu utilisateur"
        >
          <Menu className="w-4 h-4 mr-2" />
          {user ? (
            <Avatar className="h-6 w-6">
              <AvatarImage src={user.user_metadata?.avatar_url} alt={user.user_metadata?.first_name || 'Avatar'} />
              <AvatarFallback>{getInitials(user)}</AvatarFallback>
            </Avatar>
          ) : (
            <User className="w-4 h-4" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 bg-white shadow-md z-[999]" sideOffset={8}>
        {user ? (
          <UserMenuContent user={user} onSignOut={onSignOut} getInitials={getInitials} />
        ) : (
          <GuestMenuContent />
        )}
        <CommonMenuItems />
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

DesktopMenu.displayName = "DesktopMenu";
