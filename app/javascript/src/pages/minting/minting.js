import React, { Fragment, useState } from "react";
import { useSelector } from 'react-redux';
import { toast } from "react-toastify";
import {TailSpin} from 'react-loader-spinner'

import Footer from "../../components/footer/footer";
import { uploadNft } from "../../services/auth.service";
import { walletConstants } from "../../constants/wallet.constants";
import "./minting.scss"
import { isUndefined } from "../../util/helpers";

const nftsLimit = 10
const propertiesLimit = 20

export default function Minting() {
  const wallet = useSelector(state => state.wallet.wallet)
  const [mintLoader, setMintLoader] = useState(false);
  const [imageLoader, setImageLoader] = useState([false,null]);
  const [mintTxHash, setMintTxHash] = useState()
  const [nftForms, setNftForms] = useState(
    [
      [
        {id: 0},
        {nftFile: ''},
        {image: ''},
        {src: ''},
        {name: ''},
        {collection: ''},
        {description: ''}
      ],
    ]
  )

  const uploadNFT= (event, id) => {
    setImageLoader([true,id])
    
    let _nftForms = [...nftForms]
    _nftForms[id][1].nftFile= ''
    _nftForms[id][2].image= ''
    _nftForms[id][3].src= ''
    setNftForms(_nftForms)
    
    
    if(isUndefined(event.target.files[0])){
      setImageLoader([false,id])
      return
    }

    const formData = new FormData();
    formData.append('file', event.target.files[0])

    uploadNft(formData)
    .then(resp => {
      _nftForms[id][1].nftFile = URL.createObjectURL(event.target.files[0])
      _nftForms[id][2].image = 'ipfs://' + resp.data.ipfs_hash
      _nftForms[id][3].src = 'ipfs://' + resp.data.ipfs_hash
      setNftForms(_nftForms)
      setImageLoader([false,id])
    })
    .catch(err => {
      toast.error(walletConstants.IMAGE_UPLOAD_ERROR)
      console.error(err)
      setImageLoader([false,id])
    })    
  }

  const onChangeForm = (e, id, index, property=false) => {
    const keyLabel = e.target.name
    const value = e.target.value
    let _nftForms = [...nftForms]

    if (property){
      delete Object.assign(_nftForms[id][index],{[value]: _nftForms[id][index][keyLabel]})[keyLabel]
    } else {
      _nftForms[id][index][keyLabel] = value
    }

    setNftForms(_nftForms)
  }

  const onAddProperty = (index) => {
    let _nftForms = [...nftForms]
    if (_nftForms[index].length > propertiesLimit + 6){
      toast.error(`Maximum of ${propertiesLimit} properties allowed`)
      return
    }
    _nftForms[index].push({"": ""})
    setNftForms(_nftForms)
  }

  const onDeleteProperty = (id, index) => {
    let _nftForms = [...nftForms]
    _nftForms[id].splice(index, 1)
    setNftForms(_nftForms)
  }

  const addNft = () => {
    if(nftForms.length > nftsLimit - 1){
      toast.error(`Maximum NFT limit of ${nftsLimit} reached`)
      return
    }

    let _nftForms = [...nftForms]
    const newId = _nftForms[_nftForms.length-1][0].id + 1
    _nftForms.push(
      [
        {id: newId},
        {nftFile: ''},
        {image: ''},
        {src: ''},
        {name: ''},
        {collection: ''},
        {description: ''},
      ]
    )
    setNftForms(_nftForms)
  }

  const handleMint = async () => {
    setMintTxHash(null)
    setMintLoader(true)

    if(!localStorage.getItem('wallet')){
      setMintLoader(false)
      toast.warn("Please connect a wallet")
      return
    }

    let partialMetaData = {}

    for (let i = 0; i < nftForms.length; i++){
      let assetdata ={}
      for (let j = 2; j < nftForms[i].length; j++){
        if((Object.values(nftForms[i][j])[0].length) === 0 || (Object.keys(nftForms[i][j]))[0].length === 0){
          setMintLoader(false)
          toast.error('Please fill all fields')
          return
        }else {
          Object.assign(assetdata,nftForms[i][j])
        }
      }
      if((Object.keys(partialMetaData)).includes(Object.values(nftForms[i][4])[0])){
        setMintLoader(false)
        toast.error("All Asset Names Must be Unique")
        return
      } else{
        Object.assign(partialMetaData, {[Object.values(nftForms[i][4])[0]]: assetdata})
      }
    }

    const txIterations = 10
    for (let i = 1; i <= txIterations; i++) {
      try {
        const txHash = await wallet.mintAsset(partialMetaData)
        setMintLoader(false)
        setMintTxHash(txHash)
        toast.success(walletConstants.SUCCEEDED)
        break
      }catch (error) {
        if (i === txIterations) {
          setMintLoader(false)
          toast.error(walletConstants.SOMETHING_WRONG);
          console.log(error);
        }else if (error.code) {
          setMintLoader(false)
          toast.error(walletConstants.TRANSACTION_DECLINED);
          console.log(error);
          break
        }
      }
    }
  } 

  const nftFormsCards = () => (nftForms.map((nftForm, index) => {
    return (
      <div className="row d-flex flex-row justify-content-center mt-2 mb-2" id={index} key={index}>
        <div className="col col-sm col-md-12 col-lg col-xl-8">
          <div className="card">
            <div className="card-body">
              <div className="row">
                <div className="col-sm col-md col-lg-4 col-xl-4 mb-2">
                  <div className="d-flex justify-content-center align-items-center mb-2">
                    {
                      nftForm[1].nftFile ?
                        <img src={nftForm[1].nftFile} className="nft-image img-fluid img-thumbnail rounded"/>:
                      (imageLoader[0] && imageLoader[1] === index) ?
                        <div className="d-flex justify-content-center align-items-center "><TailSpin color="#dc3545" height={100} width={100}/></div>:
                      <div className="nft-image d-flex align-items-center"><i className="bi bi-upload fs-1"></i></div>
                    }
                  </div>
                  <div className="d-flex justify-content-center">
                    <input
                      className="form-control"
                      type="file"
                      accept=".tif,.tiff,.bmp,.jpg,.jpeg,.gif,.png,.eps,.raw"
                      id="formFile"
                      onChange={event => uploadNFT(event, nftForm[0].id)}/>
                  </div>
                </div>
                <div className="col-sm col-md-12 col-lg-8 col-xl-8">
                  <form>
                    {nftForm.map((attribute, index) => {
                      if (index >= 4 && index < 7){
                        const attributeKey = Object.keys(attribute)[0]
                        const attributeValue = attribute[attributeKey]
                        return(
                          <div className="row mb-2" id={index} key={index}>
                            <div className="form-group">
                              <label>
                                {
                                  attributeKey === 'name' ? "Asset Name":
                                  attributeKey === 'collection' ? "Collection Name":
                                  attributeKey === 'description' ? "Description":
                                  attributeKey
                                }
                              </label>
                              {attributeKey === 'collection' ? (
                                <select
                                  name="collection"
                                  className="form-control"
                                  value={attributeValue}
                                  onChange={e => onChangeForm(e, nftForm[0].id, index)}
                                >
                                  <option value="">--Please select a collection--</option>
                                  <option value="games">Games</option>
                                  <option value="artwork">Artwork</option>
                                </select>
                              ):<input
                                type="text"
                                name={attributeKey}
                                className="form-control"
                                value={attributeValue}
                                onChange={e => onChangeForm(e, nftForm[0].id, index)}
                              />}
                            </div>
                          </div>
                        )
                      } else if (index >= 7 ){
                        const attributeKey = Object.keys(attribute)[0]
                        const attributeValue = attribute[attributeKey]
                        return(
                          <div className="row mb-2" id={index} key={index}>
                            <div className="col-sm-5 col-md-5 col-lg-5 col-xl-5">
                              <label>Property Name</label>
                              <input
                                type="text"
                                name={attributeKey}
                                className="form-control"
                                value={attributeKey}
                                onChange={e => onChangeForm(e, nftForm[0].id, index, true)}/>
                            </div>
                            <div className="col-sm-5 col-md-5 col-lg-5 col-xl-5">
                              <label>Property Description</label>
                              <input
                                type="text"
                                name={attributeKey}
                                className="form-control"
                                value={attributeValue}
                                onChange={e => onChangeForm(e, nftForm[0].id, index)}/>
                            </div>
                            <div className="col-sm-2 col-md-2 col-lg-2 col-xl-2 d-flex align-items-end">
                              <button
                                type="button"
                                className="btn btn-danger mt-4"
                                onClick={() => onDeleteProperty(nftForm[0].id, index)}>
                                  <i className="bi bi-trash-fill"></i>
                              </button>
                            </div>
                          </div>
                        )
                      }
                    })}
                    <div className="row mb-2">
                      <div className="col">
                        <button
                          type="button"
                          className="btn btn-danger mt-2"
                          onClick={() => onAddProperty(index)}>
                            <i className="bi bi-plus-lg"></i> Add Property
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }))

  return (
    <Fragment>
      <div className="section">
        <div className="container">
          <div className="row p-2">
            <div className="col-sm d-flex justify-content-start mt-2">
              <h5>Mint your NFTs</h5>
            </div>
            <div className="col-sm d-flex justify-content-end">
              <div className="btn-group">
                <button className="btn btn-danger" onClick={() => handleMint()}>
                  {mintLoader ? <TailSpin ariaLabel="mint-loader" color="#FFFFFF" height={26} width={26}/>: "Mint"}
                </button>
                <button
                  type="button"
                  className="btn btn-dark"
                  onClick={() => addNft()}>
                    <i className="bi bi-plus-lg"></i> Add NFT
                </button>
              </div>
            </div>
          </div>
          {
            mintTxHash ? (
              <div className="row p-2">
                <div className="col-sm d-flex justify-content-center">
                  <span className="badge bg-success d-inline-block text-truncate">
                    Transaction Hash:{mintTxHash}
                  </span>
                </div>
              </div>
            ): null
          }
          {nftFormsCards()}
        </div>
      </div>
      <Footer />
    </Fragment>
  )
}
