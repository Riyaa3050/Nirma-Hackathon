
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import {
  Home,
  BarChart3,
  ListChecks,
  FileText,
  ShieldAlert,
  Settings,
  CreditCard,
  Bell,
  Users,
  AlertTriangle,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import BASEURL from "@/lib/Url";

export function AppSidebar() {
  const location = useLocation();
  const [alertCount ,setAlertCount] = useState(0); 
  const [transactions, setTransactions] = useState([]);
  
    useEffect(() => {
      async function fetchHistory() {
        const res = await axios.get(`${BASEURL}/transaction/history`, {
          withCredentials: true,
        });
        const data = res.data.message;
        setTransactions(data);
      }
      fetchHistory();
    }, []);
  
    useEffect(() => {
      const filteredTransactions = transactions
      .filter(transaction => transaction.risk > 70) 
      .map((transaction, index) => ({
        id: index + 1,
        receiver: transaction?.user?.name || "Unknown",
        amount: transaction.amount,
        date: transaction.transactionTime.split("T")[0], 
        purpose: "Online Purchase",
        riskScore: transaction.risk,
      }));
      setAlertCount(filteredTransactions?.length);
      // console.log(flaggedTransactions);
    },[transactions])

  const navigationItems = [
    {
      title: "Dashboard",
      icon: Home,
      path: "/dashboard",
    },
    {
      title: "Transactions",
      icon: CreditCard,
      path: "/transactions",
    },
    {
      title: "Alerts",
      icon: Bell,
      path: "/alerts",
      badge: alertCount,
    },
  ];

  const adminItems = [
    {
      title: "Fraud Rules",
      icon: ShieldAlert,
      path: "/admin/rules",
    },
    {
      title: "Reports",
      icon: FileText,
      path: "/admin/reports",
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center gap-2 p-4">
        <div className="flex items-center gap-2 font-semibold text-sidebar-foreground">
          <ShieldAlert className="h-6 w-6 text-blue-600" />
          <span>FraudWise Insights</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>General</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild>
                    <Link
                      to={item.path}
                      className={cn(
                        "flex items-center h-10",
                        location.pathname === item.path &&
                          "bg-blue-100 text-blue-600"
                      )}
                    >
                      <item.icon className="mr-2 h-5 w-5" />
                      <span>{item.title}</span>
                      {item.badge && (
                        <Badge className="ml-auto bg-red-500">
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Administration</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild>
                    <Link
                      to={item.path}
                      className={cn(
                        "flex items-center",
                        location.pathname === item.path &&
                          "bg-sidebar-accent text-sidebar-accent-foreground"
                      )}
                    >
                      <item.icon className="mr-2 h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-xs font-medium text-sidebar-foreground">Admin</p>
              <p className="text-xs text-sidebar-foreground/60">Administrator</p>
            </div>
          </div>
          <Link to="/settings">
            <Settings className="h-5 w-5 text-sidebar-foreground/60 hover:text-sidebar-foreground" />
          </Link>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
