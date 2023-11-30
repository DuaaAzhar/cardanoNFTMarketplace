# frozen_string_literal: true

source 'https://rubygems.org'
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby '2.7.2'

gem 'actionpack', '>= 6.1.4.1'
# Reduces boot times through caching; required in config/boot.rb
gem 'bootsnap', '>= 1.4.4', require: false
# Bundle edge Rails instead: gem 'rails', github: 'rails/rails', branch: 'main'
gem 'dotenv-rails'
gem 'fast_jsonapi'
# Build JSON APIs with ease. Read more: https://github.com/rails/jbuilder
gem 'jbuilder', '~> 2.7'
gem 'mongoid', '~> 7.3.2'
# Use Puma as the app server
gem 'puma', '~> 5.0'
gem 'rails', '~> 6.1.3', '>= 6.1.3.2'
# Ruby static code linter
gem 'rubocop', '~> 1.25', require: false
# Use SCSS for stylesheets
gem 'sass-rails', '>= 6'
# Turbolinks makes navigating your web application faster. Read more: https://github.com/turbolinks/turbolinks
gem 'turbolinks', '~> 5'
# Transpile app-like JavaScript. Read more: https://github.com/rails/webpacker
# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem 'tzinfo-data', platforms: %i[mingw mswin x64_mingw jruby]
gem 'webpacker', '~> 5.0'

gem 'awesome_print', '~> 1.8'
# For Mongoid attachments
gem 'mongoid-paperclip'

# Ruby SDK for Blockfrost.io
gem 'blockfrost-ruby', '0.1.1'

group :development, :test do
  gem 'byebug', platforms: %i[mri mingw x64_mingw]
  gem 'pry', '~> 0.13.1'
end

group :development do
  # Automate deployments
  gem 'capistrano',                              require: false
  gem 'capistrano3-puma',                        require: false
  gem 'capistrano-bundler',                      require: false
  gem 'capistrano-local-precompile', '~> 1.2.0', require: false
  gem 'capistrano-nvm',                          require: false
  gem 'capistrano-rails',                        require: false
  gem 'capistrano-rvm',                          require: false

  gem 'listen', '~> 3.3'
  # Display performance information such as SQL time and flame graphs for each request in your browser.
  # Can be configured to work on production as well see: https://github.com/MiniProfiler/rack-mini-profiler/blob/master/README.md
  gem 'rack-mini-profiler', '~> 2.0'
  # Spring speeds up development by keeping your application running in the background. Read more: https://github.com/rails/spring
  gem 'spring'
  # Access an interactive console on exception pages or by calling 'console' anywhere in the code.
  gem 'web-console', '>= 4.1.0'
end

group :test do
  # Adds support for Capybara system testing and selenium driver
  gem 'capybara', '>= 3.26'
  gem 'selenium-webdriver'
  # Easy installation and use of web drivers to run system tests with browsers
  gem 'webdrivers'
end
