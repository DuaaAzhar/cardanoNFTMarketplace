import { Buffer } from 'buffer';

import { walletConstants } from '../../constants/wallet.constants';
import wallet from './wallet'

export default class NamiWalletApi extends wallet {
  constructor(serializationLib, cardano, apiKey) {
    super(serializationLib, cardano, apiKey)
  }

  // async transaction({
  //   PaymentAddress = "",
  //   recipients = [],
  //   metadata = null,
  //   utxosRaw = [],
  // }) {
  //   let networkId = (await this.getNetworkId()).id
  //   let utxos = utxosRaw.map((u) =>
  //     this.sLib.TransactionUnspentOutput.from_bytes(Buffer.from(u, "hex"))
  //   );
  //   let protocolParameter = await this._getProtocolParameter(networkId);
  //   let outputs = this.sLib.TransactionOutputs.new();

  //   let outputValues = {};
  //   let costValues = {};
  //   for (let recipient of recipients) {
  //     let lovelace = Math.floor((recipient.amount || 0) * 1000000).toString();
  //     let ReceiveAddress = recipient.address;
  //     let multiAsset = this._makeMultiAsset(recipient?.assets || []);

  //     let outputValue = this.sLib.Value.new(
  //       this.sLib.BigNum.from_str(lovelace)
  //     );

  //     if ((recipient?.assets || []).length > 0) {
  //       outputValue.set_multiasset(multiAsset);
  //       let minAda = this.sLib.min_ada_required(
  //         outputValue,
  //         this.sLib.BigNum.from_str(protocolParameter.minUtxo)
  //       );

  //       if (this.sLib.BigNum.from_str(lovelace).compare(minAda) < 0)
  //         outputValue.set_coin(minAda);
  //     }
  //     (recipient?.mintedAssets || []).map((asset) => {
  //       minting += 1;
  //       mintedAssetsArray.push({
  //         ...asset,
  //         address: recipient.address,
  //       });
  //     });

  //     if (parseInt(outputValue.coin().to_str()) > 0) {
  //       outputValues[recipient.address] = outputValue;
  //     }

  //     if (ReceiveAddress != PaymentAddress)
  //       costValues[ReceiveAddress] = outputValue;
  //     outputValues[ReceiveAddress] = outputValue;
  //     if (parseInt(outputValue.coin().to_str()) > 0) {
  //       outputs.add(
  //         this.sLib.TransactionOutput.new(
  //           this.sLib.Address.from_bech32(ReceiveAddress),
  //           outputValue
  //         )
  //       );
  //     }
  //   }

  //   const RawTransaction = await this._txBuilder({
  //     PaymentAddress: PaymentAddress,
  //     Utxos: utxos,
  //     Outputs: outputs,
  //     ProtocolParameter: protocolParameter,
  //     Metadata: metadata,
  //     Delegation: null,
  //   });

  //   return Buffer.from(RawTransaction, "hex").toString("hex");
  // }

  // async _txBuilder({
  //   PaymentAddress,
  //   Utxos,
  //   Outputs,
  //   ProtocolParameter,
  //   metadata = null,
  // }) {
  //   const MULTIASSET_SIZE = 5000;
  //   const VALUE_SIZE = 5000;
  //   const totalAssets = 0;

  //   CoinSelection.setProtocolParameters(
  //     ProtocolParameter.minUtxo.toString(),
  //     ProtocolParameter.linearFee.minFeeA.toString(),
  //     ProtocolParameter.linearFee.minFeeB.toString(),
  //     ProtocolParameter.maxTxSize.toString()
  //   );

  //   const selection = await CoinSelection.randomImprove(
  //     Utxos,
  //     Outputs,
  //     20 + totalAssets
  //   );
  //   const inputs = selection.input;
  //   const txBuilder = this.sLib.TransactionBuilder.new(
  //     this.sLib.LinearFee.new(
  //       this.sLib.BigNum.from_str(ProtocolParameter.linearFee.minFeeA),
  //       this.sLib.BigNum.from_str(ProtocolParameter.linearFee.minFeeB)
  //     ),
  //     this.sLib.BigNum.from_str(ProtocolParameter.minUtxo.toString()),
  //     this.sLib.BigNum.from_str(ProtocolParameter.poolDeposit.toString()),
  //     this.sLib.BigNum.from_str(ProtocolParameter.keyDeposit.toString()),
  //     MULTIASSET_SIZE,
  //     MULTIASSET_SIZE
  //   );

  //   for (let i = 0; i < inputs.length; i++) {
  //     const utxo = inputs[i];
  //     txBuilder.add_input(
  //       utxo.output().address(),
  //       utxo.input(),
  //       utxo.output().amount()
  //     );
  //   }

  //   let AUXILIARY_DATA;
  //   if (metadata) {
  //     AUXILIARY_DATA = this.sLib.AuxiliaryData.new();
  //     const generalMetadata = this.sLib.GeneralTransactionMetadata.new();
  //     Object.entries(Metadata).map(([MetadataLabel, Metadata]) => {
  //       generalMetadata.insert(
  //         this.sLib.BigNum.from_str(MetadataLabel),
  //         this.sLib.encode_json_str_to_metadatum(JSON.stringify(Metadata), 0)
  //       );
  //     });

