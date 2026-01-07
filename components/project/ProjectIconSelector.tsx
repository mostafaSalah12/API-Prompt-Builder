"use client";

import { useState } from "react";
import * as Icons from "lucide-react";

interface ProjectIconSelectorProps {
    value: { icon: string; color: string };
    onChange: (value: { icon: string; color: string }) => void;
}

const COLORS = [
    { name: "Blue", value: "blue", class: "bg-blue-500" },
    { name: "Purple", value: "purple", class: "bg-purple-500" },
    { name: "Green", value: "green", class: "bg-green-500" },
    { name: "Orange", value: "orange", class: "bg-orange-500" },
    { name: "Pink", value: "pink", class: "bg-pink-500" },
    { name: "Red", value: "red", class: "bg-red-500" },
    { name: "Slate", value: "slate", class: "bg-slate-500" },
];

const ICONS = [
    "Folder", "Layout", "Box", "Layers", "Database", "Globe", 
    "Server", "Cloud", "Zap", "Activity", "Command", "Cpu", 
    "HardDrive", "Smartphone", "Terminal", "Code", "ShoppingCart",
    "Bell", "Car", "Map"
];

export function ProjectIconSelector({ value, onChange }: ProjectIconSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);

    const CurrentIcon = (Icons as any)[value.icon] || Icons.Folder;

    return (
        <div className="flex flex-col gap-3">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Project Icon & Color</label>
            <div className="flex gap-4">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className={`flex items-center justify-center size-12 rounded-xl transition-all border-2 ${
                        isOpen ? "border-blue-500 scale-105" : "border-slate-200 dark:border-slate-800 hover:scale-105"
                    }`}
                    style={{
                        backgroundColor: `${getColorHex(value.color)}20`,
                        borderColor: isOpen ? getColorHex(value.color) : undefined,
                        color: getColorHex(value.color)
                    }}
                >
                    <CurrentIcon size={24} />
                </button>
                    
                <div className="flex flex-col justify-center cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">Customize Appearance</p>
                    <p className="text-xs text-slate-500">Pick an icon and color for your dashboard.</p>
                </div>
            </div>

            {isOpen && (
                <div className="mt-2 p-6 bg-slate-50 dark:bg-[#111a22] rounded-xl border border-slate-200 dark:border-slate-800 animate-in slide-in-from-top-2 duration-200">
                    <div className="mb-6">
                        <label className="text-xs font-bold text-slate-500 uppercase mb-3 block">Color</label>
                        <div className="flex flex-wrap gap-3">
                            {COLORS.map((color) => (
                                <button
                                    key={color.value}
                                    type="button"
                                    onClick={() => onChange({ ...value, color: color.value })}
                                    className={`size-8 rounded-full transition-transform hover:scale-110 ${color.class} ${value.color === color.value ? 'ring-2 ring-offset-2 ring-blue-500 dark:ring-offset-[#1e2936]' : ''}`}
                                    title={color.name}
                                />
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-3 block">Icon</label>
                        <div className="grid grid-cols-6 sm:grid-cols-8 gap-3">
                            {ICONS.map((iconName) => {
                                const Icon = (Icons as any)[iconName];
                                return (
                                    <button
                                        key={iconName}
                                        type="button"
                                        onClick={() => onChange({ ...value, icon: iconName })}
                                        className={`flex items-center justify-center p-3 rounded-xl hover:bg-white dark:hover:bg-[#1e2936] transition-all ${value.icon === iconName ? 'bg-white dark:bg-[#1e2936] shadow-md ring-1 ring-inset' : 'text-slate-400'}`}
                                        style={value.icon === iconName ? { color: getColorHex(value.color), borderColor: getColorHex(value.color) } : undefined}
                                    >
                                        <Icon size={20} />
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Helper to map color names to hex for the bg-opacity style
function getColorHex(color: string) {
    const map: Record<string, string> = {
        blue: "#3b82f6",
        purple: "#a855f7",
        green: "#22c55e",
        orange: "#f97316",
        pink: "#ec4899",
        red: "#ef4444",
        slate: "#64748b"
    };
    return map[color] || map.blue;
}
