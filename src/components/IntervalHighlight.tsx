import React from 'react';
import { ApproximationStep } from '../logic/steps';
import { CONFIG } from '../config';

interface IntervalHighlightProps {
  steps: ApproximationStep[];
  currentStep: number;
  min: number;
  max: number;
  width: number;
  height: number;
  className?: string;
}

export const IntervalHighlight: React.FC<IntervalHighlightProps> = ({
  steps,
  currentStep,
  min,
  max,
  width,
  height,
  className = ''
}) => {
  const { padding } = CONFIG.numberLine;
  const contentWidth = width - 2 * padding;
  
  const scaleX = (value: number) => {
    return ((value - min) / (max - min)) * contentWidth + padding;
  };
  
  const getIntervalColor = (stepIndex: number, isActive: boolean) => {
    const hue = CONFIG.hueBase + stepIndex * CONFIG.hueStep;
    const alpha = isActive 
      ? CONFIG.alphaBase + stepIndex * CONFIG.alphaStep + 0.1
      : (CONFIG.alphaBase + stepIndex * CONFIG.alphaStep) * 0.5;
    
    return `hsla(${hue}, 70%, 60%, ${alpha})`;
  };
  
  const getStrokeColor = (stepIndex: number, isActive: boolean) => {
    const hue = CONFIG.hueBase + stepIndex * CONFIG.hueStep;
    const alpha = isActive ? 0.8 : 0.4;
    
    return `hsla(${hue}, 70%, 50%, ${alpha})`;
  };
  
  return (
    <g className={className}>
      {/* Render historical intervals first (bottom layer) */}
      {steps.slice(0, currentStep).map((step, index) => {
        const leftX = scaleX(step.lower);
        const rightX = scaleX(step.upper);
        const intervalWidth = rightX - leftX;
        
        if (intervalWidth < 1) return null; // Skip if too narrow to see
        
        return (
          <rect
            key={`historical-${index}`}
            x={leftX}
            y={height * 0.2}
            width={intervalWidth}
            height={height * 0.6}
            fill={getIntervalColor(index, false)}
            stroke={getStrokeColor(index, false)}
            strokeWidth="1"
            className="transition-smooth"
            opacity={0.6}
          />
        );
      })}
      
      {/* Current interval (top layer) */}
      {currentStep < steps.length && (
        <>
          {(() => {
            const step = steps[currentStep];
            const leftX = scaleX(step.lower);
            const rightX = scaleX(step.upper);
            const intervalWidth = rightX - leftX;
            
            return (
              <g>
                {/* Interval rectangle */}
                <rect
                  x={leftX}
                  y={height * 0.15}
                  width={intervalWidth}
                  height={height * 0.7}
                  fill={getIntervalColor(currentStep, true)}
                  stroke={getStrokeColor(currentStep, true)}
                  strokeWidth="2"
                  className="transition-smooth animate-flash"
                  rx="2"
                />
                
                {/* Lower bound marker */}
                <g className="animate-breath">
                  <circle
                    cx={leftX}
                    cy={height / 2}
                    r="4"
                    fill={getStrokeColor(currentStep, true)}
                    stroke="white"
                    strokeWidth="2"
                  />
                  <text
                    x={leftX}
                    y={height * 0.1}
                    textAnchor="middle"
                    className="fill-foreground text-xs math-mono font-semibold"
                    fontSize="11"
                  >
                    {step.lowerExpression.value}
                  </text>
                </g>
                
                {/* Upper bound marker */}
                <g className="animate-breath">
                  <circle
                    cx={rightX}
                    cy={height / 2}
                    r="4"
                    fill={getStrokeColor(currentStep, true)}
                    stroke="white"
                    strokeWidth="2"
                  />
                  <text
                    x={rightX}
                    y={height * 0.1}
                    textAnchor="middle"
                    className="fill-foreground text-xs math-mono font-semibold"
                    fontSize="11"
                  >
                    {step.upperExpression.value}
                  </text>
                </g>
                
                {/* Interval label */}
                <text
                  x={(leftX + rightX) / 2}
                  y={height * 0.9}
                  textAnchor="middle"
                  className="fill-primary text-sm font-medium"
                  fontSize="12"
                >
                  区间 [{step.lowerExpression.value}, {step.upperExpression.value}]
                </text>
              </g>
            );
          })()}
        </>
      )}
    </g>
  );
};