# frozen_string_literal: true

module Api
  module V1
    # Controller for marketplace collections
    class MarketplaceCollectionsController < BaseController
      before_action :set_marketplace_collection, only: %i[nfts]

      def index
        # TODO: Apply pagination
        collections = MarketplaceCollection.includes(:nft_collections).all

        render json: serializer_class.new(collections).serialized_json, status: 200
      end

      def nfts
        # TODO: Apply pagination
        render json:  NftCollectionSerializer.new(@collection.nft_collections).serialized_json, status: 200
      end

      private

      def set_marketplace_collection
        @collection = MarketplaceCollection.find(BSON::ObjectId(params[:id]))
      end
    end
  end
end
