import { getNfts } from "../services/auth.service";
import { SET_NFTS } from "./types";

export const setNfts= () => async dispatch => {
  try {
    const res = await getNfts();
    dispatch({ type: SET_NFTS, payload: res.data });
  }
  catch(error){
    console.error('Error @nft.js setNfts', error);
  }
};
