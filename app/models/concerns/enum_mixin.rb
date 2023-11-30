# frozen_string_literal: true

# Parent module for enum mixin
module EnumMixin
  extend ActiveSupport::Concern

  # Workaround module for defining enums in mongodb
  module ClassMethods
    def enums_for(enums_hash, validate: true, prefix: '', suffix: '', define_instance_methods: true, define_class_methods: true)
      enums_hash.each do |name, values|
        enum_hash = HashWithIndifferentAccess.new
        values.each do |value|
          method_name = "#{prefix}#{value}#{suffix}"
          send(:define_method, "#{method_name}?") { send(name) == value } if define_instance_methods
          send(:define_method, "#{method_name}!") { update_attribute(name, value) } if define_instance_methods
          singleton_class.send(:define_method, method_name) { where(name => value) } if define_class_methods
          enum_hash[value] = value
        end

        send(:define_method, name.to_s.pluralize) { values } if define_instance_methods
        singleton_class.send(:define_method, name.to_s.pluralize) { enum_hash } if define_class_methods
        send(:validates, name, inclusion: values) if validate
      end
    end
  end
end
