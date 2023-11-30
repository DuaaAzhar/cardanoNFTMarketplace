# frozen_string_literal: true

# User class model
class User
  include Mongoid::Document
  include Mongoid::Timestamps
  include Mongoid::Paperclip

  field :name, type: String
  field :wallet_addresses, type: Object

  has_many :nft_collections
  has_mongoid_attached_file :avatar, disable_fingerprint: true, default_url: 'missing.png'

  validates :wallet_addresses, presence: true
  validates_attachment_content_type :avatar, content_type: ['image/jpg', 'image/jpeg', 'image/png', 'image/gif']

  after_initialize :init

  private

  def init
    self.name ||= 'Unamed'
  end
end
