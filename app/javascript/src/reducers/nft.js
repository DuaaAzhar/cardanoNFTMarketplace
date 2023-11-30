import { SET_NFTS } from "../actions/types";

const initialState = {
  nfts: []
}

export const nft = (state = initialState, action) => {
  switch (action.type) {
    case SET_NFTS:
      return {
        ...state,
        nfts: action.payload.data,
      };
    default:
      return state;
  }
};
