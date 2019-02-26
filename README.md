## Install guide

1. Run `npm install`
2. Be sure to have scenario config filled in a global scope. It should look like this:

```js
window.Segments = {
  config: {
    AUTH_TOKEN: '',
    API_HOST: '',
    CANCEL_PATH: '',
    SEGMENT_ID: null
  }
};
```

3. `npm run start` for development

## Build guide

1. Run `npm run build` if you want to build whole application for the deployment. Then you can host contents of `/build` folder as static files.

## remp-segment-builder implementation

Remp-segment-builder package is implemented by default, just be sure to have segment config filled in a global scope. It should look like this:

```js
window.Segments = {
  config: {
    AUTH_TOKEN: '',
    API_HOST: '',
    CANCEL_PATH: '#',
    SEGMENT_ID: null
  }
};
```

Here are some implementation details for future reference:

- Source files of remp-segment-builder and vue need to be present in `/public/segmenter` folder.
- There is a npm script `npm run copy:segmenter` for convenience prepared, which will copy them from node_modules.
- During application bootstrap `SegmenterService.load()` is called to append script/link tags of remp-segment-builder with vue to the html document.
  This is to avoid making complicated custom webpack config file to compile both react and vue.
- In `src/components/elements/Segment/NodeWidget.js` upon clicking on New Segment button, `SegmenterService.init()` is called to bootstrap remp-segment-builder application. Then we listen for dispatched custom event called `savedSegment` from remp-segment-builder. If `window.Segments.config.CANCEL_PATH` is set to url, then upon clicking cancel in remp-segment-builder, user will be redirected there. If it is set to `#`, remp-segment-builder will be closed, and user can continue in remp-scenario-builder. This is suggested for this usecase.
