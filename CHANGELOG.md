# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2020-03-10

### Added

- URL Productiva: https://thirsty-poitras-e6224f.netlify.com/

- Get video from the browser with navigator.mediaDevices.getUserMedia method.
  Official documentation: https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia

- Recording video with library external recordRTC
  Official documentation: https://recordrtc.org/

- Save and get Local Storage information
  Official documentation localStorage: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage

- Integration with external Giphy API
  Giphy developers: https://developers.giphy.com/
  API Key: H792sTUZHOEEmYy2LogPu1UXAbBOByJW

The following endpoints are consumed:

Search gif by search criteria
http://api.giphy.com/v1/gifs/search?q=
Get the gifs trends
https://api.giphy.com/v1/gifs/trending
Upload a gif to giphy
http://upload.giphy.com/v1/gifs
Get gifs by id
https://api.giphy.com/v1/gifs?ids=
