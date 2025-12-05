import React, { createContext, useReducer, useMemo, useCallback, useContext } from 'react';
import { appReducer, initialState, actionTypes } from './appReducer';
import * as storage from '../utils/storage';

// Split into two contexts to avoid re-renders for consumers that only need actions
export const AppStateContext = createContext(null);
export const AppActionsContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, {
    ...initialState,
    user: storage.getCurrentUser(),
    isAuthenticated: storage.isAuthenticated(),
    shipments: storage.getShipments(),
  });

  const login = useCallback((email, password) => {
    const res = storage.loginUser(email, password);
    if (res.success) {
      dispatch({ type: actionTypes.LOGIN_SUCCESS, payload: { user: res.user } });
    }
    return res;
  }, []);

  const logout = useCallback(() => {
    storage.logoutUser();
    dispatch({ type: actionTypes.LOGOUT });
  }, []);

  const loadShipments = useCallback(() => {
    const shipments = storage.getShipments();
    dispatch({ type: actionTypes.SET_SHIPMENTS, payload: { shipments } });
    return shipments;
  }, []);

  const addShipment = useCallback((data) => {
    const res = storage.addShipment(data);
    if (res.success) {
      dispatch({ type: actionTypes.ADD_SHIPMENT, payload: { shipment: res.shipment } });
    }
    return res;
  }, []);

  const updateShipment = useCallback((id, updates) => {
    const res = storage.updateShipment(id, updates);
    if (res.success) {
      dispatch({ type: actionTypes.UPDATE_SHIPMENT, payload: { id, updates } });
    }
    return res;
  }, []);

  const deleteShipment = useCallback((id) => {
    const res = storage.deleteShipment(id);
    if (res.success) {
      dispatch({ type: actionTypes.DELETE_SHIPMENT, payload: { id } });
    }
    return res;
  }, []);

  const openSidebar = useCallback(() => dispatch({ type: actionTypes.OPEN_SIDEBAR }), []);
  const closeSidebar = useCallback(() => dispatch({ type: actionTypes.CLOSE_SIDEBAR }), []);
  const toggleSidebar = useCallback(() => dispatch({ type: actionTypes.TOGGLE_SIDEBAR }), []);

  const actions = useMemo(() => ({ login, logout, loadShipments, addShipment, updateShipment, deleteShipment, openSidebar, closeSidebar, toggleSidebar }), [login, logout, loadShipments, addShipment, updateShipment, deleteShipment, openSidebar, closeSidebar, toggleSidebar]);

  return (
    <AppStateContext.Provider value={state}>
      <AppActionsContext.Provider value={actions}>{children}</AppActionsContext.Provider>
    </AppStateContext.Provider>
  );
};

export const useAppState = () => useContext(AppStateContext);
export const useAppActions = () => useContext(AppActionsContext);

export default AppProvider;
