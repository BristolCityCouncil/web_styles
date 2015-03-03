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

## Developer Workflow

We are following a [Gitflow development](http://nvie.com/posts/a-successful-git-branching-model/) process.

It is suggested that the above link is read in full as it is beyond the scope of this readme to explain the details of workflow.

### Git Workflow

#### 1. Starting

When you begin work, create a new feature branch to work on:

```
$ git checkout -b feature/GDP-1
```
which is effectively runs the following two commands:

```
$ git branch feature/GDP-1
$ git checkout feature/GDP-1
```

push the new branch to origin so that other people in the team have access to it if required:

```
$ git push -u origin feature/GDP-1
```
The `-u` sets up tracking for you


#### 2. Development

Work from this branch, committing regularly.  

```
$ git add *
$ git commit -m "your message"
$ git push
```

#### 3. Development Code Complete

When you are happy that the work is complete:

- login into Stash,
- navigate to the *liferay-frontend-source-portal* repo,
- click the 'pull request' button,
- select the correct source and destination branches and repositories, remembmering that we are merging into the *develop* branch on the origin,
- add a title and description,
- click 'Create pull request'.

This will create a pull request.

#### Deleting a branch

In the process of a creating a pull request, your branch should be deleted.

If it doesn't:


```
$ git branch -D feature/GDP-1
$ git push origin --delete feature/GDP-1
```

### Notes:

- In the process of development, developers should pull the develop branch into their current feature branch at least once a day.
- Feature branches should be short lived.  They shouldn't really exist more than a couple of days.

