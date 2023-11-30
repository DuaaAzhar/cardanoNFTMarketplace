# frozen_string_literal: true

require 'blockfrost-ruby'

module NftCollections
  # Service to get nfts from cardano blockchain through blockfrost api
  class NftBlockfrostService
    def initialize(*)
      @api_key = Rails.application.credentials.blockfrost[:api_key]
      @ipfs_key = Rails.application.credentials.blockfrost[:ipfs_key]
      @network_id = Rails.application.credentials.blockfrost[:network_id] || 0
      @blockfrost = @network_id == 1 ? Blockfrostruby::CardanoMainNet.new(@api_key) : Blockfrostruby::CardanoPreprod.new(@api_key)
      #TODO : NEED TO Handle here by checks
      # blockfrost_preview = Blockfrostruby::CardanoPreview.new('your-API-key')
      # blockfrost_preprod = Blockfrostruby::CardanoPreprod.new('your-API-key')
      @ipfs = Blockfrostruby::IPFS.new(@ipfs_key)
    end

    def fetch_assets(asset_ids = [])
      asset_ids.map { |id| @blockfrost.get_specific_asset(id)[:body] }
    end

    def fetch_all_assets(params = {})
      @blockfrost.get_assets(params)[:body]
    end

    def upload_asset(asset_path)
      file = @ipfs.add_a_file(asset_path)
      @ipfs.pin_an_object(file[:body][:ipfs_hash])
    end
  end
end
