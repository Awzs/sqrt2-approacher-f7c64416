import React from 'react';

interface FooterNoteProps {
  className?: string;
}

export const FooterNote: React.FC<FooterNoteProps> = ({ className = '' }) => {
  return (
    <footer className={`text-center text-sm text-muted-foreground border-t pt-6 mt-8 ${className}`}>
      <div className="space-y-3">
        {/* Educational explanation */}
        <div className="max-w-2xl mx-auto space-y-2">
          <p className="font-medium text-foreground">
            关于无理数 √2
          </p>
          <p className="text-xs leading-relaxed">
            √2 是一个无理数，这意味着它不能表示为两个整数的比值（分数）。
            虽然我们无法写出它的精确小数形式，但可以通过逐步逼近的方法，
            获得任意精度的近似值。这个过程展示了数学中"无限逼近"的重要概念。
          </p>
        </div>
        
        {/* Copyright and version */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-xs opacity-75">
          <span>© 2024 数学教学演示工具</span>
          <span className="hidden sm:inline">•</span>
          <span>版本 1.0</span>
          <span className="hidden sm:inline">•</span>
          <span>构建于 React + TypeScript</span>
        </div>
        
        {/* Accessibility note */}
        <div className="text-xs opacity-60">
          <span>支持键盘操作和屏幕阅读器访问</span>
        </div>
      </div>
    </footer>
  );
};