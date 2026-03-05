"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

export default function ThemeToggle() {
    const {theme, setTheme} = useTheme()
    const [loading, setLoading] = useState(true);

    useEffect(() => {setLoading(false)}, [])

    const themes = [{
        name: "light",
        icon: <Sun />
    },{
        name: "dark",
        icon: <Moon />
    },{
        name: "system",
        icon: <Monitor />
    }];

    if(loading) return null

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">{themes.find(t => t.name === theme)?.icon}</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuGroup>
                    <DropdownMenuLabel>Themes</DropdownMenuLabel>
                    {themes.map(t => (
                        <DropdownMenuItem key={t.name} onClick={() => setTheme(t.name)} className="cursor-pointer flex gap-4 items-center">{t.name} {t.icon}</DropdownMenuItem>
                    ))}
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}