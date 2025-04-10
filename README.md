# Image Converter App

This app is built by electron web app. (Chromium).
Feel free to use.

Io get the app, follow the installation below. 
I only tested the code on Windows, and might not work correctly on other platforms. **Use at your own discretion**.

## Installation
### Download the Source Code
Download the source code as a ZIP file. You must have `Node.js >= 18` to continue to the next step.

Or if you want to use git:
```
git clone https://github.com/socutewhitebear/image-converter-app.git
```

### Install Packages
Via NPM
```
npm install
```

### Build the App
    
See [@electron/packager](https://github.com/electron/packager?tab=readme-ov-file#electronpackager) for more details.
```
npx @electron/packager . ImageConverter --platform=<platform> --arch=<arch> --out=dist --overwrite
```
This will build the app and output it at the `dist` folder.

### Finish
You now have your own Image Converter app!