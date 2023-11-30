import React, { Fragment, useEffect, useState } from "react";
import { getCollections } from "../../services/auth.service";
import NftCards from "../../components/nftcards/nftCards"
import Footer from "../../components/footer/footer";
import { Link } from "react-router-dom";
import './collection.scss'
import { useDispatch } from "react-redux";
import { updateSelectedCategory } from "../../actions/category";

const Collection = () => {
  const [collections, setCollections] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const dispatch = useDispatch();

  useEffect(() => {
    getCollections()
      .then((collections) => setCollections(collections.data))
      .catch((err) => console.error(`${err}`));
  }, []);

  const filterCollections = (category) => {
    setSelectedCategory(category);
    dispatch(updateSelectedCategory(category));
  };

  return (
    <Fragment>
      <div id="main-wrapper" className="front">
        <div className="container pt-5 pb-4 mt-2 text-center">
          <h1>Explore Collections</h1>
        </div>
        <div className="collections my-4">
          <div className="container">
            <div className="row">
              <div className="filter-tab">
                <div className="filter-nav mb-4">
                  <Link to="#" className={selectedCategory === "All" ? "active text-link" : "text-link"}
                    onClick={() => filterCollections("All")}>All</Link>
                  <Link to="#" className={selectedCategory === "games" ? "active text-link" : "text-link"}
                    onClick={() => filterCollections("games")}>Games</Link>
                  <Link to="#" className={selectedCategory === "artwork" ? "active text-link" : "text-link"}
                    onClick={() => filterCollections("artwork")}>Artwork</Link>
                </div>
                {(collections === null) ?
                  <h1>Nothing to show</h1> :
                  <div className="row collection_items">
                    {
                    collections &&
                      collections.filter((item) => item.attributes.nft_collections[0].status === "listed" && selectedCategory === "All" || item.attributes.nft_collections[0]?.onchain_metadata?.collection === selectedCategory)
                        .map((item, id) => {
                        const collection = { ...item.attributes };
                        const image = collection.nft_collections[0]?.onchain_metadata?.image
                        return (
                          <NftCards
                            key={id}
                            metadata={collection}
                            columnStyle={`col-xxl-3 col-lg-3 col-md-4 col-6`}
                            imageUrl={image}
                            itemName={collection.nft_collections[0]?.onchain_metadata?.name}
                            buttonfunction={`collections/${item.id}`}
                            btnTitle="Explore"
                            loading={collection}
                          />
                        );
                      })}
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </Fragment>
  );
}

export default Collection;
