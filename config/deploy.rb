# frozen_string_literal: true

lock '~> 3.16.0'

set :application,             'cardano-marketplace-nft'
set :repo_url,                'git@bitbucket.org:eritheialabs/cardano-marketplace-nft.git'
set :user,                    'root'

set :rvm_ruby_version, '2.7.2'
set :rvm_type, :user
set :rvm_custom_path, '/usr/local/rvm'

set :puma_threads,            [4, 16]
set :puma_workers,            0
set :pty,                     true
set :use_sudo,                false
set :nvm_type,                :user
set :nvm_node,                'v16.9.1'
set :nvm_map_bins,            %w[node npm yarn]
set :puma_bind,               "unix://#{shared_path}/tmp/sockets/puma.sock"
set :puma_state,              "#{shared_path}/tmp/pids/puma.state"
set :puma_pid,                "#{shared_path}/tmp/pids/puma.pid"
set :puma_access_log,         "#{release_path}/log/puma.access.log"
set :puma_error_log,          "#{release_path}/log/puma.error.log"
set :puma_preload_app,        true
set :puma_worker_timeout,     nil
set :puma_init_active_record, false
set :keep_releases,           3

append :linked_files, 'config/master.key', 'config/mongoid.yml'
append :linked_dirs,  'log', 'tmp/pids', 'tmp/cache', 'tmp/sockets', 'public/uploads'

# RUN YARN INSTALL BEFORE PRECOMPILE TO AVOID STUCK
before 'deploy:assets:precompile', 'deploy:dependencies:yarn_install'

namespace :deploy do
  namespace :check do
    desc 'check: copy config/master.key and config/mongoid.yml to shared/config'
    before :linked_files, :set_configs do
      on roles(:app), in: :sequence, wait: 10 do
        unless test("[ -f #{shared_path}/config/master.key ]")
          upload! 'config/master.key', "#{shared_path}/config/master.key"
        end
        unless test("[ -f #{shared_path}/config/mongoid.yml ]")
          upload! 'config/mongoid.yml', "#{shared_path}/config/mongoid.yml"
        end
      end
    end
  end

  namespace :dependencies do
    desc 'Run rake yarn:install'
    task :yarn_install do
      on roles(:web) do
        within release_path do
          execute("cd #{release_path} && yarn install")
        end
      end
    end
  end
end
