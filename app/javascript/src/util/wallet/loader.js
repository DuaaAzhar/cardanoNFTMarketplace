class Loader {
  async load() {
    if(this._wasm) return;

    /**
    * @private
    **/
    this._wasm = await import("@emurgo/cardano-serialization-lib-browser/cardano_serialization_lib")
  }

  get CardanoSerializer() {
    return this._wasm;
  }
}

export default new Loader();
