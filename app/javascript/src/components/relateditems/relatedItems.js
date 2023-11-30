import React, { Fragment, useEffect, useState } from "react";
import { getNfts } from "../../services/auth.service";
import { isEmptyArr, isEmptyObj } from "../../util/helpers";
import NftCards from "../nftcards/nftCards";

import "./relatedItems.scss";

export default function RelatedItems({ updateNFT, item, heading }) {
  const [nfts, setNfts] = useState([]);

  useEffect(() => {
    if (!isEmptyObj(item) && isEmptyArr(nfts)) {
      getNfts({ policy_id: item.policy_id })
        .then((result) => {
          result = result.data.data.filter(
            (nft) => nft.attributes.id !== item.id
          );
          setNfts(result);
        })
        .catch((error) => console.error(error));
    }
  }, [item]);

  const showRelatedItems = () =>
  <div className="row relateditems">
    {nfts.map((NFT) => {
      NFT = { ...NFT.attributes };

      return (
        <NftCards
          key={NFT.asset}
          metadata={NFT.onchain_metadata}
          columnStyle="col-xxl-3 col-lg-3 col-md-4 col-6"
          imageUrl={NFT.onchain_metadata.image}
          itemName={NFT.onchain_metadata.name}
          price={NFT.transaction.at(-1).price}
          buttonfunction={`/asset/${NFT.policy_id}/${NFT.asset_name}`}
          btnTitle="Detail"
          cardType="RelatedItems"
        />
      );
    })
    }
    </div>

  const showEmptyMessage = () => (
    <div className="activity-info d-flex justify-content-center">
      <h2><p className="text-secondary mt-5">No related items</p></h2>
    </div>
  );

  return (
    <Fragment>
      <h2 className="my-5">{heading}</h2>
      {!isEmptyArr(nfts) ? showRelatedItems() : showEmptyMessage()}
    </Fragment>
  );
}
