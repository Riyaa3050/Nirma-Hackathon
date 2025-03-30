import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Bell, LogOut } from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useDispatch } from "react-redux";
import { logout } from "@/store/userSlice";
import { useNavigate } from "react-router-dom";

export function Layout({ children }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <TooltipProvider>
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <div className="flex-1 overflow-hidden">
            <header className="flex h-16 items-center justify-between border-b px-6">
              <div className="flex items-center gap-4">
                <SidebarTrigger />
                <h1 className="text-lg font-semibold">FraudWise Insights</h1>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="outline" size="icon">
                  <Bell className="h-5 w-5" />
                </Button>
                <Button
                  className="bg-red-100 text-red-700 hover:text-red-800 hover:bg-red-200"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" /> Logout
                </Button>
              </div>
            </header>
            <main className="flex-1 overflow-auto p-6">{children}</main>
          </div>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  );
}
