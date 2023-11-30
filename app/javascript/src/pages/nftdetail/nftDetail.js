import React, { Fragment, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import hex2ascii from "hex2ascii";

import CardanoIcon from "../../assets/cardano_logo.svg";
import NftImage from '../../components/nftimage/nftImage'
import Footer from "../../components/footer/footer";
import RelatedItems from "../../components/relateditems/relatedItems";
import { getNft } from "../../services/auth.service";
import BuyButton from "../../components/transaction/buyButton";
import SellButton from "../../components/transaction/sellButton";
import { isEmptyObj } from "../../util/helpers";
import './nftDetail.scss'

export default function NFTDetail() {
  const wallet = useSelector((state) => state.wallet.wallet);
  const walletSelected = useSelector((state) => state.wallet.walletSelected);

  const [NFT, setNFT] = useState({});
  const [loading, setLoading] = useState(true);
  const [walletAddress, setWalletAddress] = useState("");

  const { policyId, assetName } = useParams();
  const history = useHistory()

  useEffect(() => {
    checkStoreNFT();
    updateWalletAddress();
  }, [wallet, history.location.pathname]);

  const updateWalletAddress = () => {
    if (!isEmptyObj(wallet)) {
      wallet.getAddress()
        .then((address) => setWalletAddress(address))
        .catch((err) => console.error(err));
    }
  };

  const checkStoreNFT = () => {
    if (policyId && assetName) {
      getNft(`${policyId}${assetName}`)
        .then(nft => {
          if (nft) {
            setNFT(nft);
            setLoading(false);
          }
        })
        .catch(error => console.error(error))
    }
  };

  const propertiesListing = (data) => {
    let listings = [];
    for (const element in data) {
      if (typeof (data[element]) === 'object') {
        listings.push(
          <li key={element}
            className="list-group-item justify-content-between align-items-center">
            <strong>{element}</strong>
            <div><pre>{JSON.stringify(data[element], null, 2)}</pre></div>
          </li>
        );
      } else {
        listings.push(
          <li key={element}
            className="list-group-item d-flex justify-content-between align-items-center">
            <strong>{element}</strong>
            <span className="badge text-dark">{data[element]}</span>
          </li>
        )
      }
    }
    return listings;
  };

  const loadingSwitch = (loading) => {
    const asset_name = hex2ascii(NFT.asset_name);
    const imageUrl = NFT.onchain_metadata

    return (
      <SkeletonTheme baseColor="#dcdcdc" highlightColor="#e6e6fa">
        <div className="card-body">
          <div className="row">
            <div className="col-md-6 ">
              <div className="left-col">
                <div className="icon">
                  {loading ? <Skeleton circle={true} height={30} width={`100%`} /> :
                    <img src={CardanoIcon} className="cardano-icon" />
                  }
                </div>
                {(imageUrl) ?
                  <NftImage
                    imageUrl={imageUrl.image}
                    style={'detail-img img-fluid w-100'} /> :
                  <Skeleton height={500} width={`100%`} />
                }
              </div>
            </div>
            <div className="col-md-6">
              <Link to="#">
                <p className="mb-0 text-secondary">
                  {loading ? <Skeleton width={`20%`} /> :
                    NFT.onchain_metadata
                      ? NFT.onchain_metadata.collection
                      : "Unverified Collection"
                  }
                </p>
              </Link>
              <h3>
                {loading ? <Skeleton width={`25%`} /> :
                  <strong>{asset_name ? asset_name : "<Empty>"}</strong>
                }
              </h3>
              <div className="d-flex align-items-center mb-3">
                {NFT.onchain_metadata ?
                  <img
                    src="https://picsum.photos/200"
                    alt=""
                    className="me-3 avatar-detail-img"
                  />  :
                  <div className="pe-2"><Skeleton circle={true} height={30} width={30} /></div>
                }
                <div className="flex-grow-1">
                  {loading ? <Skeleton width={`25%`} height={25} /> :
                    <h5 className="mb-0">Aaron Wolfe<span className="circle bg-success"></span></h5>
                  }
                </div>
              </div>
              {loading ? <Skeleton width={`20%`} /> :
                <p className="text-secondary">Owned by: Addr1</p>
              }
              <div className="owned-card">
                {loading ? <div className="pe-2"><Skeleton height={30} width={200} /></div> :
                  <div className="owned-text">
                    policy id:{" "}
                    {NFT.policy_id
                      ? NFT.policy_id.slice(0, 5) +
                      "..." +
                      NFT.policy_id.slice(-5)
                      : "<Empty>"}
                  </div>
                }
                {loading ? <div className="pe-2"><Skeleton height={30} width={200} /></div> :
                  <div className="owned-text">
                    Asset id:{" "}
                    {NFT.fingerprint
                      ? NFT.fingerprint.slice(0, 5) +
                      "..." +
                      NFT.fingerprint.slice(-5)
                      : "<Empty>"}
                  </div>
                }
              </div>
              <div className="bid my-3 card">
                <div className="activity-content card-body py-2">
                  <div className=" price-card justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                      {NFT.status === "listed" &&
                        <div className="activity-info">
                            <p className="mb-0 text-secondary">Current price</p>
                          {loading ? <h2><Skeleton width={100} /></h2> :
                            <h2><strong>{NFT.transaction.at(-1)?.price} ADA</strong></h2>
                          }
                        </div>
                      }
                    </div>
                    <div>
                        {NFT.status === "listed" ? (
                          <BuyButton
                            NFT={NFT}
                            walletSelected={walletSelected}
                            updateNFT={setNFT}
                          />
                        ) : (
                          <SellButton
                            assetName={NFT.asset_name}
                            assetPolicyId={NFT.policy_id}
                            walletAddress={walletAddress}
                            updateNFT={setNFT}
                            customStyle="px-5"
                          />
                        )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="accordion" id="accordionExample">
                <div className="accordion-item">
                  <h2 className="accordion-header" id="headingOne">
                      <button
                        className="accordion-button"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseOne"
                        aria-expanded="true"
                        aria-controls="collapseOne"
                      >
                        <strong>Description</strong>
                      </button>
                  </h2>
                  <div
                    id="collapseOne"
                    className="accordion-collapse collapse show"
                    aria-labelledby="headingOne"
                    data-bs-parent="#accordionExample">
                    <div className="accordion-body">
                      {loading ? <Skeleton width={`30%`} /> :
                        NFT.onchain_metadata ?
                          NFT.onchain_metadata.description ? NFT.onchain_metadata.description
                            : 'Not Available' :
                          'Not Available'
                      }
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header" id="headingTwo">
                      <button
                        className="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseTwo"
                        aria-expanded="false"
                        aria-controls="collapseTwo"
                      >
                        <strong>Properties</strong>
                      </button>
                  </h2>
                  <div
                    id="collapseTwo"
                    className="accordion-collapse collapse"
                    aria-labelledby="headingTwo"
                    data-bs-parent="#accordionExample"
                  >
                    <div className="accordion-body">
                      {loading ? <Skeleton /> :
                        <ul className="list-group">
                          {propertiesListing(NFT.onchain_metadata)}
                        </ul>
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SkeletonTheme>
    );
  }
  return (
    <Fragment>
      <div className="item-single section-padding">
        <div className="container">
          <div className="row">
            <div className="col-xxl-12">
              <div className="top-bid">{loadingSwitch(loading)}</div>
            </div>
          </div>
          <RelatedItems item={NFT} heading='Related Items' />
        </div>
      </div>
      <Footer />
    </Fragment>
  );
}