  //     aux.set_metadata(generalMetadata);

  //     txBuilder.set_auxiliary_data(AUXILIARY_DATA);
  //   }

  //   for (let i = 0; i < Outputs.len(); i++) {
  //     txBuilder.add_output(Outputs.get(i));
  //   }

  //   const change = selection.change;
  //   const changeMultiAssets = change.multiasset();
  //   // check if change value is too big for single output
  //   if (changeMultiAssets && change.to_bytes().length * 2 > VALUE_SIZE) {
  //     const partialChange = this.sLib.Value.new(this.sLib.BigNum.from_str("0"));

  //     const partialMultiAssets = this.sLib.MultiAsset.new();
  //     const policies = changeMultiAssets.keys();
  //     const makeSplit = () => {
  //       for (let j = 0; j < changeMultiAssets.len(); j++) {
  //         const policy = policies.get(j);
  //         const policyAssets = changeMultiAssets.get(policy);
  //         const assetNames = policyAssets.keys();
  //         const assets = this.sLib.Assets.new();
  //         for (let k = 0; k < assetNames.len(); k++) {
  //           const policyAsset = assetNames.get(k);
  //           const quantity = policyAssets.get(policyAsset);
  //           assets.insert(policyAsset, quantity);
  //           //check size
  //           const checkMultiAssets = this.sLib.MultiAsset.from_bytes(
  //             partialMultiAssets.to_bytes()
  //           );
  //           checkMultiAssets.insert(policy, assets);
  //           const checkValue = this.sLib.Value.new(
  //             this.sLib.BigNum.from_str("0")
  //           );
  //           checkValue.set_multiasset(checkMultiAssets);
  //           if (checkValue.to_bytes().length * 2 >= VALUE_SIZE) {
  //             partialMultiAssets.insert(policy, assets);
  //             return;
  //           }
  //         }
  //         partialMultiAssets.insert(policy, assets);
  //       }
  //     };

  //     makeSplit();
  //     partialChange.set_multiasset(partialMultiAssets);

  //     const minAda = this.sLib.min_ada_required(
  //       partialChange,
  //       this.sLib.BigNum.from_str(ProtocolParameter.minUtxo)
  //     );
  //     partialChange.set_coin(minAda);

  //     txBuilder.add_output(
  //       this.sLib.TransactionOutput.new(
  //         this.sLib.Address.from_bech32(PaymentAddress),
  //         partialChange
  //       )
  //     );
  //   }
  //   txBuilder.add_change_if_needed(
  //     this.sLib.Address.from_bech32(PaymentAddress)
  //   );
  //   const transaction = this.sLib.Transaction.new(
  //     txBuilder.build(),
  //     this.sLib.TransactionWitnessSet.new(),
  //     AUXILIARY_DATA
  //   );

  //   const size = transaction.to_bytes().length * 2;
  //   if (size > ProtocolParameter.maxTxSize) throw walletConstants.TX_TOO_BIG;

  //   return transaction.to_bytes();
  // }

  // async _getProtocolParameter(networkId) {
  //   let latestBlock = await this._blockfrostRequest({
  //     endpoint: "/blocks/latest",
  //     networkId: networkId,
  //     method: "GET",
  //   });
  //   if (!latestBlock) throw ERROR.FAILED_PROTOCOL_PARAMETER;

  //   let p = await this._blockfrostRequest({
  //     endpoint: `/epochs/${latestBlock.epoch}/parameters`,
  //     networkId: networkId,
  //     method: "GET",
  //   }); // if(!p) throw ERROR.FAILED_PROTOCOL_PARAMETER

  //   return {
  //     linearFee: {
  //       minFeeA: p.min_fee_a.toString(),
  //       minFeeB: p.min_fee_b.toString(),
  //     },
  //     minUtxo: "1000000", //p.min_utxo, minUTxOValue protocol paramter has been removed since Alonzo HF. Calulation of minADA works differently now, but 1 minADA still sufficient for now
  //     poolDeposit: p.pool_deposit,
  //     keyDeposit: p.key_deposit,
  //     maxTxSize: p.max_tx_size,
  //     slot: latestBlock.slot,
  //   };
  // }

  // async _blockfrostRequest({body, endpoint = "", networkId = 0, headers = {}, method = "GET",}) {
  //   const testnetURL = "https://cardano-testnet.blockfrost.io/api/v0"
  //   const mainnetURL = "https://cardano-mainnet.blockfrost.io/api/v0"
  //   let networkEndpoint = networkId == 0 ? testnetURL : mainnetURL;
  //   let blockfrostApiKey = this.getApiKey(networkId);

  //   try {
  //     return await (
  //       await fetch(`${networkEndpoint}${endpoint}`, {
  //         headers: {
  //           project_id: blockfrostApiKey,
  //           ...headers,
  //         },
  //         method: method,
  //         body,
  //       })
  //     ).json();
  //   } catch (error) {
  //     console.log(error);
  //     return null;
  //   }
  // }
}
