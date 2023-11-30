import React, { useState } from "react";

import placeholder from '../../assets/branding/angryKongsLogoRed'
import './nftImage.scss'

/**
 * Component returns image from IPFS storage or a skeleton loader if image is not loaded
 * @param {url} imageUrl Image URL obtained from on chain metadata
 * @param {style} style CSS styling for the image tag
 * @param {Int16Array} width Width of the image
 * @returns
 */
export default function NftImage({ imageUrl, style = '' }) {
  const [loaded, setLoaded] = useState(false)
  if (imageUrl) {
    const ipfsGateway = 'ipfs.blockfrost.dev'
    const url = `https://${ipfsGateway}/ipfs/` + imageUrl.split('/').pop()

    if (loaded) {
      return (
        <img
          src={placeholder}
          alt={placeholder}
          width='100%'
          className={style}
          loading="lazy" />
      )
    } else {
      return (
        <img
          src={url}
          alt={url}
          width='100%'
          className={style}
          loading="lazy"
          onError={() => { setLoaded(true) }} />
      )
    }
  }
  else {
    return (
      <img
        src={placeholder}
        alt={placeholder}
        width='100%'
        className={style}
        loading="lazy" />
    )
  }
};
