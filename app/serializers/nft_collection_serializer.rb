# frozen_string_literal: true

# Serializer for nft collections
class NftCollectionSerializer
  include FastJsonapi::ObjectSerializer

  attributes  :asset, :policy_id, :asset_name, :fingerprint, :quantity, :onchain_metadata, :initial_mint_tx_hash,
              :mint_or_burn_count, :metadata, :marketplace_collection_id, :transaction, :status, :updated_at,
              :created_at

  attribute :id do |object|
    object._id.to_str
  end
end
