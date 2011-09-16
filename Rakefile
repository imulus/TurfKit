#!/usr/bin/env rake

require 'rubygems'
require 'coyote'
require 'yaml'

config  = YAML.load(File.open(File.expand_path(File.dirname(__FILE__) + "/config/config.yaml")))
@js     = config['js'] 

desc "Compile both Sass and JavaScript source files"
task :build => ['js:build']

namespace :js do
  config = Coyote::Configuration.new
  config.inputs = @js['input']
  config.output = @js['output']
  config.options['compress'] = @js['compress']
  config.options['verbose'] = @js['verbose']

  desc "Compile JavaScript and CoffeeScript from source"
  task :build do
    Coyote::build config
  end

  desc "Watch JS/CS source files for changes and recompile automatically"
  task :watch do
    Coyote::watch config
  end
end
