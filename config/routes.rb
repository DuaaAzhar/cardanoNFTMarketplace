# frozen_string_literal: true

Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :marketplace_collections, only: %i[index] do
        member do
          get :nfts
        end
      end

      resources :users, only: %i[index create update destroy show] do
        collection do
          get 'user_by_wallet/:wallet_address', to: 'users#user_by_wallet'
        end
      end

      resources :nft_collections, only: %i[index show] do
        collection do
          get :nfts_by_asset_id
          post :upload_nft
        end

        member do
          get :nfts_for_sale
          put :list_nft
          put :unlist_nft
        end
      end
    end
  end

  get '*path', to: 'pages#index', via: :all
  root 'pages#index'
end
