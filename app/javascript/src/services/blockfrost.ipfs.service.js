import { post } from './blockfrost.http.service';

const BASE_URL = 'https://ipfs.blockfrost.io/api/v0/ipfs';
const UPLOAD_URL = BASE_URL + '/add';

const uploadNFTImage = async (file) => await post(UPLOAD_URL, file, 2)

export {
  uploadNFTImage
}
