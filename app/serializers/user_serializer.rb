# frozen_string_literal: true

# Serializer for users
class UserSerializer
  include FastJsonapi::ObjectSerializer

  attributes :name, :wallet_addresses, :avatar

  attribute :id do |object|
    object._id.to_str
  end
end
