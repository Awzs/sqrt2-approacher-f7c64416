import React, { useReducer, useEffect, useCallback, useRef } from 'react';
import { NumberLine } from '../components/NumberLine';
import { IntervalHighlight } from '../components/IntervalHighlight';
import { Markers } from '../components/Markers';
import { ControlBar } from '../components/ControlBar';
import { StepHints } from '../components/StepHints';
import { CompareTable } from '../components/CompareTable';
import { FooterNote } from '../components/FooterNote';
import { generateSteps, getVisualBounds } from '../logic/steps';
import { appReducer, createInitialState } from '../logic/state';
import { CONFIG } from '../config';
import { useToast } from '../hooks/use-toast';

const Index = () => {
  const { toast } = useToast();
  
  // Initialize state
  const initialSteps = generateSteps(CONFIG.defaultPrecision);
  const [state, dispatch] = useReducer(appReducer, createInitialState(initialSteps));
  
  // Animation timer ref
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Auto-play logic
  useEffect(() => {
    if (state.playState === 'playing') {
      const duration = CONFIG.animationDuration.zoom / state.speed;
      
      timerRef.current = setTimeout(() => {
        dispatch({ type: 'NEXT_STEP' });
      }, duration);
    }
    
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [state.playState, state.currentStep, state.speed]);
  
  // Regenerate steps when precision changes
  useEffect(() => {
    const newSteps = generateSteps(state.precision);
    const currentStepIndex = Math.min(state.currentStep, newSteps.length - 1);
    
    // Reset state with new steps
    const newState = createInitialState(newSteps);
    newState.currentStep = currentStepIndex;
    newState.speed = state.speed;
    newState.precision = state.precision;
    newState.isTableVisible = state.isTableVisible;
    
    // This is a workaround since we can't easily update steps in reducer
    window.location.reload();
  }, [state.precision]);
  
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Don't handle if user is typing in an input
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      switch (event.code) {
        case 'Space':
          event.preventDefault();
          if (state.playState === 'playing') {
            dispatch({ type: 'PAUSE' });
          } else {
            dispatch({ type: 'PLAY' });
          }
          break;
        case 'ArrowLeft':
          event.preventDefault();
          dispatch({ type: 'PREV_STEP' });
          break;
        case 'ArrowRight':
          event.preventDefault();
          dispatch({ type: 'NEXT_STEP' });
          break;
        case 'BracketLeft':
          event.preventDefault();
          const newSlowSpeed = Math.max(CONFIG.speedRange[0], state.speed - 0.25);
          dispatch({ type: 'SET_SPEED', speed: newSlowSpeed });
          break;
        case 'BracketRight':
          event.preventDefault();
          const newFastSpeed = Math.min(CONFIG.speedRange[1], state.speed + 0.25);
          dispatch({ type: 'SET_SPEED', speed: newFastSpeed });
          break;
        case 'KeyR':
          event.preventDefault();
          dispatch({ type: 'RESET' });
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [state.playState, state.speed]);
  
  // Clear announcements after a delay
  useEffect(() => {
    if (state.announcements.length > 0) {
      const timer = setTimeout(() => {
        dispatch({ type: 'CLEAR_ANNOUNCEMENTS' });
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [state.announcements]);
  
  // Event handlers
  const handlePlay = useCallback(() => dispatch({ type: 'PLAY' }), []);
  const handlePause = useCallback(() => dispatch({ type: 'PAUSE' }), []);
  const handleNext = useCallback(() => dispatch({ type: 'NEXT_STEP' }), []);
  const handlePrev = useCallback(() => dispatch({ type: 'PREV_STEP' }), []);
  const handleReset = useCallback(() => dispatch({ type: 'RESET' }), []);
  const handleSpeedChange = useCallback((speed: number) => dispatch({ type: 'SET_SPEED', speed }), []);
  const handlePrecisionChange = useCallback((precision: number) => dispatch({ type: 'SET_PRECISION', precision }), []);
  const handleToggleTable = useCallback(() => dispatch({ type: 'TOGGLE_TABLE' }), []);
  
  // Calculate number line bounds
  const currentVisualBounds = state.currentStep < state.steps.length 
    ? getVisualBounds(state.steps[state.currentStep], 0.1)
    : [CONFIG.min, CONFIG.max];
  
  const [lineMin, lineMax] = currentVisualBounds;
  
  return (
    <div className="min-h-screen bg-background">
      {/* Screen reader announcements */}
      <div 
        aria-live="polite" 
        aria-atomic="true" 
        className="sr-only"
      >
        {state.announcements.join('. ')}
      </div>
      
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            逐步逼近：在数轴上找到 √2
          </h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">
            通过比较平方大小，逐步缩小区间，理解无理数 √2 的位置和性质
          </p>
        </header>
        
        {/* Main visualization area */}
        <div className="mb-6">
          <div className="bg-card border border-border rounded-lg p-4 md:p-6">
            <div className="w-full" style={{ height: '120px' }}>
              <svg
                width="100%"
                height="120"
                viewBox={`0 0 800 120`}
                className="w-full h-full"
                style={{ maxWidth: '100%' }}
              >
                {/* Number line */}
                <NumberLine
                  min={lineMin}
                  max={lineMax}
                  width={800}
                  height={120}
                />
                
                {/* Interval highlights */}
                <IntervalHighlight
                  steps={state.steps}
                  currentStep={state.currentStep}
                  min={lineMin}
                  max={lineMax}
                  width={800}
                  height={120}
                />
                
                {/* Markers */}
                <Markers
                  steps={state.steps}
                  currentStep={state.currentStep}
                  min={lineMin}
                  max={lineMax}
                  width={800}
                  height={120}
                />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Control bar */}
        <div className="mb-6">
          <ControlBar
            playState={state.playState}
            currentStep={state.currentStep}
            totalSteps={state.steps.length}
            speed={state.speed}
            precision={state.precision}
            isTableVisible={state.isTableVisible}
            onPlay={handlePlay}
            onPause={handlePause}
            onNext={handleNext}
            onPrev={handlePrev}
            onReset={handleReset}
            onSpeedChange={handleSpeedChange}
            onPrecisionChange={handlePrecisionChange}
            onToggleTable={handleToggleTable}
          />
        </div>
        
        {/* Content area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Step hints */}
          <div>
            <StepHints
              steps={state.steps}
              currentStep={state.currentStep}
            />
          </div>
          
          {/* Comparison table */}
          <div className={state.isTableVisible ? '' : 'lg:flex lg:items-start'}>
            <CompareTable
              steps={state.steps}
              currentStep={state.currentStep}
              isVisible={state.isTableVisible}
              onClose={handleToggleTable}
              className="lg:sticky lg:top-4"
            />
            
            {/* Placeholder when table is hidden */}
            {!state.isTableVisible && (
              <div className="hidden lg:block w-full h-32 bg-muted/20 border-2 border-dashed border-muted rounded-lg flex items-center justify-center text-muted-foreground">
                <p className="text-sm">点击"显示表格"查看数值比较</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Footer */}
        <FooterNote className="mt-12" />
      </div>
    </div>
  );
};

export default Index;
