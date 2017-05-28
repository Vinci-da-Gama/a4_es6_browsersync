'use strict';

(function (appName) {
    var platformBrowserDynamic = ng.platformBrowserDynamic.platformBrowserDynamic;
    var AppModule = appName.AppModule;

    platformBrowserDynamic().bootstrapModule(AppModule);

})(window.appName || (window.appName = {}));
