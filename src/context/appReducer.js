export const initialState = {
  user: null,
  isAuthenticated: false,
  shipments: [],
  // sidebar open state for mobile drawer toggling
  sidebarOpen: false,
};

export const actionTypes = {
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGOUT: 'LOGOUT',
  SET_SHIPMENTS: 'SET_SHIPMENTS',
  ADD_SHIPMENT: 'ADD_SHIPMENT',
  UPDATE_SHIPMENT: 'UPDATE_SHIPMENT',
  DELETE_SHIPMENT: 'DELETE_SHIPMENT',
  OPEN_SIDEBAR: 'OPEN_SIDEBAR',
  CLOSE_SIDEBAR: 'CLOSE_SIDEBAR',
  TOGGLE_SIDEBAR: 'TOGGLE_SIDEBAR',
};

export function appReducer(state, action) {
  switch (action.type) {
    case actionTypes.LOGIN_SUCCESS:
      return { ...state, user: action.payload.user, isAuthenticated: true };
    case actionTypes.LOGOUT:
      return { ...state, user: null, isAuthenticated: false };
    case actionTypes.SET_SHIPMENTS:
      return { ...state, shipments: action.payload.shipments };
    case actionTypes.ADD_SHIPMENT:
      return { ...state, shipments: [action.payload.shipment, ...state.shipments] };
    case actionTypes.UPDATE_SHIPMENT:
      return {
        ...state,
        shipments: state.shipments.map(s => s.id === action.payload.id ? { ...s, ...action.payload.updates } : s),
      };
    case actionTypes.DELETE_SHIPMENT:
      return { ...state, shipments: state.shipments.filter(s => s.id !== action.payload.id) };
    case actionTypes.OPEN_SIDEBAR:
      return { ...state, sidebarOpen: true };
    case actionTypes.CLOSE_SIDEBAR:
      return { ...state, sidebarOpen: false };
    case actionTypes.TOGGLE_SIDEBAR:
      return { ...state, sidebarOpen: !state.sidebarOpen };
    default:
      return state;
  }
}
