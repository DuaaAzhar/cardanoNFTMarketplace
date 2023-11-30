# frozen_string_literal: true

# NFT collection class model
class NftCollection
  include Mongoid::Document
  include Mongoid::Timestamps
  include EnumMixin
  include Mongoid::Attributes::Dynamic

  field :asset, type: String
  field :policy_id, type: String
  field :asset_name, type: String
  field :fingerprint, type: String
  field :quantity, type: String
  field :initial_mint_tx_hash, type: String
  field :mint_or_burn_count, type: Integer
  field :onchain_metadata, type: Object
  field :metadata, type: Object
  field :marketplace_collection_id, type: BSON::ObjectId
  field :transaction, type: Array
  field :status, type: String

  enums_for({ status: %w[listed not_listed] })

  validates_presence_of :marketplace_collection, on: :create

  belongs_to :marketplace_collection

  index({ asset: 1 }, { unique: true })

  after_initialize :init

  scope :listed,      -> { where(status: NftCollection.statuses[:listed]) }
  scope :not_listed,  -> { where(status: NftCollection.statuses[:not_listed]) }
  scope :filter_by_policy_id, ->(policy_id) { where({ policy_id: policy_id }) }

  private

  def init
    self.transaction ||= []
    self.status ||= NftCollection.statuses[:not_listed]
  end
end
