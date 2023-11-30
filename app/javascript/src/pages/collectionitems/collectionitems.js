import React, { Fragment, useEffect, useState, useLocation, useLayoutEffect } from "react";
import { useRouteMatch } from "react-router";

import Footer from "../../components/footer/footer";
import { collectionConstants } from "../../constants/collection.constants";
import { getNftsByCollection } from "../../services/auth.service";
import NftCards from "../../components/nftcards/nftCards"
import { hex2ascii } from "hex2ascii";

import "./collectionitems.scss";
import { useSelector } from "react-redux";

function Collectionitems() {
  const selectedCategory = useSelector((state) => state.categoryReducer.selectedCategory);
  const [nfts, setNfts] = useState();
  const match = useRouteMatch();

  useLayoutEffect(() => {
    getNftsByCollection(match.params.id)
      .then((nfts) => setNfts(nfts))
      .catch((err) => console.error(err));
  }, [location.explore]);

  return (
    <Fragment>
      <div id="main-wrapper" className="front">
        <div className="explore section-padding">
          <div className="container">
            <div className="row">
              <div className="col-xxl-2 col-xl-3 col-lg-3 col-md-3">
                <div className="filter-sidebar">
                  <div className="filter-sidebar-content">
                    <h5>Status</h5>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value=""
                        id="flexCheckDefault1"
                      />
                      <label
                        className="form-check-label"
                        htmlFor="flexCheckDefault1"
                      >
                        Buy Now
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value=""
                        id="flexCheckDefault2"
                      />
                      <label
                        className="form-check-label"
                        htmlFor="flexCheckDefault2"
                      >
                        On Auction
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value=""
                        id="flexCheckDefault3"
                      />
                      <label
                        className="form-check-label"
                        htmlFor="flexCheckDefault3"
                      >
                        New
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value=""
                        id="flexCheckDefault4"
                      />
                      <label
                        className="form-check-label"
                        htmlFor="flexCheckDefault4"
                      >
                        Has Offers
                      </label>
                    </div>
                  </div>
                  <div className="filter-sidebar-content">
                    <h5>Categories</h5>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value=""
                        id="flexCheckDefault1"
                      />
                      <label
                        className="form-check-label"
                        htmlFor="flexCheckDefault1"
                      >
                        Art
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value=""
                        id="flexCheckDefault2"
                      />
                      <label
                        className="form-check-label"
                        htmlFor="flexCheckDefault2"
                      >
                        Music
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value=""
                        id="flexCheckDefault3"
                      />
                      <label
                        className="form-check-label"
                        htmlFor="flexCheckDefault3"
                      >
                        Domain Names
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value=""
                        id="flexCheckDefault4"
                      />
                      <label
                        className="form-check-label"
                        htmlFor="flexCheckDefault4"
                      >
                        Virtual Worlds
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xxl-10 col-xl-9 col-lg-9 col-md-9 col-12">
                <div className="row">

                  {nfts && nfts.filter(nfts =>  nfts.attributes?.status === "listed" && nfts.attributes?.onchain_metadata?.collection === selectedCategory)
                    .map((NFT, index) => {
                    return (
                      <NftCards
                        key={index}
                        columnStyle="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-6 col-6"
                        metadata={NFT}
                        price={NFT.attributes.transaction.at(-1)?.price}
                        itemName={hex2ascii(NFT.attributes.asset_name)}
                        imageUrl={NFT.attributes.onchain_metadata?.image}
                        cardType={collectionConstants.BUY}
                        btnTitle="Show Detail"
                        buttonfunction={`/asset/${NFT.attributes.policy_id}/${NFT.attributes.asset_name}`}
                      />
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </Fragment>
  );
}
export default (Collectionitems);