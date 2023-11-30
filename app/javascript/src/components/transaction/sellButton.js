import React, { Fragment, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";

import { listNFT } from "../../services/auth.service";
import { SET_METADATA } from "../../actions/types";
import { walletConstants } from "../../constants/wallet.constants";

export default function SellButton({ assetName, assetPolicyId, walletAddress, updateNFT, customStyle = "" }) {
  const storeWallet = useSelector((state) => state.wallet.wallet);
  const storeMetaData = useSelector((state) => state.wallet.walletMetaData);
  const [price, setPrice] = useState(2);
  const dispatch = useDispatch();

  const buildNFT = async () => {
    if (walletAddress === "") {
      toast.error(walletConstants.NOT_CONNECTED);
      return;
    }

    const txIterations = 10
    for (let i = 1; i <= txIterations; i ++){
      try {
        const txId = await storeWallet.buildSendTokenToPlutusScript(
          assetName,
          assetPolicyId,
          walletAddress
        )
        const body = {
          transaction: {
            txId,
            price,
            wallet_address: walletAddress,
          },
        };
        let response = await listNFT(assetPolicyId + assetName, body)
        if (response.status === walletConstants.SUCCESS_CODE) {
          response = response.data.data.attributes
          updateNFT && updateNFT(response);
          toast.success(walletConstants.SUCCEEDED);

          dispatch({
            type: SET_METADATA,
            metaData: storeMetaData.filter(
              (item) => item.asset !== assetPolicyId + assetName
            ),
          });
        } else {
          toast.warn("NFT sold but DB not updated")
        }
        break
      } catch (error) {
        if (i === txIterations || error.code) {
          toast.error(walletConstants.SOMETHING_WRONG);
          console.error(error)
          break
        }
      }
    }
  };

  return (
    <Fragment>
      <button
        type="button"
        className={`btn btn-danger ${customStyle}`}
        data-bs-toggle="modal"
        data-bs-target={`#priceModal-${assetName}`}
      >
        Sell
      </button>
      <div
        className="modal fade"
        id={`priceModal-${assetName}`}
        tabIndex="-1"
        aria-labelledby={`priceModal-${assetName}`}
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id={`priceModal-${assetName}`}>
                List NFT
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <label htmlFor="priceInput" className="my-2 fw-bold">Enter the listing price</label>
              <div id="priceInput" className="input-group">
                {/* TODO: Handle use case if user enters invalid value or below 2 ADA */}
                <input
                  type="number"
                  defaultValue={price}
                  min='2'
                  className="form-control"
                  aria-label="Price"
                  aria-describedby="price"
                  onChange={e => setPrice(e.target.value)}
                />
                <div className="input-group-append">
                  <span className="input-group-text">₳</span>
                </div>
              </div>
              <h4 className="my-3"><strong>Listing Details:</strong></h4>
              <div className="d-flex mb-2">
                <h6 style={{ flex: '2 1 0%' }}>Service fee: 0.00% (minimum 1 ₳)</h6>
                <h6>1 ₳</h6>
              </div>
              <div className="d-flex pt-2 border-top">
                <h6 style={{ flex: '2 1 0%' }}>You will recieve: </h6>
                <h6>{parseInt(price) - 1} ₳</h6>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                data-bs-dismiss="modal"
                aria-label="Close"
                className="btn btn-danger w-100"
                onClick={() => buildNFT()}>
                List this item
              </button>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
