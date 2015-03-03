# Bristol City Council Boilerplate

Static, production quality source code for the HTML prototype for the Bristol City Council Customer & Process Programme.

Note: Compiled HTML and CSS for this prototype – ready for integration into Liferay – lives in the separate liferay-frontend-delivery-portal repository.


## Prerequisites
You must have the following installed. Install to the latest version unless specified otherwise. Visit individual sites for installation instructions.

- `Mixture` <http://mixture.io/>
-- Download and install Mixture (in trial mode)
-- Create new Mixture account via app
-- Log in to acc/Users/digirati/Dropbox/Sites/BCC/ui/scss/README.mdount via website <https://accounts.mixture.io/>
-- Request an access code from Stu <stu.charlton@cxpartners.co.uk> to redeem your 'seat'

- If using Sublime, consider installing the Mixture liquid package <https://github.com/teammixture/mixture-liquid-syntax-sublime>

## Installation
These instructions should be followed before loading up the site locally.

- Clone the main repo <ssh://git@scm.bristol.gov.uk:7999/lif/liferay-frontend-source-portal.git>
- Run Mixture app and open cloned project
- Click 'view locally' in Mixture to view site

## Documentation
Various documentation and resources for frameworks, apps, etc.

- `Using Mixture` <http://docs.mixture.io>
- `Liquid syntax` <https://github.com/Shopify/liquid/wiki> & <https://github.com/teammixture/mixture-liquid-syntax-sublime/tree/master/Snippets>
- `Mixture tips` <http://tips.neil.mixture.io/>
– Add /index when viewing pages locally

## Development Process
Good rules of thumb and how to work with the files during development.

- Tab spacing. Use **2 spaces** for everything.
- Use TODO for inline comments re small tasks followed by @nickname, e.g. "@TODO: Add some sparkle - @iamkeir"
- Try to avoid using {% block %} replacement but rather use variables to better mimic LifeRay's component structure (TBC)

