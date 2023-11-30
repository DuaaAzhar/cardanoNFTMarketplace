import Loader from "./loader";

// TODO: Move these keys to environment variables
export const blockfrostApiKey = {
  0: 'testnetJcqSGnMbOYL2z216EQAa1lLaweTAl5ZY', // testnet
  1: 'mainnetT0QudbETEvUlTq2yyb9znrLD1mK5mHic', // mainnet
  2: 'ipfsqFOh8ykpUnHj9X4zTVPnxqVT3gLHchD9'     // IPFS
}

export const CardanoSerializer = async () => {
  await Loader.load();
  return Loader.CardanoSerializer;
}
