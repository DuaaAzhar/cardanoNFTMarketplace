import NamiWalletApi from "../util/wallet/nami";
import EternlApi from "../util/wallet/eternl";
import FlintApi from "../util/wallet/flint";

import { blockfrostApiKey, CardanoSerializer } from "../util/wallet/config";
import { SET_WALLET, SET_METADATA, SET_WALLET_LOADING } from "./types";
import { walletConstants } from '../constants/wallet.constants';
import { saveSelectedWallet } from '../services/wallet.service';
import { getUserId, saveUserId } from '../services/user.service';
import { getUser, createUser, updateUser, getAssetsMetadata } from "../services/auth.service";

export const initWallet = (walletObj, selectedWallet, forceEnable) => async dispatch => {
  try {
    dispatch({type: SET_WALLET_LOADING, walletLoading: true})
    dispatch({type: SET_METADATA, metaData: []})

    const serializer = await CardanoSerializer();
    const walletClass = getWalletClass(selectedWallet)

    let wallet = new walletClass(
      serializer,
      walletObj,
      blockfrostApiKey
    );

    if (wallet.isInstalled()){
      let result = await wallet.isEnabled()
      
      if(result || forceEnable){
        result = await wallet.enable()  // Enable wallet
        await wallet.setBalance()
        loadWalletMetadata(wallet, dispatch)
        saveSelectedWallet(selectedWallet)
      }

      if (forceEnable)
        createUserProfile(wallet, selectedWallet)

      dispatch({type: SET_WALLET, wallet, selectedWallet, connected: result});
      dispatch({type: SET_WALLET_LOADING, walletLoading: false})

      // Load Wallet Metadata
      const assetIDs = await getWalletAssetIDs(wallet)
      if (!!assetIDs){
        getAssetsMetadata(assetIDs) // API Call
        .then(response => {
          dispatch({type: SET_METADATA, metaData: response.assets})
        })
        .catch(error => console.log(error))
      } else {
        dispatch({type: SET_METADATA, metaData: null})
      }
    }
  }
  catch(error){
    dispatch({type: SET_WALLET_LOADING, walletLoading: false})
    console.error('Error @wallet.js initWallet', error);
  }
};

//Utility functions
function getWalletClass(walletName = walletConstants.NAMI_WALLET) {
  if(walletName == walletConstants.ETERNL_WALLET)
    return EternlApi
  else if(walletName == walletConstants.FLINT_WALLET)
    return FlintApi
  else if(walletName == walletConstants.NAMI_WALLET)
    return NamiWalletApi
}

async function createUserProfile(wallet, selectedWallet) {
  const id = getUserId()

  if (id){
    let data = { users: { wallet_addresses: ( await getUser() ).wallet_addresses } }
    
    data.users.wallet_addresses[selectedWallet] = await wallet.getAddress()
    // Todo: Add error handling
    updateUser(data, id);
  }
  else {
    let data = { users: { wallet_addresses: {} } }
    data.users.wallet_addresses[selectedWallet] = await wallet.getAddress()

    // Todo: Add error handling
    createUser(data)
    .then(resp => saveUserId(resp.user._id.$oid))
    .catch(err => console.error(err))
    
  }
}

const loadWalletMetadata = async (wallet, dispatch) => {
  const assetIDs = await getWalletAssetIDs(wallet)
  if (!!assetIDs){
    getAssetsMetadata(assetIDs)
    .then(response => dispatch({type: SET_METADATA, metaData: response.assets}) )
    .catch(error => { throw(error) })
  }
  else
    dispatch({type: SET_METADATA, metaData: []})
}

async function getWalletAssetIDs(wallet) {
  const _assetIDs = []
  const _utxos = await wallet.getUtxos()

  _utxos.forEach(utxo => {
    if (!!utxo.assetIDs){
      utxo.assetIDs.forEach(assetID => {
        _assetIDs.push(assetID)
      })
    }
  })

  if (_assetIDs.length !== 0){
    return { asset_ids: _assetIDs }
  } else {
    return null
  }
}
