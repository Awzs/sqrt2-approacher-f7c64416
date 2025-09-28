import React from 'react';
import { Play, Pause, SkipBack, SkipForward, RotateCcw, Table } from 'lucide-react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { CONFIG } from '../config';
import { PlayState } from '../logic/state';

interface ControlBarProps {
  playState: PlayState;
  currentStep: number;
  totalSteps: number;
  speed: number;
  precision: number;
  isTableVisible: boolean;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
  onPrecisionChange: (precision: number) => void;
  onToggleTable: () => void;
  className?: string;
}

export const ControlBar: React.FC<ControlBarProps> = ({
  playState,
  currentStep,
  totalSteps,
  speed,
  precision,
  isTableVisible,
  onPlay,
  onPause,
  onNext,
  onPrev,
  onReset,
  onSpeedChange,
  onPrecisionChange,
  onToggleTable,
  className = ''
}) => {
  const isPlaying = playState === 'playing';
  const isFinished = playState === 'finished';
  const canGoNext = currentStep < totalSteps - 1;
  const canGoPrev = currentStep > 0;
  
  return (
    <div className={`flex flex-col gap-4 p-4 bg-card border border-border rounded-lg ${className}`}>
      {/* Main controls */}
      <div className="flex items-center justify-center gap-2">
        {/* Previous step */}
        <Button
          variant="secondary"
          size="sm"
          onClick={onPrev}
          disabled={!canGoPrev}
          className="btn-control-secondary"
          aria-label="上一步"
        >
          <SkipBack className="h-4 w-4" />
        </Button>
        
        {/* Play/Pause */}
        <Button
          onClick={isPlaying ? onPause : onPlay}
          disabled={isFinished}
          className="btn-control min-w-[60px]"
          aria-label={isPlaying ? "暂停" : "播放"}
        >
          {isPlaying ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
          <span className="ml-2 hidden sm:inline">
            {isPlaying ? '暂停' : isFinished ? '完成' : '播放'}
          </span>
        </Button>
        
        {/* Next step */}
        <Button
          variant="secondary"
          size="sm"
          onClick={onNext}
          disabled={!canGoNext}
          className="btn-control-secondary"
          aria-label="下一步"
        >
          <SkipForward className="h-4 w-4" />
        </Button>
        
        {/* Reset */}
        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
          className="btn-control-secondary"
          aria-label="重置"
        >
          <RotateCcw className="h-4 w-4" />
          <span className="ml-2 hidden sm:inline">重置</span>
        </Button>
      </div>
      
      {/* Progress indicator */}
      <div className="text-center">
        <span className="text-sm text-muted-foreground math-mono">
          步骤 {currentStep + 1} / {totalSteps}
        </span>
        <div className="w-full bg-muted h-2 rounded-full mt-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
          />
        </div>
      </div>
      
      {/* Settings row */}
      <div className="flex flex-col sm:flex-row items-center gap-4 text-sm">
        {/* Speed control */}
        <div className="flex items-center gap-2 min-w-[120px]">
          <label htmlFor="speed-slider" className="text-muted-foreground whitespace-nowrap">
            速度:
          </label>
          <Slider
            id="speed-slider"
            value={[speed]}
            onValueChange={(values) => onSpeedChange(values[0])}
            min={CONFIG.speedRange[0]}
            max={CONFIG.speedRange[1]}
            step={0.25}
            className="flex-1"
            aria-label={`播放速度 ${speed}倍`}
          />
          <span className="math-mono text-xs min-w-[32px] text-center">
            {speed}×
          </span>
        </div>
        
        {/* Precision control */}
        <div className="flex items-center gap-2">
          <label htmlFor="precision-select" className="text-muted-foreground whitespace-nowrap">
            精度:
          </label>
          <Select value={precision.toString()} onValueChange={(value) => onPrecisionChange(parseInt(value))}>
            <SelectTrigger className="w-20" id="precision-select">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: CONFIG.maxPrecision - CONFIG.minPrecision + 1 }, (_, i) => {
                const value = CONFIG.minPrecision + i;
                return (
                  <SelectItem key={value} value={value.toString()}>
                    {value}位
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
        
        {/* Table toggle */}
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleTable}
          className="btn-control-secondary"
          aria-label={isTableVisible ? "隐藏比较表格" : "显示比较表格"}
        >
          <Table className="h-4 w-4" />
          <span className="ml-2 hidden sm:inline">
            {isTableVisible ? '隐藏' : '显示'}表格
          </span>
        </Button>
      </div>
      
      {/* Keyboard shortcuts hint */}
      <div className="text-xs text-muted-foreground text-center border-t pt-2">
        <span className="hidden md:inline">
          快捷键: 空格(播放/暂停) ←→(上下步) [](调速) R(重置)
        </span>
        <span className="md:hidden">
          支持键盘快捷键操作
        </span>
      </div>
    </div>
  );
};