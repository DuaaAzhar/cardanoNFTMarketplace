import wallet from './wallet'

export default class EternlApi extends wallet {
  constructor(serializationLib, cardano, apiKey) {
    super(serializationLib, cardano, apiKey)
  }
}

