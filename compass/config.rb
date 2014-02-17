project_path =File.expand_path("..",File.dirname(__FILE__))

# Require any additional compass plugins here.
# -----------------------------------------------------------------------------



# Set this to the root of your project when deployed:
# -----------------------------------------------------------------------------

http_path = "/"
css_dir = "ui/css"
sass_dir = "ui/scss"
images_dir = "ui/img"
javascripts_dir = "ui/js"
fonts_dir = "ui/fonts"




# Output style and comments
# -----------------------------------------------------------------------------

# You can select your preferred output style here (can be overridden via the command line):

# output_style = :expanded or :nested or :compact or :compressed
# Over-ride with force compile to change output style with: compass compile --output-style compressed --force
output_style = :expanded


# Remove SASS/Compass relative comments.
line_comments = true



# SASS core
# -----------------------------------------------------------------------------

# Chrome needs a precision of 7 to round properly
Sass::Script::Number.precision = 7

# To enable relative paths to assets via compass helper functions. Uncomment:
relative_assets = true