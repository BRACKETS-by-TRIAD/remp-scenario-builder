export default class SegmenterService {
  static load() {
    // maybe add async defer if needed
    const vueScript = document.createElement('script');
    vueScript.type = 'text/javascript';
    vueScript.src = '/segmenter/vue.min.js';

    const segmenterScript = document.createElement('script');
    segmenterScript.type = 'text/javascript';
    segmenterScript.src = '/segmenter/RempSegmenter.umd.min.js';

    var segmenterStyles = document.createElement('link');
    segmenterStyles.rel = 'stylesheet';
    segmenterStyles.href = '/segmenter/RempSegmenter.css';

    document.head.appendChild(vueScript);
    document.head.appendChild(segmenterScript);
    document.head.appendChild(segmenterStyles);
  }

  static init(selector = '#segmenter') {
    new window.Vue({
      render: h => h(window.RempSegmenter)
    }).$mount(selector);
  }
}
