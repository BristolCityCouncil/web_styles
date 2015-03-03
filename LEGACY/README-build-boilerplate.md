# Boilerplate Build

This readme outlines how to take the current CPP repo and build the boilerplate fromm it.  This is a temporary system that
 is intended to be used up until the point at which we can use the boilerplate as the basis for the CPP project.

## Install Tools

### Install NodeJS

Go to [http://nodejs.org/download/](http://nodejs.org/download/) and install the NodeJS package appropriate to your
platform.

### Install Grunt

(showing Mac Installation from here onwards).

    $ npm install -g grunt-cli

### Install Grunt Dependencies

    $ npm install

## Run the Grunt Boilerplate Build Task

    $ grunt --gruntfile Gruntfile-build-boilerplate.js
   
After the Grunt task has completed with no errors, the folder ```./boilerplate``` will contain the code ready for release
to the *web_styles* repo.

This step is a manual task, i.e. the boilerplate code will need to be dropped into a clone of the repo, then commited
and pushed to the web_styles repo.
