'use client';

import { useState } from 'react';
import { Palette, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/context/ThemeContext';

const PRESET_COLORS = [
  '#ffffff', // White
  '#f8fafc', // Slate 50
  '#f1f5f9', // Slate 100
  '#e2e8f0', // Slate 200
  '#cbd5e1', // Slate 300
  '#94a3b8', // Slate 400
  '#64748b', // Slate 500
  '#475569', // Slate 600
  '#334155', // Slate 700
  '#1e293b', // Slate 800
  '#0f172a', // Slate 900
  '#020617', // Slate 950
  '#3b82f6', // Blue 500
  '#2563eb', // Blue 600
  '#1d4ed8', // Blue 700
  '#10b981', // Emerald 500
  '#059669', // Emerald 600
  '#047857', // Emerald 700
  '#f59e0b', // Amber 500
  '#d97706', // Amber 600
  '#b45309', // Amber 700
  '#8b5cf6', // Violet 500
  '#7c3aed', // Violet 600
  '#6d28d9', // Violet 700
];

export default function ColorPicker() {
  const { colors, setLayoutColor, toggleDarkMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Palette className="h-5 w-5" />
      </Button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-50"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-12 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-80">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm">Tùy chỉnh giao diện</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-6 w-6"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Dark Mode Toggle */}
            <div className="mb-4 pb-4 border-b border-gray-200">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm font-medium">Chế độ tối</span>
                <button
                  onClick={toggleDarkMode}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    colors.darkMode ? 'bg-primary' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      colors.darkMode ? 'left-7' : 'left-1'
                    }`}
                  />
                </button>
              </label>
            </div>

            {/* Layout Color */}
            <div>
              <label className="block text-sm font-medium mb-2">Màu Layout (Sidebar & Top Bar)</label>
              <div className="grid grid-cols-6 gap-2 mb-2">
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => setLayoutColor(color)}
                    className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                      colors.layoutColor === color ? 'border-primary ring-2 ring-primary ring-offset-2' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
              <input
                type="color"
                value={colors.layoutColor}
                onChange={(e) => setLayoutColor(e.target.value)}
                className="w-full h-8 rounded cursor-pointer"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
