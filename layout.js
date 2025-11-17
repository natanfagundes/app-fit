import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Home, CreditCard, Trophy, Activity, Users, User as UserIcon, LogOut } from "lucide-react";
import { base44 } from "@/api/base44Client";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const navigationItems = [
  {
    title: "Início",
    url: createPageUrl("Home"),
    icon: Home,
  },
  {
    title: "Planos",
    url: createPageUrl("Planos"),
    icon: CreditCard,
  },
  {
    title: "Partidas",
    url: createPageUrl("Partidas"),
    icon: Trophy,
  },
  {
    title: "Minhas Atividades",
    url: createPageUrl("Atividades"),
    icon: Activity,
  },
  {
    title: "Equipes",
    url: createPageUrl("Equipes"),
    icon: Users,
  },
  {
    title: "Perfil",
    url: createPageUrl("Perfil"),
    icon: UserIcon,
  },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  return (
    <SidebarProvider>
      <style>
        {`
          :root {
            --primary: 142 71% 45%;
            --secondary: 217 91% 60%;
            --accent: 160 84% 39%;
          }
        `}
      </style>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 via-green-50/30 to-blue-50/30">
        <Sidebar className="border-r border-green-100/50 backdrop-blur-xl bg-white/80">
          <SidebarHeader className="border-b border-green-100/50 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/20">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-xl bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  Pelada App
                </h2>
                <p className="text-xs text-slate-500">Seu futebol society</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-3">
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                  {navigationItems.map((item) => {
                    const isActive = location.pathname === item.url;
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton 
                          asChild 
                          className={`rounded-xl transition-all duration-200 ${
                            isActive 
                              ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg shadow-green-500/30' 
                              : 'hover:bg-green-50/50'
                          }`}
                        >
                          <Link to={item.url} className="flex items-center gap-3 px-4 py-3">
                            <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-600'}`} />
                            <span className={`font-medium ${isActive ? 'text-white' : 'text-slate-700'}`}>
                              {item.title}
                            </span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {user?.subscription_status === 'active' && (
              <SidebarGroup>
                <div className="mx-3 mt-4 p-4 rounded-2xl bg-gradient-to-br from-green-500/10 to-blue-500/10 border border-green-200/50">
                  <div className="text-xs font-semibold text-green-700 mb-2">PLANO ATIVO</div>
                  <div className="font-bold text-slate-800">{user.subscription_plan_name || 'Premium'}</div>
                  <div className="text-sm text-slate-600 mt-2">
                    Partidas: {user.check_ins_used_this_month || 0}
                  </div>
                </div>
              </SidebarGroup>
            )}
          </SidebarContent>

          <SidebarFooter className="border-t border-green-100/50 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-400 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {user?.full_name?.[0]?.toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 text-sm truncate">
                    {user?.full_name || 'Usuário'}
                  </p>
                  <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={() => base44.auth.logout()}
                className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                title="Sair"
              >
                <LogOut className="w-4 h-4 text-slate-400 group-hover:text-red-500" />
              </button>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          <header className="bg-white/80 backdrop-blur-xl border-b border-green-100/50 px-6 py-4 md:hidden">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-green-50 p-2 rounded-xl transition-colors" />
              <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Pelada App
              </h1>
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}