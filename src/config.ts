export const CONFIG = {
  // Number line display range
  min: 0,
  max: 3,
  
  // Precision settings
  defaultPrecision: 3,
  minPrecision: 2,
  maxPrecision: 6,
  
  // Animation and speed
  speedRange: [0.25, 2] as const,
  defaultSpeed: 1,
  
  // Visual settings
  hueBase: 210,
  hueStep: 12,
  alphaBase: 0.15,
  alphaStep: 0.03,
  
  // Animation durations (in ms, will be scaled by speed)
  animationDuration: {
    zoom: 800,
    highlight: 400,
    breath: 600,
    flash: 800,
  },
  
  // Number line settings
  numberLine: {
    height: 80,
    padding: 40,
    tickHeight: 8,
    majorTickHeight: 12,
    labelOffset: 20,
  },
  
  // Touch targets for mobile
  minTouchTarget: 44,
} as const;

// Pre-calculated values for accuracy
export const SQRT2_APPROXIMATIONS = {
  1: { value: 1.0, square: 1.0 },
  2: { value: 2.0, square: 4.0 },
  1.4: { value: 1.4, square: 1.96 },
  1.5: { value: 1.5, square: 2.25 },
  1.41: { value: 1.41, square: 1.9881 },
  1.42: { value: 1.42, square: 2.0164 },
  1.414: { value: 1.414, square: 1.999396 },
  1.415: { value: 1.415, square: 2.002225 },
  1.4142: { value: 1.4142, square: 1.99996164 },
  1.4143: { value: 1.4143, square: 2.00024449 },
  1.41421: { value: 1.41421, square: 1.9999899241 },
  1.41422: { value: 1.41422, square: 2.0000182084 },
} as const;

export const SQRT2_EXACT = 1.4142135623730950488;