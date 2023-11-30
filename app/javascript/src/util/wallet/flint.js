import wallet from './wallet'

export default class FlintApi extends wallet {
  constructor(serializationLib, cardano, apiKey) {
    super(serializationLib, cardano, apiKey)
  }
}

