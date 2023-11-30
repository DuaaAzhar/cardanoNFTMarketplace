import React, { Fragment, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import './walletDashboard.scss'

export default function WalletDashboard() {
  const storeWallet = useSelector(state => state.wallet.wallet)
  const [walletAddress, setWalletAddress] = useState();
  const [assetIDs, setAssetIds] = useState([]);

  useEffect(() => {
    console.log('DOM Update');

    /**
     * Async arrow function gets the wallet address and store it
     * in local state via useState Hook
     */
    const getWalletAddress = async () => {
      const _walletAddress = await storeWallet.getAddress()
      setWalletAddress(_walletAddress)
    }

    // Call get wallet address function
    getWalletAddress()
      .catch(error => console.log(error))

    /**
     * Async arrow function gets the wallet controlled asset fringerprints
     */
    const getWalletAssetIDs = async () => {
      let _assetIDs = []
      const _utxos = await storeWallet.getUtxos()
      _utxos.forEach(utxo => {
        if (utxo.assetIDs.length != 0) {
          _assetIDs.push(utxo.assetIDs)
        }
      });
      setAssetIds(_assetIDs)
    }

    // Call get wallet asset IDs function
    getWalletAssetIDs()
      .catch(error => console.log(error))

  }, [storeWallet])

  return (
    <Fragment>
      <div className="item-single section-padding">
        <div className="container">
          <div className="row">
            <div className="col-xxl-12">
              <div className="top-bid">
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6">
                    </div>
                    <div className="col-md-6">
                      <h3 className="mb-3">Wallet Dashboard</h3>
                      <div className="d-flex align-items-center mb-3">
                        <div className="flex-grow-1">
                          <h5 className="mb-1">
                            Address:
                            {walletAddress ? walletAddress.slice(0, 5) + "..." + walletAddress.slice(-5) : "Loading"}
                          </h5>
                          <h5 className="mb-1">
                            Asset ID:
                            {assetIDs ? assetIDs.map(element => <li key={element}>{element}</li>) : "Loading"}
                          </h5>
                        </div>
                      </div>
                      <div className="d-flex justify-content-between mt-4 mb-4">
                        <div className="text-start" />
                        <div className="text-end">
                          <div className="text-end">
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
