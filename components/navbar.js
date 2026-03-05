"use client"
// import { Setting }  from "lucide-react"
// import LogOut from "lucide-react"
import { useEffect, useState } from "react"

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false)
    const routes = [
        {name: "Home", href: "/"},
        {name: "workspaces", href: "/workspaces"},
        {name: "profile", href: "/profile"}
    ];
    const icons = [
        // {icon: <Setting />, href: "/settings"},
        // {icon: <LogOut />, href: "/login"}
    ];

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10)
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return(
        <nav className={`position-sticky top-0 z-50 transition-all duration-300 p-8 text-3xl ${scrolled ? "backdrop-blue": "bg-transparent"}`}>
            <h1 className="text-vertex-primary font-bold">Vertex</h1>
        </nav>
    )
}