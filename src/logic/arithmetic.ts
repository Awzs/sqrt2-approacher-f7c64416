/**
 * Precise arithmetic operations to avoid floating point errors
 * All calculations use integer arithmetic where possible
 */

export interface DecimalNumber {
  integer: number;
  fractional: number;
  precision: number;
}

/**
 * Convert a decimal number to our internal representation
 */
export function toDecimal(value: number, precision: number): DecimalNumber {
  const multiplier = Math.pow(10, precision);
  const scaled = Math.round(value * multiplier);
  
  return {
    integer: Math.floor(scaled / multiplier),
    fractional: scaled % multiplier,
    precision,
  };
}

/**
 * Convert back to regular number
 */
export function fromDecimal(decimal: DecimalNumber): number {
  return decimal.integer + decimal.fractional / Math.pow(10, decimal.precision);
}

/**
 * Square a decimal number using integer arithmetic
 */
export function squareDecimal(decimal: DecimalNumber): number {
  const multiplier = Math.pow(10, decimal.precision);
  const scaled = decimal.integer * multiplier + decimal.fractional;
  const squared = scaled * scaled;
  
  return squared / (multiplier * multiplier);
}

/**
 * Compare a squared decimal with 2
 * Returns: -1 if square < 2, 0 if square = 2, 1 if square > 2
 */
export function compareWithTwo(value: number): -1 | 0 | 1 {
  const precision = 12; // Use high precision for comparison
  const decimal = toDecimal(value, precision);
  const square = squareDecimal(decimal);
  
  const diff = square - 2;
  const epsilon = 1e-10;
  
  if (Math.abs(diff) < epsilon) return 0;
  return diff < 0 ? -1 : 1;
}

/**
 * Generate the next approximation bounds based on precision
 */
export function generateApproximationBounds(precision: number): Array<{
  lower: number;
  upper: number;
  lowerSquare: number;
  upperSquare: number;
}> {
  const bounds = [];
  
  // Start with [1, 2]
  let lower = 1;
  let upper = 2;
  
  bounds.push({
    lower,
    upper,
    lowerSquare: lower * lower,
    upperSquare: upper * upper,
  });
  
  // Generate successive approximations
  for (let step = 1; step <= precision; step++) {
    const stepSize = Math.pow(10, -step);
    
    // Find the digit that makes the square closest to 2
    let bestLower = lower;
    let bestUpper = upper;
    
    for (let digit = 0; digit <= 9; digit++) {
      const candidate = lower + digit * stepSize;
      const candidateSquare = candidate * candidate;
      
      if (candidateSquare < 2) {
        bestLower = candidate;
      } else if (candidateSquare > 2) {
        bestUpper = candidate;
        break;
      } else {
        bestLower = bestUpper = candidate;
        break;
      }
    }
    
    lower = bestLower;
    upper = bestUpper;
    
    bounds.push({
      lower,
      upper,
      lowerSquare: lower * lower,
      upperSquare: upper * upper,
    });
  }
  
  return bounds;
}

/**
 * Format a number for display with proper precision
 */
export function formatNumber(value: number, precision: number): string {
  return value.toFixed(precision);
}

/**
 * Format a mathematical expression for display
 */
export function formatExpression(value: number, precision: number): {
  value: string;
  square: string;
  comparison: string;
} {
  const formattedValue = formatNumber(value, precision);
  const square = value * value;
  const formattedSquare = formatNumber(square, precision + 1);
  
  const comparison = square < 2 ? '< 2' : square > 2 ? '> 2' : '= 2';
  
  return {
    value: formattedValue,
    square: formattedSquare,
    comparison,
  };
}