import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { Activity, Bell, Search, Menu, X, Check, Trash2, LogOut, LogIn, UserPlus } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { fetchGlobalSearch, fetchNotifications, markNotificationRead, deleteNotification } from "@/services/api";

type NavItem = { label: string; to: string; icon: LucideIcon };

export function DashboardShell({
  role,
  roleColor,
  nav,
  user,
  children,
}: {
  role: string;
  roleColor: string;
  nav: NavItem[];
  user: { name: string; img?: string };
  children: ReactNode;
}) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Notification state
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      setIsAuth(!!token);
    }
  }, []);

  // Fetch notifications
  const loadNotifications = async () => {
    try {
      const data = await fetchNotifications();
      if (data?.notifications) {
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (err) {
      console.error("Notifications fetch error:", err);
    }
  };

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 15000);
    return () => clearInterval(interval);
  }, []);

  // Global search handler
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setSearchOpen(false);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        setIsSearching(true);
        const data = await fetchGlobalSearch(searchQuery);
        setSearchResults(data?.results || []);
        setSearchOpen(true);
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setIsSearching(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside listeners
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkRead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await markNotificationRead(id);
      loadNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteNotif = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteNotification(id);
      loadNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    navigate({ to: "/login" });
  };

  return (
    <div className="flex min-h-screen bg-[oklch(0.98_0.01_240)] dark:bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r bg-card p-4 md:flex">
        <Link to="/" className="mb-6 flex items-center gap-2 px-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-teal to-navy text-white">
            <Activity className="h-5 w-5" />
          </div>
          <span className="font-display font-bold">DoctorFind AI</span>
        </Link>
        <div className="mb-4 inline-flex w-fit rounded-full px-3 py-1 text-[10px] font-bold tracking-widest text-white" style={{ background: roleColor }}>
          {role}
        </div>
        <nav className="flex flex-col gap-1">
          {nav.map((item) => {
            const active = path === item.to;
            const Icon = item.icon;
            if (item.label === "Logout") {
              return (
                <button
                  key={item.label}
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950 font-medium mt-2 border-t pt-3"
                >
                  <Icon className="h-4 w-4" />
                  Logout
                </button>
              );
            }
            return (
              <Link
                key={item.label}
                to={item.to}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${active ? "bg-accent font-semibold text-foreground" : "text-muted-foreground hover:bg-accent/60"}`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex bg-black/50 md:hidden">
          <div className="w-64 bg-card p-4 flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
              <Link to="/" className="flex items-center gap-2">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-teal to-navy text-white">
                  <Activity className="h-5 w-5" />
                </div>
                <span className="font-display font-bold">DoctorFind AI</span>
              </Link>
              <button onClick={() => setMobileOpen(false)} className="p-1 rounded-lg hover:bg-accent">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex flex-col gap-1 flex-1 overflow-y-auto">
              {nav.map((item) => {
                const active = path === item.to;
                const Icon = item.icon;
                if (item.label === "Logout") {
                  return (
                    <button
                      key={item.label}
                      onClick={() => { setMobileOpen(false); handleLogout(); }}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition text-rose-500 hover:bg-rose-50 font-medium mt-2 border-t pt-3"
                    >
                      <Icon className="h-4 w-4" />
                      Logout
                    </button>
                  );
                }
                return (
                  <Link
                    key={item.label}
                    to={item.to}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${active ? "bg-accent font-semibold text-foreground" : "text-muted-foreground hover:bg-accent/60"}`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="flex-1 min-w-0">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b bg-card/80 px-4 md:px-6 py-3 backdrop-blur">
          <div className="flex items-center gap-2 md:hidden">
            <button onClick={() => setMobileOpen(true)} className="p-2 rounded-lg hover:bg-accent">
              <Menu className="h-5 w-5" />
            </button>
          </div>

          {/* Global Search Input with Auto-Suggestions */}
          <div ref={searchRef} className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchQuery.trim() && setSearchOpen(true)}
              placeholder="Search doctors, hospitals, medicines, records, symptoms..."
              className="w-full rounded-full border bg-background py-2 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-teal/40"
            />
            {searchOpen && (
              <div className="absolute left-0 right-0 top-full mt-2 z-50 max-h-80 overflow-y-auto rounded-2xl border bg-card p-2 shadow-xl">
                {isSearching ? (
                  <div className="p-4 text-center text-xs text-muted-foreground">Searching...</div>
                ) : searchResults.length > 0 ? (
                  searchResults.map((res, i) => (
                    <div
                      key={i}
                      onClick={() => {
                        setSearchOpen(false);
                        setSearchQuery("");
                        navigate({ to: res.link });
                      }}
                      className="flex items-center justify-between rounded-xl p-2.5 text-sm transition hover:bg-accent cursor-pointer"
                    >
                      <div>
                        <div className="font-semibold text-foreground">{res.title}</div>
                        <div className="text-xs text-muted-foreground">{res.subtitle}</div>
                      </div>
                      <span className="rounded-full bg-teal/10 px-2.5 py-0.5 text-[10px] font-bold text-teal">
                        {res.type}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-xs text-muted-foreground">No matching results found</div>
                )}
              </div>
            )}
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-3">
            {/* Notification Bell Dropdown */}
            <div ref={notifRef} className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative grid h-9 w-9 place-items-center rounded-full hover:bg-accent transition"
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 md:w-96 z-50 rounded-2xl border bg-card p-3 shadow-2xl">
                  <div className="flex items-center justify-between border-b pb-2 px-1">
                    <span className="font-display text-sm font-bold">Notifications</span>
                    <Link to="/patient/notifications" onClick={() => setNotifOpen(false)} className="text-xs font-semibold text-teal hover:underline">
                      View All
                    </Link>
                  </div>
                  <div className="mt-2 max-h-72 overflow-y-auto space-y-1.5">
                    {notifications.length > 0 ? (
                      notifications.slice(0, 5).map((n) => (
                        <div
                          key={n._id}
                          className={`group flex items-start gap-2.5 rounded-xl p-2.5 text-xs transition ${n.read ? "bg-card" : "bg-teal/5 font-medium"}`}
                        >
                          <div className="mt-0.5 h-2 w-2 rounded-full shrink-0 bg-teal" />
                          <div className="flex-1">
                            <div className="font-semibold">{n.title}</div>
                            <div className="text-muted-foreground mt-0.5 leading-snug">{n.message}</div>
                          </div>
                          <div className="flex gap-1 opacity-80 group-hover:opacity-100">
                            {!n.read && (
                              <button onClick={(e) => handleMarkRead(n._id, e)} className="p-1 hover:text-teal" title="Mark read">
                                <Check className="h-3.5 w-3.5" />
                              </button>
                            )}
                            <button onClick={(e) => handleDeleteNotif(n._id, e)} className="p-1 hover:text-rose-500" title="Delete">
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-6 text-center text-xs text-muted-foreground">No notifications yet</div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Auth Buttons vs User Profile */}
            {isAuth ? (
              <div className="flex items-center gap-2">
                <Link to="/patient/profile" className="flex items-center gap-3 hover:opacity-90 transition">
                  <div className="h-9 w-9 overflow-hidden rounded-full bg-accent border">
                    <img
                      src={
                        user.img ||
                        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"
                      }
                      alt={user.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <span className="font-medium hidden sm:inline text-sm">{user.name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="hidden md:flex items-center gap-1 rounded-xl border px-3 py-1.5 text-xs font-semibold text-rose-500 hover:bg-rose-50"
                  title="Logout"
                >
                  <LogOut className="h-3.5 w-3.5" /> Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold hover:bg-accent">
                  <LogIn className="h-3.5 w-3.5 text-teal" /> Log In
                </Link>
                <Link to="/signup" className="flex items-center gap-1.5 rounded-xl bg-teal px-3 py-1.5 text-xs font-semibold text-white shadow hover:opacity-90">
                  <UserPlus className="h-3.5 w-3.5" /> Create Account
                </Link>
              </div>
            )}
          </div>
        </header>

        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}