# frozen_string_literal: true

module Api
  module V1
    # Controller for users
    class UsersController < BaseController
      before_action :set_user, except: %i[index create user_by_wallet]

      def index
        users = User.all

        render json: serializer_class.new(users).serialized_json
      end

      def create
        user = User.create(permit_user)

        return render json: { errors: user.errors.full_messages, success: false }, status: 422 if user.errors.present?

        render json: { user: user, message: I18n.t('users.created'), success: true }, status: 200
      end

      def update
        user = @user.update(permit_user)

        return render json: { errors: @user.errors.full_messages, success: false }, status: 422 unless user

        render json: { message: I18n.t('users.updated'), success: true }, status: 200
      end

      def show
        render json: serializer_class.new(@user).serialized_json
      end

      def destroy
        user = @user.destroy

        return render json: { errors: I18n.t('errors.unprocessable'), success: false }, status: 422 unless user

        render json: { message: I18n.t('users.destroyed'), success: true }, status: 200
      end

      def user_by_wallet
        user = User.find_by({ "wallet_addresses.#{params[:wallet_name]}": params[:wallet_address] })

        render json: serializer_class.new(user).serialized_json
      rescue Mongoid::Errors::DocumentNotFound => e
        render json: { errors: e.problem, success: false }, status: 404
      end

      private

      def permit_user
        params.require(:users).permit(:id, :name, wallet_addresses: %i[nami eternl flint])
      end

      def set_user
        @user = User.find(params[:id])
      rescue Mongoid::Errors::DocumentNotFound => e
        render json: { errors: e.problem, success: false }, status: 404
      end
    end
  end
end
