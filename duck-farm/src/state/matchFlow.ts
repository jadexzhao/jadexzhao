export type MatchFlowPhase = 'idle' | 'confirming' | 'celebrating'

export type MatchIntent = 'match' | 'unmatch'

export interface MatchFlowState {
  phase: MatchFlowPhase
  profileId: string | null
  intent: MatchIntent | null
}

export type MatchFlowAction =
  | { type: 'REQUEST_MATCH'; profileId: string }
  | { type: 'REQUEST_UNMATCH'; profileId: string }
  | { type: 'CONFIRM' }
  | { type: 'CELEBRATE_DONE' }
  | { type: 'DISMISS' }

export const initialMatchFlowState: MatchFlowState = {
  phase: 'idle',
  profileId: null,
  intent: null,
}

export function matchFlowReducer(state: MatchFlowState, action: MatchFlowAction): MatchFlowState {
  switch (action.type) {
    case 'REQUEST_MATCH':
      return { phase: 'confirming', profileId: action.profileId, intent: 'match' }
    case 'REQUEST_UNMATCH':
      return { phase: 'confirming', profileId: action.profileId, intent: 'unmatch' }
    case 'CONFIRM':
      if (state.phase !== 'confirming' || !state.profileId) return state
      return { ...state, phase: 'celebrating' }
    case 'CELEBRATE_DONE':
      return initialMatchFlowState
    case 'DISMISS':
      return initialMatchFlowState
    default: {
      const _exhaustive: never = action
      return _exhaustive
    }
  }
}

export function isMatchModalOpen(state: MatchFlowState): boolean {
  return state.phase === 'confirming' || state.phase === 'celebrating'
}
