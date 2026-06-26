'use client';

import { useState } from 'react';
import { Palette, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/context/ThemeContext';

export default function ColorPicker() {
  const { colors, toggleDarkMode } = useTheme();
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

          </div>
        </>
      )}
    </div>
  );
}
