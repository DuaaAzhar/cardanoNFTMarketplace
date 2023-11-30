# frozen_string_literal: true

# Helper methods for nft collections controller
module NftCollectionConcern
  extend ActiveSupport::Concern

  def filter_asset_ids(assets, asset_ids)
    plucked_assets = assets.map(&:asset)
    asset_ids - plucked_assets
  end

  def store_assets_in_db(assets)
    errors = []
    assets.each do |asset|
      marketplace_collection = MarketplaceCollection.find_by({ policy_id: asset[:policy_id] })
      marketplace_collection = MarketplaceCollection.create(policy_id: asset[:policy_id]) if marketplace_collection.blank?
      collection = marketplace_collection.nft_collections.create(asset)
      errors.push(collection.errors.full_messages) if collection.errors.present?
    end

    errors
  end
end
