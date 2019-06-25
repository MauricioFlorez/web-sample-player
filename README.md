# Alexa Multi-Modal Web Player Reference Implementation

This project contains a sample implementation of a web player used to deliver a multi-modal video experience on an Alexa enabled screen. This includes initiation of video content, basic playback controls, and integration with Alexa Video JavaScript Library.


**Setup**

The following steps assumes you have Node.js and npm running on your system.


```
$ npm install -g gulp http-server
```


```
$ npm install
$ gulp
$ http-server -p 8080
```

Now open http://localhost:8080/browser.html to test in a web browser. This includes a shim for the device components on which the Alexa JavaScript library takes a dependency.

To test on a multi-modal device, use `index.html`.


To try different videos in your web browser, update the `forcePlaybackParameters` object in browser.html.
