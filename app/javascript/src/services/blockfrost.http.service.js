import axios from 'axios';
import { blockfrostApiKey } from '../util/wallet/config';

/**
 * @param {string} url - url for request
 * @param {object} body - data to sent in request body
 * @param {integer} requestType - use to specify the request type ( 0 for testnet, 1 for mainnet and 2 for ipfs )
 * @returns {Promise}
*/
export const post = async (url, body = null, requestType = 0) => {
  return axios.post(
    url,
    body, {
      headers: {
        "project_id": blockfrostApiKey[requestType]
      }
    }
  )
}
