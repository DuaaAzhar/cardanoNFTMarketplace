import React, { useState, useEffect, Fragment } from "react";
import { useSelector } from "react-redux";
import { FaPencilAlt, FaCopy } from "react-icons/fa";
import { toast } from "react-toastify";

import { getUser, updateUser } from "../../../services/auth.service";
import promo from "../../../assets/dashboard/promo.png";
import avatar from "../../../assets/avatar/defaultAvatar.jpg";
import { isEmptyObj } from "../../../util/helpers";
import { collectionConstants } from "../../../constants/collection.constants";
import NftCards from "../../nftcards/nftCards";
import { hex2ascii } from "hex2ascii";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "./nfts.scss";


/**
 * Renders main dashboard
 */
export default function Nfts() {
  // Hooks
  const storeWallet = useSelector((state) => state.wallet.wallet);
  const storeMetaData = useSelector((state) => state.wallet.walletMetaData);
  const [walletAddress, setWalletAddress] = useState();
  const [userNameEditing, setUserNameEditing] = useState(false);
  const [user, setUser] = useState({});
  const [copyToolTip, setCopyToolTip] = useState("copy");

  useEffect(() => {
    if (isEmptyObj(user))
      getUser()
        .then((user) => setUser(user))
        .catch((err) => console.error(err));

    try {
      if (!isEmptyObj(storeWallet)) {
        setWalletAddress(null);
        updateWalletAddress();
      }
    } catch (error) {
      console.error(error);
    }
  }, [storeWallet, storeMetaData]);

  const updateWalletAddress = () => {
    storeWallet.getAddress().then((address) => setWalletAddress(address));
  };

  const submitUser = async (event) => {
    event.preventDefault();
    setUserNameEditing(!userNameEditing);
    await updateUser({ users: user });
  };

  const nftCardsSwitch = () => {
    if (storeMetaData <= 0) {
      return <h1>Nothing to show</h1>;
    } else if (storeMetaData.length > 0) {
      return (
        <Fragment>
          {storeMetaData && storeMetaData.map((NFT, index) => {
            return (
              <div key={index} className="col-xxl-3 col-lg-4 col-md-4 col-6 mt-4">
                <NftCards
                  metadata={NFT}
                  btnTitle="Detail"
                  policyId={NFT.policy_id}
                  itemNameHex={NFT.asset_name}
                  walletAddress={walletAddress}
                  itemNameInHex={NFT.asset_name}
                  cardType={collectionConstants.SELL}
                  imageUrl={NFT.onchain_metadata.image}
                  itemName={hex2ascii(NFT.asset_name)}
                  buttonfunction={`/asset/${NFT.policy_id}/${NFT.asset_name}`}
                />
              </div>
            )
          })}
        </Fragment>
      );
    }
  };

  const walletAddressSwitch = () => {
    if (walletAddress == null) {
      return (
        <SkeletonTheme baseColor="#dcdcdc" highlightColor="#e6e6fa">
          <div className="justify-content-center d-inline-flex">
            <Skeleton width={150}/>
            </div>
        </SkeletonTheme>
      );
    }
     else {
      return (
        <div className="justify-content-center d-inline-flex">
          {walletAddress.slice(0, 4) + "..." + walletAddress.slice(-5)}
          <div
            className="justify-content-center d-inline-flex flex-column"
            data-bs-toggle="tooltip"
            data-bs-placement="right"
            title={copyToolTip}
            style={{ marginLeft: 10, cursor: "pointer" }}
          >
            <FaCopy
              size="1.25rem"
              onClick={() => {
                navigator.clipboard.writeText(walletAddress);
                setCopyToolTip("Copied");
                toast.success(`Copied !`);
              }}
              color="grey"
            />
          </div>
        </div>
      );
    }
  };

  return (
    <div className="content-body">
      <div className="container">
        <div className="row responsive-sidebar">
          <div className="col-xxl-12 hero-section">
            <div className="banner">
              <img src={promo} alt="header-img" className="main-img" />
              <img
                src={avatar}
                alt="header-img"
                className="d-flex m-auto avatar-img"
              />
            </div>
            <div className="detail w-50 m-auto">
              <div className="user-name">
                {userNameEditing ? (
                  <form onSubmit={submitUser}>
                    <h1>
                      <input
                        type="text"
                        maxLength="14"
                        className="justify-content-between text-center w-55 border-0 bg-light"
                        value={user.name}
                        onChange={(event) =>
                          setUser({ ...user, name: event.target.value })
                        }
                      />
                    </h1>
                  </form>
                ) : (
                  <h1 className="title">
                    {(user?.name) ?
                      <Fragment>
                        {user.name}
                        <span className="edit-btn">
                          <FaPencilAlt
                            onClick={() => setUserNameEditing(!userNameEditing)}
                          />
                        </span>
                      </Fragment> :
                      <SkeletonTheme baseColor="#dcdcdc" highlightColor="#e6e6fa">
                        <Skeleton width={`40%`} />
                      </SkeletonTheme>
                    }
                  </h1>
                )}
              </div>
              <div className="location">{walletAddressSwitch()}</div>
            </div>
          </div>
          <div className="col-12">
            <div className="d-flex justify-content-between Trending-bids-responsive ">
              <h4 className="card-title mb-3">Trending Bids</h4>
            </div>
          </div>
          <div className="row nfts pr-0">
            {nftCardsSwitch()}
          </div>
        </div>
      </div>
    </div>
  );
}
