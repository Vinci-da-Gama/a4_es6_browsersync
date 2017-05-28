'use strict';
(function (appName) {
	var NgModule = ng.core.NgModule;
	var BrowserModule = ng.platformBrowser.BrowserModule;
	var QuoteService = appName.QuoteService;
	var RandomQuoteComponent = appName.RandomQuoteComponent;
	var AppComponent = appName.AppComponent;

	appName.AppModule = NgModule({
		imports: [BrowserModule],
		declarations: [AppComponent, RandomQuoteComponent],
		providers: [QuoteService],
		bootstrap: [AppComponent]
	})
	.Class({
		constructor: function AppModuleConstructor() { }
	});

})(window.appName || (window.appName = {}));