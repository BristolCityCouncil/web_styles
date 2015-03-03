# Boilerplate Style Guide

This README aims to bring developers up to speed with the structure and workflow of the site styling. Please note: it is a work-in-progress, evolving document.

# Structure

## Core

The aim of 'Core' is to help with new projects.

Avoid modifying core files if you can but, if you do, append '-mod' to filenames and/or consider submitting modifications to the repo:

 - Normalize / reset
 - Helper classes
 - Basic print styles
 - Skiplinks
 - Typographical mixins
 
### Vendor

Files living in this directory are from third party sources and shouldn't be edited.

## Project

The SASS structure consists of 'core' and 'project' folders:

You shouldn't need to edit the CSS in this directory on a per-project basis.

Includes @imports for any required components from the pattern library

# Rules & Guidelies

## Rules
- Only include the files from Core that you need
- Use Sass SCSS syntax (http://sass-lang.com)
- Take advantage of Compass for common mixins (http://compass-style.org/)
- Use classes over ID/element selectors where possible
- Avoid deep nesting (3 levels max, if possible)

## Guidelines
- Favour BEM for class naming conventions (http://bem.info/)
- Keep code lean and DRY (http://en.wikipedia.org/wiki/Don't_repeat_yourself)
- Be generous with commenting
- Further Sass/SCSS code guidance: http://css-tricks.com/sass-style-guide/
- No dogma: common sense and pragmatism over strict rules

### Commenting

Comment your SASS with these helpers.
@TODO: Need discussion as we have many options

    /* ======================================================
     MAJOR SECTION
     ======================================================*/

    /* ------------------------------
     * Minor section
     */

    /**
     * Explanation
     */

    /* @TODO: Flag for attention
    */

    // Inline comments which do not appear in output CSS file