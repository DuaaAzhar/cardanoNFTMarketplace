# frozen_string_literal: true

# Serializer for marketplace collections
class MarketplaceCollectionSerializer < BaseSerializer
  include FastJsonapi::ObjectSerializer

  attributes :name, :policy_id, :logo, :authors, :nft_collections

  attribute :id do |object|
    object._id.to_str
  end
end
