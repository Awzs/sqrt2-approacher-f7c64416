import React from 'react';
import { ApproximationStep } from '../logic/steps';
import { SQRT2_EXACT } from '../config';

interface MarkersProps {
  steps: ApproximationStep[];
  currentStep: number;
  min: number;
  max: number;
  width: number;
  height: number;
  className?: string;
}

export const Markers: React.FC<MarkersProps> = ({
  steps,
  currentStep,
  min,
  max,
  width,
  height,
  className = ''
}) => {
  const padding = 40;
  const contentWidth = width - 2 * padding;
  
  const scaleX = (value: number) => {
    return ((value - min) / (max - min)) * contentWidth + padding;
  };
  
  const isValueVisible = (value: number) => {
    return value >= min && value <= max;
  };
  
  // Key reference points
  const keyPoints = [
    { value: 1, label: '1', color: 'hsl(var(--muted-foreground))', isFixed: true },
    { value: 2, label: '2', color: 'hsl(var(--muted-foreground))', isFixed: true },
  ];
  
  // Add √2 approximation if we're at the final step
  const isFinished = currentStep >= steps.length - 1;
  if (isFinished && isValueVisible(SQRT2_EXACT)) {
    keyPoints.push({
      value: SQRT2_EXACT,
      label: '√2',
      color: 'hsl(var(--math-success))',
      isFixed: false
    });
  }
  
  return (
    <g className={className}>
      {keyPoints.map((point, index) => {
        if (!isValueVisible(point.value)) return null;
        
        const x = scaleX(point.value);
        const isHighlight = !point.isFixed && isFinished;
        
        return (
          <g key={index}>
            {/* Marker line */}
            <line
              x1={x}
              y1={height * 0.1}
              x2={x}
              y2={height * 0.9}
              stroke={point.color}
              strokeWidth={isHighlight ? "3" : "2"}
              strokeDasharray={point.isFixed ? "none" : "4,2"}
              className={isHighlight ? "animate-flash" : ""}
              opacity={point.isFixed ? 0.6 : 1}
            />
            
            {/* Marker point */}
            <circle
              cx={x}
              cy={height / 2}
              r={isHighlight ? "6" : "4"}
              fill={point.color}
              stroke="white"
              strokeWidth="2"
              className={isHighlight ? "animate-flash" : ""}
            />
            
            {/* Label */}
            <text
              x={x}
              y={height * 0.05}
              textAnchor="middle"
              className="font-semibold text-sm"
              fill={point.color}
              fontSize={isHighlight ? "14" : "12"}
            >
              {point.label}
            </text>
            
            {/* Value for √2 */}
            {!point.isFixed && (
              <text
                x={x}
                y={height * 0.95}
                textAnchor="middle"
                className="math-mono text-xs"
                fill={point.color}
                fontSize="10"
              >
                ≈ {point.value.toFixed(6)}
              </text>
            )}
          </g>
        );
      })}
      
      {/* Current approximation indicator */}
      {currentStep < steps.length && (
        (() => {
          const step = steps[currentStep];
          const approxValue = step.lower; // Use lower bound as approximation
          
          if (!isValueVisible(approxValue)) return null;
          
          const x = scaleX(approxValue);
          
          return (
            <g>
              {/* Approximation marker */}
              <line
                x1={x}
                y1={height * 0.2}
                x2={x}
                y2={height * 0.8}
                stroke="hsl(var(--math-highlight))"
                strokeWidth="2"
                strokeDasharray="6,3"
                className="animate-breath"
              />
              
              <circle
                cx={x}
                cy={height / 2}
                r="3"
                fill="hsl(var(--math-highlight))"
                stroke="white"
                strokeWidth="1"
                className="animate-breath"
              />
              
              <text
                x={x + 8}
                y={height / 2 - 8}
                className="text-xs font-medium math-mono"
                fill="hsl(var(--math-highlight))"
                fontSize="10"
              >
                ~{step.lowerExpression.value}
              </text>
            </g>
          );
        })()
      )}
    </g>
  );
};