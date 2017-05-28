'use strict';

(function (appName) {
    var Component = ng.core.Component;
    var QuoteService = appName.QuoteService;

    appName.RandomQuoteComponent = Component({
        selector: 'random-quote',
        template: `<p><em>{{quote.line}}</em> - {{quote.author}}</p>
    <i class="glyphicon glyphicon-map-marker"></i>`
    })
    .Class({
        constructor: [QuoteService, function RandomQuoteComponent(quoteService) {
            quoteService.generateRandomQuotes(1000, quote => this.quote = quote);
        }]
    });

})(window.appName || (window.appName = {}));
