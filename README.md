# Bristol City Council Boilerplate

Static, production quality source code for HTML prototypes for the Bristol City Council services.


## Prerequisites
This library uses the liquid templating engine [https://github.com/teammixture/mixture-liquid-syntax-sublime](https://github.com/teammixture/mixture-liquid-syntax-sublime).  As such, you need to use either Grunt or Mixture to compile the templates:

### Grunt

#### Install NodeJS
Go to [http://nodejs.org/download/](http://nodejs.org/download/) and install the NodeJS package appropriate to your
platform.

#### Install Grunt
(showing Mac Installation from here onwards).
    
    $ npm install -g grunt-cli

#### Install Grunt Dependencies
    $ npm install

### Mixture

See [http://mixture.io/](http://mixture.io/).

- Download and install Mixture (in trial mode).
- Create new Mixture account via app.
- If using Sublime, consider installing the Mixture liquid package.

## Building the Project

### Using Grunt

#### Development

Run the Grunt Boilerplate `build` task.
    
    $ grunt build

This will output all rendered templates to `./converted-html`.

#### Production

The production task will minify and concatenate the CSS and JS. It is reliant om the `build` task, so this needs to be run
before this task:
    
    $ grunt build build:prod

This will output all rendered templates, minified and concatenated JS and CSS to `./converted-html-prod`.

### Using Mixture

- Clone the main repo.
- Run Mixture app and open cloned project
- Click 'view locally' in Mixture to view site


## Documentation
Various documentation and resources for frameworks, apps, etc.

- Using Mixture [http://docs.mixture.io](http://docs.mixture.io).
- Liquid syntax [https://github.com/Shopify/liquid/wiki](https://github.com/Shopify/liquid/wiki) &
[https://github.com/teammixture/mixture-liquid-syntax-sublime/tree/master/Snippets](https://github.com/teammixture/mixture-liquid-syntax-sublime/tree/master/Snippets).
- Mixture tips [http://tips.neil.mixture.io](http://tips.neil.mixture.io).





