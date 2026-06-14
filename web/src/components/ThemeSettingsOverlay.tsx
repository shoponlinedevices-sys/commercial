'use client';

import { useState } from 'react';
import { X, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ThemeSettingsOverlay({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-80 h-full bg-white dark:bg-gray-900 shadow-2xl p-6 overflow-y-auto">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-4 right-4"
        >
          <X className="h-5 w-5" />
        </Button>

        <h2 className="text-xl font-bold mb-6 mt-8">Độ sáng giao diện</h2>

        <div className="space-y-6">
          <div>
            <h3 className="font-semibold mb-3">Sidebar</h3>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="flex-1">
                <Moon className="h-4 w-4 mr-2" />
                Tối
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                Mặc định
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <Sun className="h-4 w-4 mr-2" />
                Sáng
              </Button>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Topbar</h3>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="flex-1">
                <Moon className="h-4 w-4 mr-2" />
                Tối
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                Mặc định
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <Sun className="h-4 w-4 mr-2" />
                Sáng
              </Button>
            </div>
          </div>

          <div className="pt-6 border-t">
            <h3 className="font-semibold mb-3">Tổng quan</h3>
            <div className="bg-gray-900 rounded-lg p-4 mb-3">
              <div className="aspect-video bg-gradient-to-br from-purple-600 to-blue-600 rounded-md mb-2" />
            </div>
            <p className="text-sm text-muted-foreground">
              Giao diện tối giúp giảm mỏi mắt khi làm việc trong môi trường thiếu sáng.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
