# CDN
- in order to share assets between web apps
## Setup
- clone this repo outside of other django projects
- then symlink proj to base/ inside of django projects i.e. `ln -s ~/Basis/cdn ~/Basis/bpersonnel/static` on MacOS
- ensure symlink is in .gitignore as `static` (seen as a file by git, not a directory)
NOTE: make sure to use absolute paths when creating symlinks
## Deployment Notes
- once changes have been pushed to the repo it will take a couple of seconds for jsdelivr to sync the repo to their CDN
## Misc
- if you want to serve from a github branch, link as `http://cdn.jsdelivr.net/gh/Basis-ed/cdn@develop/.../asset.png`
- feel free to add .min to automatically minify file for faster serving! i.e. bootstrap.min.js or bootstrap.min.css
- if you want to serve multiple files at the same time use `http://cdn.jsdelivr.net/gh/Basis-ed/cdn/tagify.min.css,gh/Basis-ed/cdn/tagify.min.js` comma separated pattern
