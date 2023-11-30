# frozen_string_literal: true

module Api
  module V1
    # Base controller for APIs
    class BaseController < ApplicationController
      def plural_name
        self.class.to_s.split('::').last.split('Controller').first.singularize
      end

      def serializer_class
        "#{plural_name}Serializer".constantize
      end
    end
  end
end
