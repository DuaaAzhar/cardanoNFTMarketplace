import React, { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import hex2ascii from 'hex2ascii';

import { getNftsForSale } from '../../../services/auth.service';
import { isEmptyObj } from '../../../util/helpers';
import connectWallet from '../../../assets/connectWallet.png'
import NftCards from "../../nftcards/nftCards"
import './onSale.scss';

export default function Onsale(){
  const [nftsforsale, setnftsforsale] = useState([]);
  const [triggerRender, setTriggerRender] = useState(false);
  const storeWallet = useSelector(state => state.wallet.wallet)

  useEffect(() => {
    if (isEmptyObj(storeWallet)){
      return
    }
    (async () => {
      const walletAddress = await storeWallet.getAddress()
      try {
        setnftsforsale (await getNftsForSale(walletAddress))
      } catch (error) {
        console.error(error)
      }
    })()
  }, [storeWallet, triggerRender])

  let RemoveNFT = (id) => {
    setnftsforsale(olditems => olditems.filter((nfts, index) => index !== id))
    setTriggerRender(!triggerRender);
  }

  return (
    <Fragment>
      <div id="main-wrapper" className="admin">
        <div className="content-body" >
          <div className="container">
            <div className="col-12 ">
              <div className="filter-tab">
                <div className="row onsale">
                  {nftsforsale.length > 0 ?
                    <Fragment>
                      {nftsforsale && nftsforsale.map((nft, i) => {
                        nft = nft.attributes
                        const asset_name = hex2ascii(nft.asset_name);
                        const price = nft.transaction.at(-1)?.price

                        return (
                          <NftCards
                            key={i}
                            metadata={nft}
                            columnStyle="col-xxl-4 col-xl-4 col-lg-4 col-6 mt-4"
                            cardType="ONSALE"
                            imageUrl={nft.onchain_metadata.image}
                            itemName={asset_name}
                            price={price}
                            RemoveNFT={RemoveNFT}
                            id={i}
                          />
                        )
                      })}
                    </Fragment> :
                    <section id="section1 ">
                      <div className="hero_guest">
                        <div className="container mt-5">
                          <div className="row ">
                            <div className="headline col-sm-12 text-center">
                              <h1 className="mb-3">
                                Nothing to show
                              </h1>
                              <img src={connectWallet} alt="Please Connect Your Wallet" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
