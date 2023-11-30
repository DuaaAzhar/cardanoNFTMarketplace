# frozen_string_literal: true

module Api
  module V1
    # Controller for nft collections
    class NftCollectionsController < BaseController
      include NftCollectionConcern

      before_action :set_nft, only: %i[show list_nft unlist_nft]

      def index
        nft_collections = NftCollection.listed
        filtering_params(params).each do |key, value|
          nft_collections = nft_collections.public_send("filter_by_#{key}", value) if value.present?
        end

        render json: serializer_class.new(nft_collections).serialized_json
      end

      def show
        render json: serializer_class.new(@nft_collection).serialized_json
      end

      def list_nft
        @nft_collection.transaction << permit_transaction_params
        @nft_collection.status = NftCollection.statuses[:listed]
        if @nft_collection.save
          render json: serializer_class.new(@nft_collection).serialized_json
        else
          render json: { errors: @nft_collection.errors.full_messages }
        end
      end

      def unlist_nft
        if @nft_collection.not_listed!
          render json: serializer_class.new(@nft_collection).serialized_json
        else
          render json: { errors: @nft_collection.errors.full_messages }
        end
      end

      def nfts_by_asset_id
        asset_ids = params[:asset_ids]
        assets = NftCollection.where({ asset: { '$in': asset_ids } })
        return render json: { assets: assets, errors: [] }, status: 200 if assets.count == params[:asset_ids].count

        asset_ids_to_fetch = filter_asset_ids(assets, asset_ids)
        new_assets = NftCollections::NftBlockfrostService.new.fetch_assets(asset_ids_to_fetch)
        resp = store_assets_in_db(new_assets)

        render json: { assets: assets + new_assets, errors: resp }, status: 200
      end

      def nfts_for_sale
        nft_collections = NftCollection.collection.aggregate([
          { '$match': { status: NftCollection.statuses[:listed] } },
          { '$project': { transaction: { '$arrayElemAt': ['$transaction', -1] } } }
        ]).map { |collection| collection['_id'] if collection['transaction']['wallet_address'] == params[:id] }.reject(&:blank?)

        nft_collections = NftCollection.where({ '_id': { '$in': nft_collections } })

        render json: serializer_class.new(nft_collections).serialized_json
      end

      def upload_nft
        return render json: I18n.t('nft_collections.empty_nft'), status: 400 if empty_file?

        response = NftCollections::NftBlockfrostService.new.upload_asset(params[:file].to_path)

        render json: response[:body], status: response[:status]
      end

      private

      def set_nft
        @nft_collection = NftCollection.find_by({ asset: params[:id] })
      end

      def permit_transaction_params
        params.require(:transaction).permit(:txId, :price, :wallet_address).to_h
      end

      def filtering_params(params)
        params.slice(:policy_id)
      end

      def empty_file?
        params[:file].blank? || params[:file] == 'undefined'
      end
    end
  end
end
