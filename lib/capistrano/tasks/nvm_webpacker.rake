# frozen_string_literal: true

# Task for nvm to work on the server
namespace :nvm do
  namespace :webpacker do
    task validate: [:'nvm:map_bins'] do
      on release_roles(fetch(:nvm_roles)) do
        execute 'nvm use v16.9.1 && nvm alias default v16.9.1'
        unless test('node', '--version')
          warn 'node is not installed'
          exit 1
        end

        unless test('yarn', '--version')
          warn 'yarn is not installed'
          exit 1
        end
      end
    end

    after 'nvm:validate', 'nvm:webpacker:validate'
  end
end
