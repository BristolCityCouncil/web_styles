# Getting started

### Requirements

The requirements for running the Frontend SDK are

*   PHP 5.5+ (Tested with 5.6 - [Visit Site](http://php.net/manual/en/install.php))
*   Composer Package manager ([Visit Website](https://getcomposer.org/download/))

### Developer Requirements

*   PHP CLI ([Windows CLI](http://php.net/manual/en/install.windows.commandline.php))
*   NodeJS ([Visit Website](http://nodejs.org/download/))
*   Grunt CLI ([Visit Website](http://gruntjs.com/installing-grunt))
*   Ruby ([Visit Website](https://www.ruby-lang.org/en/documentation/installation/))
*   Compass 0.12.7 ([Visit Website](https://rubygems.org/gems/compass/versions/0.12.7))

NOTE: To install compass 0.12.7 you must first uninstall any previous version.

    $ gem uninstall compass

And then...

    $ gem install compass -v 0.12.7
    
# Installation

### Repository

To get started using the Bristol Frontend SDK, head to [our GitHub](https://github.com/BristolCityCouncil) and clone our repository "Bristol Frontend SDK" into your workspace.

    $ git clone https://github.com/BristolCityCouncil/web_styles.git .

* * *

### Dependencies

Our framework requires a few dependencies to run.

#### Composer

From the command line, run composer to install dependencies.

	$ composer install

or if you do not have composer in the /usr/bin

	$  php composer.phar install

#### Task runner (development only)

If you wish to edit and add code to the library, you will have to install the development dependencies.

	$ npm install

Note: you may need to add sudo before the command on linux systems.

To ensure everything was installed correctly, you can run

	$ grunt 

From your project folder. Hit "cmd+c", or "ctrl+c" on windows, to exit grunt.
