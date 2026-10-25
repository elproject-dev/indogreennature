"use client";
import React, { useState, useEffect } from "react";
import { BiHomeSmile, BiBox, BiBarcodeReader, BiMap } from "react-icons/bi";
import { MdOutlineEvent } from "react-icons/md";
import Image from "next/image";
import Link from "next/link";
import { outfit, getHeroFontClass, getHeroFontFamily } from "@/lib/fonts"
import { cn } from "@/lib/utils";

import { supabase } from "@/lib/supabase";
import { useRouter, usePathname } from "next/navigation";
import { LogOutIcon, CircleUser } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";


const DEFAULT_TOPBAR_CONFIG = {
    mode: "logo_and_text",
    logoUrl: "https://ivtpcjwwenjdatxxtjqm.supabase.co/storage/v1/object/public/media/topbar_logo/1792167656711-logo.png",
    logoSize: 32,
    logoColor: "white",
    bgColor: "#338f1e",
    menuTextColor: "default",
    menuActiveColor: "#98fd91",
    menuTextSize: 13,
    menuFont: "mclaren",
    companyName: "CV.INDO GREEN NATURE",
    textSize: 16,
};

export function TopBar() {
    const router = useRouter();
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);
    const [user, setUser] = useState<{ name: string; email: string; avatar: string }>({
        name: "Belum Login",
        email: "Mode Tamu",
        avatar: "",
    });
    const [logoConfig, setLogoConfig] = useState(DEFAULT_TOPBAR_CONFIG);

    useEffect(() => {
        setMounted(true);

        // Load custom cached user if available
        try {
            const cachedUser = localStorage.getItem("topbar_cached_user");
            if (cachedUser) {
                const parsed = JSON.parse(cachedUser);
                if (parsed && typeof parsed.name === "string") setUser(parsed);
            }
        } catch (e) {}

        // Load custom cached logo config if available
        try {
            const cached = localStorage.getItem("topbar_logo_config");
            if (cached) {
                const parsed = JSON.parse(cached);
                const isLegacyLogo = parsed.logoUrl && (
                    parsed.logoUrl.startsWith("/LOGO AI NEW") ||
                    parsed.logoUrl.startsWith("/2sbagiamu") ||
                    parsed.logoUrl.startsWith("/logo") ||
                    parsed.logoUrl.startsWith("/badge-icon")
                );
                setLogoConfig({
                    mode: parsed.mode || DEFAULT_TOPBAR_CONFIG.mode,
                    logoUrl: isLegacyLogo ? "" : (parsed.logoUrl !== undefined ? parsed.logoUrl : DEFAULT_TOPBAR_CONFIG.logoUrl),
                    logoSize: parsed.logoSize ? Number(parsed.logoSize) : DEFAULT_TOPBAR_CONFIG.logoSize,
                    logoColor: parsed.logoColor || DEFAULT_TOPBAR_CONFIG.logoColor,
                    bgColor: parsed.bgColor || DEFAULT_TOPBAR_CONFIG.bgColor,
                    menuTextColor: parsed.menuTextColor || DEFAULT_TOPBAR_CONFIG.menuTextColor,
                    menuActiveColor: parsed.menuActiveColor || DEFAULT_TOPBAR_CONFIG.menuActiveColor,
                    menuTextSize: parsed.menuTextSize ? Number(parsed.menuTextSize) : DEFAULT_TOPBAR_CONFIG.menuTextSize,
                    menuFont: parsed.menuFont || DEFAULT_TOPBAR_CONFIG.menuFont,
                    companyName: parsed.companyName || DEFAULT_TOPBAR_CONFIG.companyName,
                    textSize: parsed.textSize ? Number(parsed.textSize) : DEFAULT_TOPBAR_CONFIG.textSize,
                });
            }
        } catch (e) {}

        const fetchUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            const userData = session?.user ? {
                name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email?.split('@')[0] || "Pengguna",
                email: session.user.email || "",
                avatar: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture || "",
            } : { name: "Belum Login", email: "Mode Tamu", avatar: "" };

            setUser(userData);
            try {
                localStorage.setItem("topbar_cached_user", JSON.stringify(userData));
            } catch (e) {}
        };
        fetchUser();

        // Fetch topbar logo config from Supabase app_config (only re-render if actually changed)
        const fetchLogoConfig = async () => {
            try {
                const { data } = await supabase
                    .from("app_config")
                    .select("key, value")
                    .in("key", [
                        "topbar_display_mode",
                        "topbar_logo_url",
                        "topbar_logo_size",
                        "topbar_logo_color",
                        "topbar_bg_color",
                        "topbar_menu_text_color",
                        "topbar_menu_active_color",
                        "topbar_menu_text_size",
                        "topbar_menu_font",
                        "topbar_company_name",
                        "topbar_text_size",
                    ]);

                if (data && data.length > 0) {
                    const cfg: Record<string, string> = {};
                    data.forEach((item: any) => {
                        cfg[item.key] = item.value;
                    });
                    setLogoConfig(prev => {
                        const rawUrl = cfg.topbar_logo_url !== undefined ? cfg.topbar_logo_url : prev.logoUrl;
                        const isLegacy = rawUrl && (
                            rawUrl.startsWith("/LOGO AI NEW") ||
                            rawUrl.startsWith("/2sbagiamu") ||
                            rawUrl.startsWith("/logo") ||
                            rawUrl.startsWith("/badge-icon")
                        );
                        const cleanLogoUrl = isLegacy ? "" : rawUrl;
                        const updated = {
                            mode: cfg.topbar_display_mode || prev.mode,
                            logoUrl: cleanLogoUrl,
                            logoSize: cfg.topbar_logo_size ? parseInt(cfg.topbar_logo_size, 10) : prev.logoSize,
                            logoColor: cfg.topbar_logo_color || prev.logoColor,
                            bgColor: cfg.topbar_bg_color || prev.bgColor || "primary",
                            menuTextColor: cfg.topbar_menu_text_color || prev.menuTextColor || "default",
                            menuActiveColor: cfg.topbar_menu_active_color || prev.menuActiveColor || "default",
                            menuTextSize: cfg.topbar_menu_text_size ? parseInt(cfg.topbar_menu_text_size, 10) : prev.menuTextSize,
                            menuFont: cfg.topbar_menu_font || prev.menuFont || "outfit",
                            companyName: cfg.topbar_company_name || prev.companyName,
                            textSize: cfg.topbar_text_size ? parseInt(cfg.topbar_text_size, 10) : prev.textSize,
                        };
                        const isSame =
                            prev.mode === updated.mode &&
                            prev.logoUrl === updated.logoUrl &&
                            prev.logoSize === updated.logoSize &&
                            prev.logoColor === updated.logoColor &&
                            prev.bgColor === updated.bgColor &&
                            prev.menuTextColor === updated.menuTextColor &&
                            prev.menuActiveColor === updated.menuActiveColor &&
                            prev.menuTextSize === updated.menuTextSize &&
                            prev.menuFont === updated.menuFont &&
                            prev.companyName === updated.companyName &&
                            prev.textSize === updated.textSize;
                        if (isSame) return prev;

                        try {
                            localStorage.setItem("topbar_logo_config", JSON.stringify(updated));
                        } catch (e) {}
                        return updated;
                    });
                }
            } catch (e) {}
        };
        fetchLogoConfig();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
            const userData = session?.user ? {
                name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email?.split('@')[0] || "Pengguna",
                email: session.user.email || "",
                avatar: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture || "",
            } : { name: "Belum Login", email: "Mode Tamu", avatar: "" };

            setUser(userData);
            try {
                localStorage.setItem("topbar_cached_user", JSON.stringify(userData));
            } catch (e) {}
        });

        // Listen for live instant preview updates
        const handleConfigUpdate = (e: any) => {
            if (e.detail) {
                setLogoConfig(prev => {
                    const updated = { ...prev, ...e.detail };
                    try {
                        localStorage.setItem("topbar_logo_config", JSON.stringify(updated));
                    } catch (err) {}
                    return updated;
                });
            }
        };
        window.addEventListener("topbar-config-updated", handleConfigUpdate as EventListener);

        // Listen for instant auth state sync
        const handleAuthChanged = (e: any) => {
            if (e.detail?.user) {
                setUser(e.detail.user);
            }
        };
        window.addEventListener("auth-state-changed", handleAuthChanged as EventListener);

        return () => {
            subscription.unsubscribe();
            window.removeEventListener("topbar-config-updated", handleConfigUpdate as EventListener);
            window.removeEventListener("auth-state-changed", handleAuthChanged as EventListener);
        };
    }, []);

    const handleLogout = async () => {
        try {
            localStorage.setItem("topbar_cached_user", JSON.stringify({ name: "Belum Login", email: "Mode Tamu", avatar: "" }));
        } catch (e) {}

        if (user?.name === "Belum Login") {
            router.push("/login");
        } else {
            await supabase.auth.signOut();
            router.push("/");
        }
    };

    const bgStyle = logoConfig.bgColor && logoConfig.bgColor !== "primary"
        ? { backgroundColor: logoConfig.bgColor }
        : undefined;

    return (
        <div
            style={bgStyle}
            suppressHydrationWarning
            className={cn(
                "absolute top-0 left-0 w-full h-[50px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] z-50 transition-colors",
                (!logoConfig.bgColor || logoConfig.bgColor === "primary") && "bg-primary"
            )}
        >
            <div className="w-full max-w-[1440px] mx-auto h-full px-4 lg:px-[20px] flex items-center justify-between relative">
                {/* Logo CV. Indo Green Nature */}
                <div className="flex items-center z-10" suppressHydrationWarning>
                    <Link
                        href="/"
                        className="flex items-center gap-[10px] select-none cursor-pointer group hover:opacity-90 active:scale-[0.98] transition-all text-left"
                    >
                        {logoConfig.mode !== "text_only" && Boolean(logoConfig.logoUrl) && (
                            <img
                                src={logoConfig.logoUrl}
                                alt={logoConfig.companyName || "CV. Indo Green Nature"}
                                width={160}
                                height={logoConfig.logoSize || 32}
                                loading="eager"
                                decoding="async"
                                style={{
                                    height: `${logoConfig.logoSize}px`,
                                    width: "auto",
                                    maxHeight: "46px",
                                }}
                                className={cn(
                                    "object-contain drop-shadow-sm select-none group-hover:scale-105 transition-transform",
                                    logoConfig.logoColor === "white" ? "brightness-0 invert" : ""
                                )}
                                onError={(e) => {
                                    (e.target as HTMLElement).style.display = "none";
                                }}
                            />
                        )}
                        {(logoConfig.mode === "logo_and_text" || logoConfig.mode === "text_only" || !logoConfig.logoUrl) && (
                            <span
                                style={{
                                    fontSize: `${logoConfig.textSize}px`,
                                    ...(logoConfig.menuTextColor && logoConfig.menuTextColor !== "default" ? { color: logoConfig.menuTextColor } : {})
                                }}
                                className={cn(
                                    "font-sans font-[700] leading-none transition-colors tracking-wide",
                                    (!logoConfig.menuTextColor || logoConfig.menuTextColor === "default") && "text-primary-foreground group-hover:text-primary-soft"
                                )}
                            >
                                {logoConfig.companyName || "CV. Indo Green Nature"}
                            </span>
                        )}
                    </Link>
                </div>

                {/* Top Navigation - Centered (Desktop) */}
                <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 items-center justify-center gap-[24px] xl:gap-[32px] w-auto h-[25px]" suppressHydrationWarning>
                    {[
                        { href: "/", label: "Home" },
                        { href: "/our-products", label: "Products" },
                        { href: "/insight", label: "Insight" },
                        { href: "/about", label: "About" },
                        { href: "/legality", label: "Legality" },
                        { href: "/contact", label: "Contact" },
                    ].map((item) => {
                        const isActive = item.href === "/"
                            ? (pathname === "/" || pathname?.startsWith('/home'))
                            : pathname?.startsWith(item.href);

                        const resolvedActiveColor = (!logoConfig.menuActiveColor || logoConfig.menuActiveColor === "default" || logoConfig.menuActiveColor.toLowerCase() === "#32e24f")
                            ? "#ffffff"
                            : logoConfig.menuActiveColor;

                        const itemStyle: React.CSSProperties = {
                            fontSize: `${logoConfig.menuTextSize || 20}px`,
                            lineHeight: `${(logoConfig.menuTextSize || 20) + 5}px`,
                            fontFamily: getHeroFontFamily(logoConfig.menuFont),
                            ...(isActive
                                ? { color: resolvedActiveColor }
                                : (logoConfig.menuTextColor && logoConfig.menuTextColor !== "default"
                                    ? { color: logoConfig.menuTextColor }
                                    : {})),
                        };

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                style={itemStyle}
                                className={cn(
                                    "transition-colors",
                                    getHeroFontClass(logoConfig.menuFont),
                                    isActive ? "font-[700] hover:opacity-90 underline underline-offset-4 decoration-2" : "font-[300] hover:opacity-80",
                                    isActive && (!logoConfig.menuActiveColor || logoConfig.menuActiveColor === "default") && "text-white",
                                    !isActive && (!logoConfig.menuTextColor || logoConfig.menuTextColor === "default") && "text-primary-foreground hover:text-white"
                                )}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </div>

                {/* Right side: Avatar & User Dropdown */}
                <div className="flex items-center gap-2.5 sm:gap-3 lg:gap-[16px]" suppressHydrationWarning>
                    <DropdownMenu>
                        <DropdownMenuTrigger
                            className="flex items-center justify-center outline-none cursor-pointer"
                            aria-label={user.name && user.name !== "Belum Login" ? `Menu Akun ${user.name}` : "Menu Akun Pengguna"}
                        >
                            {user.name !== "Belum Login" && Boolean(user.name) ? (
                                <Avatar className="w-[36px] h-[36px] rounded-full border-2 border-primary/30 cursor-pointer hover:opacity-90 transition-opacity bg-card-alt">
                                    <AvatarImage src={user.avatar || undefined} alt={user.name || "User"} referrerPolicy="no-referrer" />
                                    <AvatarFallback className="rounded-full bg-card-alt text-primary">
                                        {user.name.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                            ) : (
                                <div className="w-[36px] h-[36px] rounded-full border-2 border-primary/30 cursor-pointer hover:opacity-90 transition-opacity flex items-center justify-center bg-card-alt text-primary">
                                    <CircleUser className="w-[20px] h-[20px] stroke-[1.5]" />
                                    <span className="sr-only">Menu Akun Pengguna</span>
                                </div>
                            )}
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            className="min-w-56 rounded-sm bg-card-alt border-primary/20 text-primary"
                            side="bottom"
                            align="end"
                            sideOffset={8}
                        >
                            <DropdownMenuGroup>
                                <DropdownMenuLabel className="p-0 font-normal">
                                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                        {user.name !== "Belum Login" && Boolean(user.name) ? (
                                            <Avatar className="size-8 border border-primary/20">
                                                <AvatarImage src={user.avatar || undefined} alt={user.name || "User"} referrerPolicy="no-referrer" />
                                                <AvatarFallback className="rounded-full text-xs bg-primary/20 text-primary">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                        ) : (
                                            <div className="size-8 rounded-full flex items-center justify-center bg-background border border-primary/20 text-primary">
                                                <CircleUser className="size-5 stroke-[1.5]" />
                                            </div>
                                        )}
                                        <div className="grid flex-1 text-left text-sm leading-tight">
                                            <span className="truncate font-medium">{user.name}</span>
                                            <span className="truncate text-xs text-primary/70">
                                                {user.email}
                                            </span>
                                        </div>
                                    </div>
                                </DropdownMenuLabel>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator className="bg-primary/10" />
                            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:bg-red-500 focus:!text-white focus:**:!text-white dark:text-red-500 dark:focus:bg-red-600 dark:focus:!text-white">
                                <LogOutIcon className="mr-2 h-4 w-4" />
                                {user.name === "Belum Login" ? "Masuk / Login" : "Keluar"}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

        </div>
    );
}
