# frozen_string_literal: true

# Marketplace collection class model
class MarketplaceCollection
  include Mongoid::Document
  include Mongoid::Timestamps
  include Mongoid::Paperclip

  field :name, type: String
  field :policy_id, type: String
  field :authors, type: String

  has_many :nft_collections
  has_mongoid_attached_file :logo, disable_fingerprint: true, default_url: 'missing.png'

  validates_attachment_content_type :logo, content_type: ['image/jpg', 'image/jpeg', 'image/png', 'image/gif']

  index({ policy_id: 1 }, { unique: true })

  after_initialize :init

  private

  def init
    self.name ||= 'Unamed'
    self.authors ||= 'Unamed'
  end
end
