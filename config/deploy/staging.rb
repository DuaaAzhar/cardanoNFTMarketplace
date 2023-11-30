# frozen_string_literal: true

set :stage, :staging
set :rails_env, :production
set :deploy_via, :remote_cache
set :deploy_to, "/home/demouser/staging/#{fetch(:application)}"
set :rvm_ruby_version, '2.7.2'
set :branch, 'develop'

server '45.55.37.74', user: 'root', pty: false, roles: %w[web app]
