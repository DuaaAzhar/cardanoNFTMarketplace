//import { DataCost } from "@emurgo/cardano-serialization-lib-browser";
import { walletConstants } from "../../constants/wallet.constants";
import { Buffer } from "buffer";
// import mintAsset from "../../cardano/mintAsset_v2";

/**
 * Defines wallets class
 * @abstract
 */
 export default class wallet { 

  constructor(serializationLib, cardano, apiKey) {
    this.apiKey = apiKey
    this.sLib = serializationLib
    this.cardano = cardano
    this.wallet = {}
    this.balance = 0
    this.usedAddress = undefined
    this.addressBech32SendADA = 'addr_test1qq94l0nk035lc qwyqw4yr92z3plkkytxtcg9jggguyr6dke4uz9m0sjq6uqqc0wxalwetekapt9a8a92lrtzscz5ek9q7x9dmj' // Eternl Wallet HQ
    // this.addressBech32SendADA = 'addr_test1qzefevmfnqja3zz0csgjfhw3qseeydlkvm9dywgnpta3gtx8k7pghq83u60h6vesycm4t5rc9aqsf54v8cvjn0hzxjxslt89g4' // Hamza Awan Nami
    this.changeAddress = 'addr_test1qzfcw5quv9cstpejaasd33ccxz7dsvlpuxex0w2rx0hwyxtr65qjwrtuuwrrpslth7a54hkjz745yz48wg7lyeyc8y8qylzyqx' // Nami Wallet HQ
    this.assetAmountToSend = 1
    this.addressScriptBech32 = "addr_test1wpnlxv2xv9a9ucvnvzqakwepzl9ltx7jzgm53av2e9ncv4sysemm8" // Plutus "Always Succeed Smart Contract Address"
    this.plutusScriptCborHex = "4e4d01000033222220051200120011",
    this.datumStr= "12345678"         // TODO: Add this datum to environment variable before deploying to mainnet
    this.tokenLockInfo = undefined
    this.transactionIndxLocked = 0
    this.manualFee = 900000
    this.lovelaceLocked = 3000000
    this.CollatUtxos = undefined
    this.seller = ""
    this.sellPrice = 2000000
  }

  /**
   * Enable wallet
   * @return {Promise<boolean>} True if wallet enabled else false
   */
  async enable() {
    this.wallet = await this.cardano.enable();
    return true
  }

  /**
   * Returns wallet installed status
   * @return {boolean} True if wallet installed else false
   */
  isInstalled() {
    return !!this.cardano;
  }

  /**
   * Returns wallet enable status
   * @return {Promise<boolean>} True if wallet enabled else false
   */
  async isEnabled() {
    return await this.cardano.isEnabled();
  }

  /**
   * Returns wallet address
   * @return {Promise<string>} Wallet address
   */
  async getAddress() {
    if (!this.wallet) throw walletConstants.NOT_CONNECTED;
    if (this.usedAddress) return this.usedAddress;

    const raw = await this.wallet.getUsedAddresses();
    const rawFirst = raw[0];
    this.usedAddress = await this.sLib.Address.from_bytes(Buffer.from(rawFirst, "hex")).to_bech32();
    return this.usedAddress;
  }

  /**
   * Get network ID
   * @throws Error is wallet not connected
   * @return {Promise<number>} network id
   */
  async getNetworkId() {
    if (!this.wallet) throw walletConstants.NOT_CONNECTED;
    return await this.wallet.getNetworkId()
  }

  /**
   * Returns wallet API Key
   * @return {string} Wallet API Key
   */
  async getApiKey() {
    const networkID = await this.getNetworkId()
    return networkID === 0 ? this.apiKey[0] : this.apiKey[1]
  }

  /**
   * Sets wallet balance
   * @return {Promise<boolean>} Returns true if balance set
   */
  async setBalance() {
    const walletBalanceCBORHex = await this.wallet.getBalance()
    this.balance = this.sLib.Value.from_bytes(Buffer.from(walletBalanceCBORHex, 'hex')).coin().to_str();

    return true
  }

  /**
   * Returns wallet balance
   * @return {string} Wallet balance
   */
  getBalance() {
    return this.balance
  }

  /**
   * Returns wallet icon
   * @return {SVGElement} Wallet Icon
   */
  getIcon() {
    return this.cardano.icon;
  }

  /**
   * Returns the Utxos controlled by wallet
   * @return {object} Utxos controlled by wallet
   */
  async getUtxos () {
    let Utxos = [];
    const rawUtxos = await this.wallet.getUtxos();

    for (const rawUtxo of rawUtxos) {
      const utxo = this.sLib.TransactionUnspentOutput.from_bytes(Buffer.from(rawUtxo, "hex"));
      const input = utxo.input();
      const txid = Buffer.from(input.transaction_id().to_bytes(), "utf8").toString("hex");
      const txindx = input.index();
      const output = utxo.output();
      const amount = output.amount().coin().to_str(); // ADA amount in lovelace
      const multiasset = output.amount().multiasset();
      let assetIDCollection = [];

      if (multiasset) {
        const keys = multiasset.keys() // policy Ids of the multiasset
        const N = keys.len();

        for (let i = 0; i < N; i++){
          const policyId = keys.get(i);
          const policyIdHex = Buffer.from(policyId.to_bytes(), "utf8").toString("hex");
          const assets = multiasset.get(policyId)
          const assetNames = assets.keys();
          const K = assetNames.len()

          for (let j = 0; j < K; j++) {
            const assetName = assetNames.get(j);
            const assetNameString = Buffer.from(assetName.name(),"utf8").toString();
            const assetNameHex = Buffer.from(assetName.name(),"utf8").toString("hex")
            assetIDCollection.push(`${policyIdHex}${assetNameHex}`)
          }
        }
      }
      const obj = {
        txid: txid,
        txindx: txindx,
        amount: amount,
        assetIDs: assetIDCollection,
        TransactionUnspentOutput: utxo
      }
      Utxos.push(obj);
    }

    return Utxos
  }

  /**
   * The collateral is need for working with Plutus Scripts
   * Essentially you need to provide collateral to pay for fees if the
   * script execution fails after the script has been validated...
   * this should be an uncommon occurrence and would suggest the smart contract
   * would have been incorrectly written.
   * The amount of collateral to use is set in the wallet
   * @returns {Promise<void>}
   */
  async getCollateral (storeWalletSelected){
    let CollatUtxos = [];
    
    try {

        let collateral = [];
        if (storeWalletSelected === "nami") {
            collateral = await this.wallet.experimental.getCollateral();
        } else {
            collateral = await this.wallet.getCollateral();
        }
      console.log("collateral[]= ", collateral);

        for (const x of collateral) {
            const utxo = this.sLib.TransactionUnspentOutput.from_bytes(
              Buffer.from(x, "hex"));
            CollatUtxos.push(utxo)
        
        }
        // this.setState({CollatUtxos})
        return CollatUtxos
    } catch (err) {
        console.error(err)
    }

}

  /**
   * Get Protocol Parameters
   * @return {object} Protocol Parameters
   */
  getProtocolParameters () {
    return {
      linearFee: {
          minFeeA: "44",
          minFeeB: "155381",
      },
      minUtxo: "34482",
      poolDeposit: "500000000",
      keyDeposit: "2000000",
      maxValSize: 5000,
      maxTxSize: 16384,
      priceMem: 0.0577,
      priceStep: 0.0000721,
      coinsPerUtxoWord: "34482",
      coins_per_utxo_byte: "4310"
    }
  }

  /**
   * Every transaction starts with initializing the
   * TransactionBuilder and setting the protocol parameters
   * This is boilerplate
   * @returns {Promise<TransactionBuilder>}
   */
  async initTransactionBuilder() {
    const protocolParams = this.getProtocolParameters()

    const txBuilder = this.sLib.TransactionBuilder.new(
      this.sLib.TransactionBuilderConfigBuilder.new()
        .fee_algo(this.sLib.LinearFee.new(
          this.sLib.BigNum.from_str(protocolParams.linearFee.minFeeA),
          this.sLib.BigNum.from_str(protocolParams.linearFee.minFeeB)))
        .pool_deposit(this.sLib.BigNum.from_str(protocolParams.poolDeposit))
        .key_deposit(this.sLib.BigNum.from_str(protocolParams.keyDeposit))
        .coins_per_utxo_word(this.sLib.BigNum.from_str(protocolParams.coinsPerUtxoWord))
        .max_value_size(protocolParams.maxValSize)
        .max_tx_size(protocolParams.maxTxSize)
        //.coins_per_utxo_byte(this.sLib.BigNum.from_str(protocolParams.coins_per_utxo_byte))
        .prefer_pure_change(true)
        .build()
    );

    return txBuilder
  }

  /**
   * Builds an object with all the UTXOs from the user's wallet
   * @returns {Promise<TransactionUnspentOutputs>}
   */
  async getTxUnspentOutputs() {
      let txOutputs = this.sLib.TransactionUnspentOutputs.new()
      const Utxos = await this.getUtxos()
      for (const utxo of Utxos) {
          txOutputs.add(utxo.TransactionUnspentOutput)
      }
      return txOutputs
  }

  async buildSendTokenTransaction(assetName = undefined, assetPolicyId = undefined) {
    const protocolParams = this.getProtocolParameters()
    const txBuilder = await this.initTransactionBuilder();
    const shelleyOutputAddress = this.sLib.Address.from_bech32(this.addressBech32SendADA);
    const shelleyChangeAddress = this.sLib.Address.from_bech32(this.changeAddress);

    let txOutputBuilder = this.sLib.TransactionOutputBuilder.new();
    txOutputBuilder = txOutputBuilder.with_address(shelleyOutputAddress);
    txOutputBuilder = txOutputBuilder.next();

    let multiAsset = this.sLib.MultiAsset.new();
    let assets = this.sLib.Assets.new()
    assets.insert(
      this.sLib.AssetName.new(Buffer.from(assetName, "hex")), // Asset Name
      this.sLib.BigNum.from_str(this.assetAmountToSend.toString()) // How much to send
    );
    multiAsset.insert(
      this.sLib.ScriptHash.from_bytes(Buffer.from(assetPolicyId, "hex")), // PolicyID
      assets
    );
    txOutputBuilder = txOutputBuilder.with_asset_and_min_required_coin(multiAsset, this.sLib.BigNum.from_str(protocolParams.coinsPerUtxoWord))
    const txOutput = txOutputBuilder.build();

    txBuilder.add_output(txOutput)

    // Find the available UTXOs in the wallet and
    // us them as Inputs
    const txUnspentOutputs = await this.getTxUnspentOutputs();
    txBuilder.add_inputs_from(txUnspentOutputs,3)

    // set the time to live - the absolute slot value before the tx becomes invalid
    // txBuilder.set_ttl(51821456);

    // calculate the min fee required and send any change to an address
    txBuilder.add_change_if_needed(shelleyChangeAddress)

    // once the transaction is ready, we build it to get the tx body without witnesses
    const txBody = txBuilder.build();

    // Tx witness
    const transactionWitnessSet = this.sLib.TransactionWitnessSet.new();

    const tx = this.sLib.Transaction.new(
      txBody,
      this.sLib.TransactionWitnessSet.from_bytes(transactionWitnessSet.to_bytes())
    )

    let txVkeyWitnesses = await this.wallet.signTx(Buffer.from(tx.to_bytes(), "utf8").toString("hex"), true);
    txVkeyWitnesses = this.sLib.TransactionWitnessSet.from_bytes(Buffer.from(txVkeyWitnesses, "hex"));

    transactionWitnessSet.set_vkeys(txVkeyWitnesses.vkeys());

    const signedTx = this.sLib.Transaction.new(
      tx.body(),
      transactionWitnessSet
    );

    const submittedTxHash = await this.wallet.submitTx(Buffer.from(signedTx.to_bytes(), "utf8").toString("hex"));

    // const txBodyCborHex_unsigned = Buffer.from(txBody.to_bytes(), "utf8").toString("hex");
    // this.setState({txBodyCborHex_unsigned, txBody})
  }

  async buildSendTokenToPlutusScript(
    assetName = undefined,
    assetPolicyId = undefined,
    walletAddress = undefined) {

    const txBuilder = await this.initTransactionBuilder();
    const ScriptAddress = this.sLib.Address.from_bech32(this.addressScriptBech32);
    const shelleyChangeAddress = this.sLib.Address.from_bech32(walletAddress);
    const protocolParams = this.getProtocolParameters();
    this.seller = walletAddress;


    
    let txOutputBuilder = this.sLib.TransactionOutputBuilder.new();
    // Adding script address as output on which we will send NFT
    txOutputBuilder = txOutputBuilder.with_address(ScriptAddress);

    //Adding datum in output, which will be added up in UTXO
    const dataHash = this.sLib.hash_plutus_data(
      this.sLib.PlutusData.new_integer(this.sLib.BigInt.from_str(this.datumStr)))
    txOutputBuilder = txOutputBuilder.with_data_hash(dataHash)

    txOutputBuilder = txOutputBuilder.next(); //returns= TransactionOutputAmountBuilder which adds up assets 

    let multiAsset = this.sLib.MultiAsset.new();
    let assets = this.sLib.Assets.new()
    assets.insert(
      this.sLib.AssetName.new(Buffer.from(assetName, "hex")), // Asset Name
      this.sLib.BigNum.from_str(this.assetAmountToSend.toString()) // How much to send
    );
    multiAsset.insert(
      this.sLib.ScriptHash.from_bytes(Buffer.from(assetPolicyId, "hex")), // PolicyID
      assets
    );

    // let datacost = new DataCost();
    // datacost.new_coins_per_byte(this.sLib.BigNum.from_str("4310"));
    // txOutputBuilder = txOutputBuilder.with_asset_and_min_required_coin_by_utxo_cost(multiAsset, datacost);
    // TODO: we need to use the below function in our dApp
     txOutputBuilder = txOutputBuilder.with_asset_and_min_required_coin(multiAsset, this.sLib.BigNum.from_str(protocolParams.coinsPerUtxoWord))

    //txOutputBuilder = txOutputBuilder.with_coin_and_asset(this.sLib.BigNum.from_str(this.lovelaceLocked.toString()), multiAsset)
    // txOutputBuilder = txOutputBuilder.with_asset_and_min_required_coin(multiAsset, this.sLib.BigNum.from_str(protocolParams.coinsPerUtxoWord))
    const txOutput = txOutputBuilder.build();

    txBuilder.add_output(txOutput)
    //................................txOutput ended.....................
    // Find the available UTXOs in the wallet and
    // use them as Inputs
    const txUnspentOutputs = await this.getTxUnspentOutputs();
    txBuilder.add_inputs_from(txUnspentOutputs, 3)

    // calculate the min fee required and send any change to an address
    txBuilder.add_change_if_needed(shelleyChangeAddress)

    // once the transaction is ready, we build it to get the tx body without witnesses
    const txBody = txBuilder.build();

    // Tx witness
    const transactionWitnessSet = this.sLib.TransactionWitnessSet.new();

    const tx = this.sLib.Transaction.new(
      txBody,
      this.sLib.TransactionWitnessSet.from_bytes(transactionWitnessSet.to_bytes())
    )

    let txVkeyWitnesses = await this.wallet.signTx(Buffer.from(tx.to_bytes(), "utf8").toString("hex"), true);
    txVkeyWitnesses = this.sLib.TransactionWitnessSet.from_bytes(Buffer.from(txVkeyWitnesses, "hex"));

    transactionWitnessSet.set_vkeys(txVkeyWitnesses.vkeys());

    const signedTx = this.sLib.Transaction.new(tx.body(), transactionWitnessSet);

    const submittedTxHash = await this.wallet.submitTx(Buffer.from(signedTx.to_bytes(), "utf8").toString("hex"));

    console.log('Tx Hash NFT Locked: ', submittedTxHash);
    return submittedTxHash
  }

  async buildRedeemTokenFromPlutusScript(
    assetName = undefined,
    assetPolicyId = undefined,
    storeWalletSelected = undefined,
    transactionHashLocked = undefined
  ) {
    
    const txBuilder = await this.initTransactionBuilder();
    const ScriptAddress = this.sLib.Address.from_bech32(this.addressScriptBech32);
    const walletAddress = await this.getAddress()
    const shelleyChangeAddress = this.sLib.Address.from_bech32(walletAddress)
    const protocolParams = this.getProtocolParameters();


    const assetVal = this.sLib.Value.new(this.sLib.BigNum.from_str('0'));
    let multiAsset = this.sLib.MultiAsset.new();
    let assets = this.sLib.Assets.new()
    assets.insert(
      this.sLib.AssetName.new(Buffer.from(assetName, "hex")), // Asset Name
      this.sLib.BigNum.from_str(this.assetAmountToSend.toString()) // How much to send
    );

    multiAsset.insert(
      this.sLib.ScriptHash.from_bytes(Buffer.from(assetPolicyId, "hex")), // PolicyID
      assets
    );
    console.log("assets= ", assets)
    console.log("multiAsset= ",multiAsset)
    assetVal.set_multiasset(multiAsset);

    console.log("TxHash Locked= ",transactionHashLocked);

   
    // txBuilder.set_fee(this.sLib.BigNum.from_str(Number(this.manualFee).toString()))

    // Add outputs
    // const outputVal = (3000000).toString() - Number(this.manualFee)
    // const outputValStr = outputVal.toString();

    let txOutputBuilder = this.sLib.TransactionOutputBuilder.new();
    txOutputBuilder = txOutputBuilder.with_address(shelleyChangeAddress);
    txOutputBuilder = txOutputBuilder.next();
    console.log("after next= ", txOutputBuilder);
    // txOutputBuilder = txOutputBuilder.with_coin_and_asset(
    //   this.sLib.BigNum.from_str(outputValStr),
    //   multiAsset
    // )
    txOutputBuilder = txOutputBuilder.with_asset_and_min_required_coin(multiAsset, this.sLib.BigNum.from_str(protocolParams.coinsPerUtxoWord))
    //txOutputBuilder = txOutputBuilder.with_value(assetVal);
    // let datacost = new DataCost();
    // datacost.new_coins_per_byte(datacost.coins_per_byte());
     //txOutputBuilder = txOutputBuilder.with_asset_transactionHashLockedand_min_required_coin_by_utxo_cost(multiAsset, this.sLib.BigNum.from_str(protocolParams.coins_per_utxo_byte))
    
    console.log("txOutput after adding asset= ", txOutputBuilder);
    const txOutput = txOutputBuilder.build();
    
  
    txBuilder.add_output(txOutput)
    console.log("txBuilder after adding output: ", txBuilder)
    

    txBuilder.add_input(
      ScriptAddress,
      this.sLib.TransactionInput.new(
        this.sLib.TransactionHash.from_bytes(Buffer.from(transactionHashLocked, "hex")),
        this.transactionIndxLocked.toString()),
      this.sLib.Value.new_from_assets(multiAsset),
        
    )     // how much lovelace is at that UTXO

    //txBuilder.set_fee(this.sLib.BigNum.from_str(Number(this.manualFee).toString()))

    const txUnspentOutputs = await this.getTxUnspentOutputs();
    txBuilder.add_inputs_from(txUnspentOutputs, 3)
    // calculate the min fee required and send any change to an address
    txBuilder.add_change_if_needed(shelleyChangeAddress)
    console.log("after returning change= ", txBuilder);
    // once the transaction is ready, we build it to get the tx body without witnesses
    const txBody = txBuilder.build();

    const scripts = this.sLib.PlutusScripts.new();
    scripts.add(this.sLib.PlutusScript.from_bytes(Buffer.from(this.plutusScriptCborHex, "hex"))); //from cbor of plutus script

    const collateral = await this.getCollateral(storeWalletSelected);
    const inputs = this.sLib.TransactionInputs.new();
    collateral.forEach((utxo) => inputs.add(utxo.input()) );

    let datums = this.sLib.PlutusList.new();
    // datums.add(PlutusData.from_bytes(Buffer.from(this.state.datumStr, "utf8")))
    datums.add(this.sLib.PlutusData.new_integer(
      this.sLib.BigInt.from_str(this.datumStr)))

    const redeemers = this.sLib.Redeemers.new();

    const data = this.sLib.PlutusData.new_constr_plutus_data(
        this.sLib.ConstrPlutusData.new(
          this.sLib.BigNum.from_str("0"),
          this.sLib.PlutusList.new()
        )
    );

    const redeemer = this.sLib.Redeemer.new(
      this.sLib.RedeemerTag.new_spend(),
      this.sLib.BigNum.from_str("0"),
      data,
      this.sLib.ExUnits.new(
        this.sLib.BigNum.from_str("7000000"),
        this.sLib.BigNum.from_str("3000000000")
      )
    );

    redeemers.add(redeemer)
    

    // Tx witness
    const transactionWitnessSet = this.sLib.TransactionWitnessSet.new();

    transactionWitnessSet.set_plutus_scripts(scripts)
    transactionWitnessSet.set_plutus_data(datums)
    transactionWitnessSet.set_redeemers(redeemers)

    const costModel = this.sLib.TxBuilderConstants.plutus_vasil_cost_models().get(this.sLib.Language.new_plutus_v1())    

    const costModels = this.sLib.Costmdls.new();
    costModels.insert(this.sLib.Language.new_plutus_v1(), costModel);

    const scriptDataHash = this.sLib.hash_script_data(redeemers, costModels, datums);
    txBody.set_script_data_hash(scriptDataHash);

    txBody.set_collateral(inputs)

    const baseAddress = this.sLib.BaseAddress.from_address(shelleyChangeAddress)
    const requiredSigners = this.sLib.Ed25519KeyHashes.new();
    requiredSigners.add(baseAddress.payment_cred().to_keyhash())

    txBody.set_required_signers(requiredSigners);
    
    const tx = this.sLib.Transaction.new(
      txBody,
      this.sLib.TransactionWitnessSet.from_bytes(transactionWitnessSet.to_bytes())
    )

    let txVkeyWitnesses = await this.wallet.signTx(Buffer.from(tx.to_bytes(), "utf8").toString("hex"), true);
    txVkeyWitnesses = this.sLib.TransactionWitnessSet.from_bytes(Buffer.from(txVkeyWitnesses, "hex"));

    transactionWitnessSet.set_vkeys(txVkeyWitnesses.vkeys());
    const signedTx = this.sLib.Transaction.new(tx.body(), transactionWitnessSet);

    const submittedTxHash = await this.wallet.submitTx(Buffer.from(signedTx.to_bytes(), "utf8").toString("hex"));
    console.log('Tx Hash NFT Reedemed: ', submittedTxHash);
    return submittedTxHash
  }

  // Minting
  async mintAsset(partialMetaData){
    const walletAddressBech32 = await this.getAddress()

    let publicKeyHash = this.sLib.BaseAddress.from_address(
      this.sLib.Address.from_bech32(walletAddressBech32)
    )
    .payment_cred()
    .to_keyhash()
    const nativeScripts = this.sLib.NativeScripts.new()
    const scriptPubkey = this.sLib.NativeScript
    .new_script_pubkey(
      this.sLib.ScriptPubkey.new(publicKeyHash)
    )
    nativeScripts.add(
      scriptPubkey
    )
    const nativeScript =
      this.sLib.NativeScript
        .new_script_all(
          this.sLib.ScriptAll.new(nativeScripts)
        )
    const policyId = Buffer.from(nativeScript.hash(0).to_bytes()).toString('hex')

    const txBuilder = await this.initTransactionBuilder();
    const shelleyOutputAddress = this.sLib.Address.from_bech32(walletAddressBech32);
    const shelleyChangeAddress = this.sLib.Address.from_bech32(walletAddressBech32);

    let txOutputBuilder = this.sLib.TransactionOutputBuilder.new();
    txOutputBuilder = txOutputBuilder.with_address(shelleyOutputAddress);

    for (let i = 0; i < Object.keys(partialMetaData).length; i++){
      const assetName = this.sLib.AssetName.new(Buffer.from((Object.keys(partialMetaData)[i]), 'utf-8'))
      const assetNumber = this.sLib.Int.new_i32(1)
      txBuilder.add_mint_asset(
        nativeScript,
        assetName,
        assetNumber,
      )
    }

    const metaData = {
      [policyId]: partialMetaData
    }

    const generalTxMeta = this.sLib.GeneralTransactionMetadata.new()
    generalTxMeta.insert(
      this.sLib.BigNum.from_str('721'),
      this.sLib.encode_json_str_to_metadatum(
        JSON.stringify(metaData),
        0
      )
    );

    txBuilder.set_metadata(generalTxMeta)

    const txUnspentOutputs = await this.getTxUnspentOutputs();
    txBuilder.add_inputs_from(txUnspentOutputs,3)

    txBuilder.add_change_if_needed(shelleyChangeAddress)

    const txBody = txBuilder.build_tx();

    const txVkeyWitness = await this.wallet.signTx(
      Buffer.from(txBody.to_bytes()).toString('hex'),
      true
    )
    const txWitnesses = this.sLib.TransactionWitnessSet.from_bytes(
      Buffer.from(txVkeyWitness, 'hex')
    );

    const transactionWitnessSet = txBody.witness_set()
    transactionWitnessSet.set_vkeys(txWitnesses.vkeys())

    const signedTx = this.sLib.Transaction.new(
      txBody.body(),
      transactionWitnessSet,
      txBody.auxiliary_data()
    );

    const submittedTxHash = await this.wallet.submitTx(Buffer.from(signedTx.to_bytes(), "utf8").toString("hex"));
    console.log('Mint TxHash:',submittedTxHash);
    return submittedTxHash
  }
 }
