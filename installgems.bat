@ECHO *** Installing Rake
@call gem install rake --include-dependencies

@ECHO *** Installing RubyZip
@call gem install rubyzip --include-dependencies

@ECHO *** Installing juicer
@call gem install juicer --include-dependencies

@call juicer install yui_compressor

@call juicer install jslint