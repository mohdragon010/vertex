"use client"
import { useEffect, useState } from "react"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "./ui/breadcrumb";
import { usePathname } from "next/navigation";
import { LogOut, Menu, Settings, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import useAuth from "@/hooks/useAuth";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
    const pathname = usePathname()
    const pathArr = pathname.split("/").filter((item) => item !== "")
    const [scrolled, setScrolled] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const { logout } = useAuth()

    const routes = [
        { name: "Home", href: "/" },
        { name: "Workspaces", href: "/workspaces" },
        { name: "Profile", href: "/profile" }
    ];

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20)
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [])

    // Close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false)
    }, [pathname])

    return (
        <nav
            className={`sticky top-0 z-50 transition-all duration-500 px-6 md:px-12 flex items-center h-20 w-full
            ${scrolled
                    ? "bg-background/80 backdrop-blur-xl border-b border-border/40 shadow-sm"
                    : "bg-transparent"}`}
        >
            <div className="flex items-center gap-4 md:gap-8 w-full max-w-7xl mx-auto">
                {/* Logo */}
                <Link href="/">
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-2"
                    >
                        <h1 className="text-2xl font-bold tracking-tight text-vertex-primary selection:bg-vertex-primary selection:text-white">
                            Vertex
                        </h1>
                    </motion.div>
                </Link>

                {/* Breadcrumb - Hidden on mobile */}
                <div className="hidden lg:block">
                    <Breadcrumb>
                        <BreadcrumbList>
                            {pathArr.length > 0 && <BreadcrumbSeparator />}
                            {pathArr.map((item, index) => (
                                <BreadcrumbItem key={index}>
                                    <BreadcrumbLink
                                        href={`/${pathArr.slice(0, index + 1).join("/")}`}
                                        className="capitalize text-sm font-medium transition-colors hover:text-vertex-primary"
                                    >
                                        {item.replace(/-/g, ' ')}
                                    </BreadcrumbLink>
                                    {index < pathArr.length - 1 && <BreadcrumbSeparator />}
                                </BreadcrumbItem>
                            ))}
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>

                {/* Desktop Navigation Links */}
                <div className="hidden md:flex items-center gap-1 ml-auto">
                    {routes.map((route) => {
                        let isActive;
                        if (route.href !== "/") {
                            isActive = "/" + pathArr[0] === route.href;
                        } else {
                            isActive = pathArr.length === 0;
                        }

                        return (
                            <Link key={route.href} href={route.href} className="relative px-4 py-2 group">
                                <span className={`text-sm font-medium transition-colors duration-300 
                                    ${isActive ? "text-vertex-primary" : "text-muted-foreground group-hover:text-foreground"}`}>
                                    {route.name}
                                </span>
                                {isActive && (
                                    <motion.div
                                        layoutId="nav-underline"
                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-vertex-primary mx-4"
                                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                    />
                                )}
                            </Link>
                        );
                    })}

                    <div className="h-4 w-px bg-border/60 mx-2" />

                    {/* Action Icons */}
                    <div className="flex items-center gap-1">
                        <ThemeToggle />

                        <Link href="/settings">
                            <motion.div
                                whileHover={{ scale: 1.1, backgroundColor: "var(--accent)" }}
                                whileTap={{ scale: 0.9 }}
                                className="p-2 rounded-full text-muted-foreground hover:text-vertex-primary transition-all"
                            >
                                <Settings size={20} strokeWidth={2.5} />
                            </motion.div>
                        </Link>

                        <button
                            onClick={() => logout()}
                            className="p-2 rounded-full text-muted-foreground hover:text-destructive transition-all cursor-pointer"
                        >
                            <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <LogOut size={20} strokeWidth={2.5} />
                            </motion.div>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Toggle */}
                <div className="flex md:hidden ml-auto items-center gap-2">
                    <ThemeToggle />
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="p-2 rounded-md hover:bg-accent transition-colors"
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="absolute top-20 left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-border shadow-2xl md:hidden z-40 overflow-hidden"
                    >
                        <div className="flex flex-col p-6 gap-2">
                            {routes.map((route, index) => {
                                const isActive = route.href === "/" ? pathArr.length === 0 : pathname.startsWith(route.href);
                                return (
                                    <motion.div
                                        key={route.href}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <Link
                                            href={route.href}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all active:scale-[0.98] ${isActive
                                                    ? "bg-vertex-primary text-white font-semibold shadow-md shadow-vertex-primary/20"
                                                    : "hover:bg-accent text-muted-foreground"
                                                }`}
                                        >
                                            <span className="text-lg">{route.name}</span>
                                        </Link>
                                    </motion.div>
                                )
                            })}

                            <div className="h-px bg-border/60 my-4 mx-4" />

                            <div className="grid grid-cols-2 gap-4 px-2 pb-2">
                                <Link href="/settings">
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="flex flex-col items-center justify-center p-4 rounded-xl border border-border bg-accent/30 gap-2 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        <Settings size={20} />
                                        <span className="text-xs font-medium">Settings</span>
                                    </motion.div>
                                </Link>

                                <motion.button
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.25 }}
                                    onClick={() => logout()}
                                    className="flex flex-col items-center justify-center p-4 rounded-xl border border-border bg-destructive/5 gap-2 text-destructive hover:bg-destructive/10 transition-all"
                                >
                                    <LogOut size={20} />
                                    <span className="text-xs font-medium">Logout</span>
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    )
}