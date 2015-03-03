# IcoMoon

We currently use IcoMoon to generate new Font icons.

## Steps

- `Icomoon` <http://icomoon.io/>
- Select **"Import Icons"**
- Upload **bcc.json** from **/ui/fonts/icomoon**
- Choose an Icomoon icon or Upload your own SVG file
- Save your changes by choosing **"Menu > Download set"** and updating **bcc.json** in the repository.
- Select **"Font > (You may wish to rename your new fonts)"**
- Click **"Download"**
- Move fonts in **/fonts/** folder into **/ui/fonts/icomoon** folder
- Copy code from **style.css** into **/ui/scss/project/vendor/icomoon/icomoon.scss**
- Change path to /fonts/ for ie8 fallback
- Check everything is working locally then commit
