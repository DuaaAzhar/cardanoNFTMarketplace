import React from "react";
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { walletConstants } from "../../constants/wallet.constants";
import { unlistNFT } from "../../services/auth.service";
import { isUndefined } from "../../util/helpers";
import { SET_METADATA } from "../../actions/types";

export default function BuyButton({ NFT, walletSelected, updateNFT }) {
  const wallet = useSelector(state => state.wallet.wallet)
  const storeMetaData = useSelector((state) => state.wallet.walletMetaData);
  const dispatch = useDispatch();

  const handleBuy = () => {
    if (isUndefined(walletSelected)) {
      toast.error(walletConstants.NOT_CONNECTED)
      return;
    }
    wallet.buildRedeemTokenFromPlutusScript(NFT.asset_name, NFT.policy_id, walletSelected, NFT.transaction.at(-1).txId)
      .then(() => {
        toast.success(walletConstants.SUCCEEDED)
        unlistNFT((NFT.policy_id + NFT.asset_name)).then((response) => {
         updateNFT && updateNFT(response.data.data.attributes)      
         dispatch({
          type: SET_METADATA,
          metaData: [...storeMetaData, ...[response.data.data.attributes]]
        });
        })
      })
      .catch(error => {
        console.error(error)
        toast.error(walletConstants.SOMETHING_WRONG)
      })
  }

  return (
    <button
      className="btn btn-danger px-2"
      onClick={() => handleBuy()}
    >
      Buy NFT
    </button>
  )
}
