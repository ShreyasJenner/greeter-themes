# lightdm-greeter

A custom web-greeter theme for different greeters 

## Instructions for usage
- Copy the gamify folder over to /usr/share/web-greeter/themes/
- Set the theme to gamify in /etc/lightdm/web-greeter.toml 

## Lightdm 
- The repo implements four different themes
- The themes are not randomly called
- They are called based on the module of the current date by the total number of themes

### Lightdm Theme List
- Lain
- Ender Lilies
- Hollow Knight
- Hollow Knight: Silksong


## Recent Qt5 EOL Issue Fix
Ever since the Qt5 EOL and qt5-webengine deprecation, I wasn't able to use web-greeter. I only got started on fixing the issues I had 
once web-greeter was ported over to pyside6.

My previous greeter files used mp4 files without much issue. However, the qt webengine only suports mp4 files if the required 
proprietary audio and video codecs have been enabled (src: https://doc.qt.io/qt-6/qtwebengine-features.html#audio-and-video-codecs)

I wasn't able to get that to work so I just shifted to using webm files instead. They also have the added advantage of being much 
smaller in size that the mp4 (37M vs 889K)

Current code changes only include shifting over all the files to webm. The lily.js files have been modified to delete the 
rain drop animation as they were no longer in use

The lightdm folder has been renamed to gamify
