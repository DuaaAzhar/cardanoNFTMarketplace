import AssetFingerprint from '@emurgo/cip14-js'

const isEmptyObj = obj => {
  if(Object.keys(obj).length === 0)
    return true;

  return false;
}

const isEmptyArr = arr => {
  if(arr.length === 0)
    return true;

  return false;
}

const isUndefined = variable => {
  if(typeof variable === typeof undefined)
    return true;

  return false;
}

/**
 * Returns the asset fingerprint
 * @param {string} policyIDHex The asset policy ID in Hexadecimal
 * @param {string} assetIDHex The asset ID in Hexadecimal
 * @return {string} Asset ID as a bech32-encoded blake2b-160
 * digest of the concatenation of the policy id and the asset name
 */
const getAssetFingerprint = (policyIDHex, assetIDHex) => {
  const assetFingerprint = AssetFingerprint.fromParts(
    Buffer.from(policyIDHex, 'hex'),
    Buffer.from(assetIDHex, 'hex'),
  );
  console.log(assetFingerprint.hash());

  return assetFingerprint.fingerprint()
}

export {
  isEmptyObj,
  isEmptyArr,
  isUndefined,
  getAssetFingerprint
}
