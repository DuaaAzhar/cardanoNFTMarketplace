import { SET_COLLECTIONS } from "../actions/types";

const initialState = {
  collections: []
}

export const collection = (state = initialState, action) => {
  switch (action.type) {
    case SET_COLLECTIONS:
      return {
        ...state,
        collections: action.payload.data,
      };
    default:
      return state;
  }
};
