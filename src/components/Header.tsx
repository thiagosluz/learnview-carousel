import { NavMenu } from "@/components/NavMenu";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export const Header = () => {
  const { isAuthenticated, signOut } = useAuth();

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <NavMenu />
        <div className="ml-auto flex items-center space-x-4">
          {isAuthenticated && (
            <Button
              variant="ghost"
              size="icon"
              onClick={signOut}
              className="text-muted-foreground hover:text-primary"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}; 