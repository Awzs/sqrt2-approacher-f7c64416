import { ApproximationStep } from './steps';

export type PlayState = 'idle' | 'playing' | 'paused' | 'finished';

export interface AppState {
  // Play control
  playState: PlayState;
  currentStep: number;
  speed: number;
  precision: number;
  
  // Data
  steps: ApproximationStep[];
  
  // UI state
  isTableVisible: boolean;
  isAnimating: boolean;
  
  // Accessibility
  announcements: string[];
}

export type AppAction =
  | { type: 'PLAY' }
  | { type: 'PAUSE' }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'GO_TO_STEP'; step: number }
  | { type: 'SET_SPEED'; speed: number }
  | { type: 'SET_PRECISION'; precision: number }
  | { type: 'RESET' }
  | { type: 'TOGGLE_TABLE' }
  | { type: 'SET_ANIMATING'; isAnimating: boolean }
  | { type: 'ADD_ANNOUNCEMENT'; message: string }
  | { type: 'CLEAR_ANNOUNCEMENTS' };

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'PLAY':
      if (state.currentStep >= state.steps.length - 1) {
        return { 
          ...state, 
          playState: 'finished',
        };
      }
      return { 
        ...state, 
        playState: 'playing',
        announcements: [...state.announcements, '开始播放逼近过程']
      };

    case 'PAUSE':
      return { 
        ...state, 
        playState: 'paused',
        announcements: [...state.announcements, '暂停播放']
      };

    case 'NEXT_STEP':
      if (state.currentStep >= state.steps.length - 1) {
        return { 
          ...state, 
          playState: 'finished',
          announcements: [...state.announcements, '已到达最终步骤']
        };
      }
      
      const nextStep = state.currentStep + 1;
      const nextStepData = state.steps[nextStep];
      const announcement = `步骤 ${nextStep + 1}: ${nextStepData.description}`;
      
      return {
        ...state,
        currentStep: nextStep,
        playState: nextStep >= state.steps.length - 1 ? 'finished' : state.playState,
        announcements: [...state.announcements, announcement]
      };

    case 'PREV_STEP':
      if (state.currentStep <= 0) {
        return state;
      }
      
      const prevStep = state.currentStep - 1;
      const prevStepData = state.steps[prevStep];
      const prevAnnouncement = `返回步骤 ${prevStep + 1}: ${prevStepData.description}`;
      
      return {
        ...state,
        currentStep: prevStep,
        playState: 'paused',
        announcements: [...state.announcements, prevAnnouncement]
      };

    case 'GO_TO_STEP':
      const targetStep = Math.max(0, Math.min(action.step, state.steps.length - 1));
      const targetStepData = state.steps[targetStep];
      const targetAnnouncement = `跳转到步骤 ${targetStep + 1}: ${targetStepData.description}`;
      
      return {
        ...state,
        currentStep: targetStep,
        playState: targetStep >= state.steps.length - 1 ? 'finished' : 'paused',
        announcements: [...state.announcements, targetAnnouncement]
      };

    case 'SET_SPEED':
      return {
        ...state,
        speed: action.speed,
        announcements: [...state.announcements, `播放速度调整为 ${action.speed}×`]
      };

    case 'SET_PRECISION':
      // When precision changes, we need to regenerate steps
      // This will be handled in the component
      return {
        ...state,
        precision: action.precision,
        announcements: [...state.announcements, `精度调整为 ${action.precision} 位小数`]
      };

    case 'RESET':
      return {
        ...state,
        playState: 'idle',
        currentStep: 0,
        announcements: [...state.announcements, '重置到初始状态']
      };

    case 'TOGGLE_TABLE':
      return {
        ...state,
        isTableVisible: !state.isTableVisible,
        announcements: [...state.announcements, state.isTableVisible ? '隐藏比较表格' : '显示比较表格']
      };

    case 'SET_ANIMATING':
      return {
        ...state,
        isAnimating: action.isAnimating
      };

    case 'ADD_ANNOUNCEMENT':
      return {
        ...state,
        announcements: [...state.announcements, action.message]
      };

    case 'CLEAR_ANNOUNCEMENTS':
      return {
        ...state,
        announcements: []
      };

    default:
      return state;
  }
}

export function createInitialState(steps: ApproximationStep[]): AppState {
  return {
    playState: 'idle',
    currentStep: 0,
    speed: 1,
    precision: 3,
    steps,
    isTableVisible: false,
    isAnimating: false,
    announcements: [],
  };
}