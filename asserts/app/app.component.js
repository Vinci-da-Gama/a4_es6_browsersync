'use strict';
(function(appName) {
  var Component = ng.core.Component;

  appName.AppComponent = Component({
    selector: 'my-app',
    // template: '<h1>Random Quote</h1><random-quote></random-quote>'
    templateUrl: '../templates/app.component.html'
  })
  .Class({
    constructor: function AppComponent() { }
  });

})(window.appName || (window.appName = {}));
