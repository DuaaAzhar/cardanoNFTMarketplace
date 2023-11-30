import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from 'react-redux';
import hex2ascii from "hex2ascii";

import NftImage from "../nftimage/nftImage";
import cardano_logo from '../../assets/cardano_logo.svg'
import './topCollection.scss'

export default function TopCollection() {
  const nfts = useSelector(state => state.nft.nfts)

  return (
    <div className="top-collection section-padding">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-8">
            <div className="section-title text-center mb-4 pt-4">
              <h2>Top collections over last 7 days</h2>
            </div>
          </div>
        </div>
        <div className="row align-items-center">
          {nfts && nfts.map((nft, index) => {
            const item = nft.attributes
            const asset_name = hex2ascii(item.asset_name)

            return (
              <div key={index} className="col-xl-4 col-lg-6 col-md-6">
                <Link to={`/asset/${item.policy_id}/${item.asset_name}`} className="top-collection-content d-block">
                  <div className="d-flex align-items-center">
                    <span className="serial">{index + 1}. </span>
                    <div className="flex-shrink-0">
                      <span className="top-img">
                        <NftImage imageUrl={item.onchain_metadata?.image} style="img-fluid card-img-top " />
                      </span>
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <h5>{asset_name}</h5>
                      <p className="text-muted">
                        <img src={cardano_logo} width={20} />
                        {item.transaction.at(-1)?.price} ADA
                      </p>
                    </div>
                    <h5 className={"text-success"}>
                      {(index + 1 * (2.25 * (index + 1))).toFixed(2)}
                    </h5>
                  </div>
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
}
