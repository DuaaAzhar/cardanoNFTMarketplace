import React, { Fragment, useState, useEffect } from "react";
import { useHistory, useParams } from 'react-router-dom';
import { useSelector } from "react-redux";
import './nftCards.scss'
import placeholder from "../../assets/branding/angryKongsLogoRed";
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import NftImage from "../nftimage/nftImage";
import SellButton from "../transaction/sellButton";
import BuyButton from "../transaction/buyButton"
import { collectionConstants } from "../../constants/collection.constants";

export default function NftCards({ columnStyle, metadata, item, id, imageUrl, itemName, itemNameInHex, buttonfunction,
  btnTitle, cardType, policyId, price, walletAddress, RemoveNFT }) {
  const history = useHistory();
  const walletSelected = useSelector(state => state.wallet.walletSelected)
  const [loading, setLoading] = useState(false);
  const [image , setimage] = useState(false);

  useEffect(() => {
    checkNFT();
  }, []);

  const btnfunction = () => {
    history.push(buttonfunction)
  }
  const checkNFT = () => {
    if (imageUrl && metadata) {
      setLoading(true);
    }
    else if(!imageUrl){
      setimage(true)
      setLoading(true);
    }
  }

  return (
    <Fragment>
      <SkeletonTheme baseColor="#dcdcdc" highlightColor="#e6e6fa">
        <div className={`${columnStyle}`}>
          <div className="Ccard d-flex flex-column me-2">
            <div className="images">
              <div className="Cimg d-flex flex-column align-items-center h-100">
                {loading ?
                  (image ? <NftImage imageUrl={placeholder} style={`img-fluid mh-100 rounded card-img-top`} /> :
                   <NftImage imageUrl={imageUrl} style={`img-fluid mh-100 rounded card-img-top`} /> ) :
                   <div className="fit-skeleton w-100 h-100"><Skeleton height={`100%`} width={`100%`} /></div>
                }
              </div>
            </div>
            <div className="Cbody d-flex flex-column m-0">
              <div className="card-title">
                <h5 className="Cname mb-0">
                  {loading ? itemName : <Skeleton height={22}/>}
                </h5>
                {cardType === collectionConstants.BUY ?
                  <div className="text-start">
                    {loading ? <h5 className="text-muted">{price}ADA</h5> :
                      <Skeleton width={`25%`} height={22}/>
                    }
                  </div>
                  : (cardType === "RelatedItems" ?
                    <div className="d-flex justify-content-between mt-2 ">
                      <div className="text-start">
                        <h5 className="text-muted">Price</h5>
                      </div>
                      <div className="text-end">
                        <h5 className="mb-2">
                          {loading ?
                            <strong className="text-primary">{price}ADA</strong> :
                            <Skeleton width={`25%`}/>
                          }
                        </h5>
                      </div>
                    </div> : null
                  )
                }
              </div>
              {cardType === collectionConstants.SELL ?
                <div className="d-flex justify-content-between dashboard-nft align-items-center mt-2 ">
                  <button
                    onClick={btnfunction}
                    className="btn btn-success me-1 w-50 font-size text-center"
                  >
                    {btnTitle}
                  </button>
                  <SellButton
                    assetName={itemNameInHex}
                    assetPolicyId={policyId}
                    walletAddress={walletAddress}
                    customStyle={"w-50 font-size text-center"}
                  />
                </div> :
                (cardType === "ONSALE" ?
                  <div className="d-flex flex-column mt-2 justify-content-center "  >
                    <BuyButton NFT={metadata} walletSelected={walletSelected} updateNFT={RemoveNFT}></BuyButton>
                  </div> :
                  < button className="btn btn-danger w-100" onClick={btnfunction}>{btnTitle}</button>
                )
              }
            </div>
          </div>
        </div>
      </SkeletonTheme>
    </Fragment>
  );
}
