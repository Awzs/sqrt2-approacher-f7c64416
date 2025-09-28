import { generateApproximationBounds, formatExpression } from './arithmetic';

export interface ApproximationStep {
  id: number;
  lower: number;
  upper: number;
  lowerSquare: number;
  upperSquare: number;
  interval: [number, number];
  precision: number;
  description: string;
  lowerExpression: {
    value: string;
    square: string;
    comparison: string;
  };
  upperExpression: {
    value: string;
    square: string;
    comparison: string;
  };
}

/**
 * Generate all approximation steps for a given precision
 */
export function generateSteps(maxPrecision: number): ApproximationStep[] {
  const bounds = generateApproximationBounds(maxPrecision);
  
  return bounds.map((bound, index) => {
    const lowerExpr = formatExpression(bound.lower, index);
    const upperExpr = formatExpression(bound.upper, index);
    
    let description: string;
    if (index === 0) {
      description = `首先确定 √2 在区间 [${lowerExpr.value}, ${upperExpr.value}] 内，因为 1² = 1 < 2 < 4 = 2²`;
    } else {
      description = `比较平方：${lowerExpr.value}² = ${lowerExpr.square} < 2 < ${upperExpr.square} = ${upperExpr.value}²，所以 √2 在 [${lowerExpr.value}, ${upperExpr.value}]`;
    }
    
    return {
      id: index,
      lower: bound.lower,
      upper: bound.upper,
      lowerSquare: bound.lowerSquare,
      upperSquare: bound.upperSquare,
      interval: [bound.lower, bound.upper] as [number, number],
      precision: index,
      description,
      lowerExpression: lowerExpr,
      upperExpression: upperExpr,
    };
  });
}

/**
 * Get the approximate value of √2 at a given step
 */
export function getSqrt2Approximation(step: ApproximationStep): number {
  // Use the lower bound as the approximation
  return step.lower;
}

/**
 * Get the interval width for focusing the number line
 */
export function getIntervalWidth(step: ApproximationStep): number {
  return step.upper - step.lower;
}

/**
 * Get the center of the interval for number line positioning
 */
export function getIntervalCenter(step: ApproximationStep): number {
  return (step.lower + step.upper) / 2;
}

/**
 * Generate comparison table data for all steps up to current
 */
export function generateComparisonTable(steps: ApproximationStep[], currentStep: number) {
  const tableData = [];
  
  for (let i = 0; i <= currentStep && i < steps.length; i++) {
    const step = steps[i];
    
    // Add lower bound
    tableData.push({
      value: step.lowerExpression.value,
      square: step.lowerExpression.square,
      comparison: step.lowerExpression.comparison,
      isHighlight: i === currentStep,
    });
    
    // Add upper bound
    tableData.push({
      value: step.upperExpression.value,
      square: step.upperExpression.square,
      comparison: step.upperExpression.comparison,
      isHighlight: i === currentStep,
    });
  }
  
  return tableData;
}

/**
 * Get the visual bounds for the number line at a given step
 */
export function getVisualBounds(step: ApproximationStep, padding: number = 0.1): [number, number] {
  const width = step.upper - step.lower;
  const center = (step.lower + step.upper) / 2;
  const displayWidth = Math.max(width * 2, 0.1); // Minimum width for visibility
  
  return [
    center - displayWidth / 2 - padding,
    center + displayWidth / 2 + padding
  ];
}