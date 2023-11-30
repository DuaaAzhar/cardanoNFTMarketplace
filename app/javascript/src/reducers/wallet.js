import {
  SET_WALLET,
  DISCONNECT_WALLET,
  CONNECT_WALLET,
  SET_METADATA,
  SET_WALLET_LOADING
} from "../actions/types";

const initialState = {
  wallet: {},
  connected: false,
  walletSelected: undefined,
  walletMetaData: [],
  walletLoading: false
}

export const wallet = (state = initialState, action) => {
  switch (action.type) {
    case SET_WALLET:
      return {
        ...state,
        wallet: action.wallet,
        connected: action.connected,
        walletSelected: action.selectedWallet
      };
    case CONNECT_WALLET:
      return {
        ...state,
        connected: action.connected
      }
    case DISCONNECT_WALLET:
      return initialState;
    case SET_METADATA:
      return {
        ...state,
        walletMetaData: action.metaData
      }
    case SET_WALLET_LOADING:
      return {
        ...state,
        walletLoading: action.walletLoading
      }
    default:
      return state;
  }
};
