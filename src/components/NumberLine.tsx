import React, { useMemo } from 'react';
import { CONFIG } from '../config';

interface NumberLineProps {
  min: number;
  max: number;
  width: number;
  height?: number;
  className?: string;
}

export const NumberLine: React.FC<NumberLineProps> = ({ 
  min, 
  max, 
  width, 
  height = CONFIG.numberLine.height,
  className = ''
}) => {
  const { padding, tickHeight, majorTickHeight, labelOffset } = CONFIG.numberLine;
  
  const ticks = useMemo(() => {
    const range = max - min;
    const tickSpacing = calculateTickSpacing(range);
    const startTick = Math.ceil(min / tickSpacing) * tickSpacing;
    const endTick = Math.floor(max / tickSpacing) * tickSpacing;
    
    const tickArray = [];
    for (let value = startTick; value <= endTick; value += tickSpacing) {
      // Avoid floating point precision issues
      const roundedValue = Math.round(value / tickSpacing) * tickSpacing;
      tickArray.push(roundedValue);
    }
    
    return tickArray;
  }, [min, max]);
  
  const scaleX = (value: number) => {
    return ((value - min) / (max - min)) * (width - 2 * padding) + padding;
  };
  
  return (
    <svg 
      width={width} 
      height={height} 
      className={`${className} transition-smooth`}
      role="img"
      aria-label={`数轴，范围从 ${min.toFixed(2)} 到 ${max.toFixed(2)}`}
    >
      {/* Main axis line */}
      <line
        x1={padding}
        y1={height / 2}
        x2={width - padding}
        y2={height / 2}
        stroke="hsl(var(--math-axis))"
        strokeWidth="2"
        markerEnd="url(#arrowhead)"
      />
      
      {/* Arrow marker definition */}
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon
            points="0 0, 10 3.5, 0 7"
            fill="hsl(var(--math-axis))"
          />
        </marker>
      </defs>
      
      {/* Ticks and labels */}
      {ticks.map((value) => {
        const x = scaleX(value);
        const isMajor = Math.abs(value - Math.round(value)) < 0.001;
        const currentTickHeight = isMajor ? majorTickHeight : tickHeight;
        
        return (
          <g key={value}>
            {/* Tick mark */}
            <line
              x1={x}
              y1={height / 2 - currentTickHeight / 2}
              x2={x}
              y2={height / 2 + currentTickHeight / 2}
              stroke="hsl(var(--math-axis))"
              strokeWidth={isMajor ? "2" : "1"}
            />
            
            {/* Label */}
            {isMajor && (
              <text
                x={x}
                y={height / 2 + labelOffset}
                textAnchor="middle"
                className="fill-math-axis text-sm math-mono"
                fontSize="12"
              >
                {formatTickLabel(value)}
              </text>
            )}
          </g>
        );
      })}
      
      {/* Origin marker (if 0 is visible) */}
      {min <= 0 && max >= 0 && (
        <circle
          cx={scaleX(0)}
          cy={height / 2}
          r="3"
          fill="hsl(var(--math-axis))"
        />
      )}
    </svg>
  );
};

function calculateTickSpacing(range: number): number {
  const magnitude = Math.pow(10, Math.floor(Math.log10(range)));
  const normalizedRange = range / magnitude;
  
  if (normalizedRange <= 2) return magnitude * 0.2;
  if (normalizedRange <= 5) return magnitude * 0.5;
  return magnitude;
}

function formatTickLabel(value: number): string {
  // Handle floating point precision
  if (Math.abs(value - Math.round(value)) < 0.001) {
    return Math.round(value).toString();
  }
  
  // Determine appropriate decimal places
  const decimalPlaces = Math.max(0, -Math.floor(Math.log10(Math.abs(value % 1))));
  return value.toFixed(Math.min(decimalPlaces, 3));
}