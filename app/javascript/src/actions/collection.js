import { getCollections } from "../services/auth.service";
import { SET_COLLECTIONS } from "./types";

export const setCollection = () => async dispatch => {
  try {
    const res = await getCollections();
    dispatch({ type: SET_COLLECTIONS, payload: res });
  }
  catch(error){
    console.error('Error @collection.js setCollection', error);
  }
};
