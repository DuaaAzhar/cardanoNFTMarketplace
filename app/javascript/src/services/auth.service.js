import { axiosInstance } from "../util/axiosInstance"
import { getUserId } from "./user.service";

const API_VERSION = '/v1';

const USERS_URL = API_VERSION + '/users/';

const COLLECTIONS_URL = API_VERSION + '/marketplace_collections/';
const NFTS_BY_COLLECTION_URL = '/nfts'

const NFTS_URL = API_VERSION + '/nft_collections/';
const NFTS_METADATA_URL = NFTS_URL + 'nfts_by_asset_id';
const NFT_LISTING = '/list_nft';
const NFT_UNLISTING = '/unlist_nft'
const NFT_FOR_SALE = '/nfts_for_sale'
const UPLOAD_NFT_URL = NFTS_URL + 'upload_nft'

// Users
const getUser = async (id = getUserId()) => ( await axiosInstance.get(USERS_URL + id) ).data.data.attributes;
const createUser = async (data) => ( await axiosInstance.post(USERS_URL, data) ).data
const updateUser = async (data, id = getUserId()) => ( await axiosInstance.put(USERS_URL + id, data) ).data

// Collections
const getCollections = async () => (await axiosInstance.get(COLLECTIONS_URL)).data
const getNftsByCollection = async (id) => (await axiosInstance.get(COLLECTIONS_URL + id + NFTS_BY_COLLECTION_URL)).data.data

// Nfts
const getNfts = async (params) => await axiosInstance.get(NFTS_URL, { params });
const getNft = async (id) => (await axiosInstance.get(NFTS_URL + `/${id}`)).data.data.attributes;
const getAssetsMetadata = async (params = null) => ( await axiosInstance.get(NFTS_METADATA_URL, { params }) ).data
const listNFT = async (params = null, dataBody = null) => (await axiosInstance.put((NFTS_URL + params + NFT_LISTING), dataBody))
const unlistNFT = async (params = null) => await axiosInstance.put((NFTS_URL + params + NFT_UNLISTING))
const getNftsForSale = async (id) => ( await axiosInstance.get(NFTS_URL + id + NFT_FOR_SALE)).data.data
const uploadNft = async (body) => ( await axiosInstance.post(UPLOAD_NFT_URL, body) )

export {
  getUser,
  createUser,
  updateUser,

  getCollections,
  getNftsByCollection,

  getNfts,
  listNFT,
  unlistNFT,
  getNft,
  getAssetsMetadata,
  getNftsForSale,
  uploadNft
}
