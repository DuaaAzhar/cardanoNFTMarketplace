import { combineReducers } from "redux"

import { wallet } from './wallet'
import { collection } from './collection'
import { nft } from './nft'
import { categoryReducer } from "./category"

const rootReducer = combineReducers({
  wallet,
  collection,
  nft,
  categoryReducer
})

export default rootReducer
