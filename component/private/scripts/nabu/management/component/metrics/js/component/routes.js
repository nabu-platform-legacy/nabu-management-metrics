application.services.router.register({
	alias: "metricsDatabase",
	enter: function(parameters) {
		return new application.views.MetricsDatabase({ data: parameters });
	},
	url: "/metrics/{database}"
});

application.services.router.register({
	alias: "metricsLocal",
	enter: function(parameters) {
		return new application.views.MetricsDatabase();
	},
	url: "/metrics"
});

application.services.router.register({
	alias: "metricsStatistics",
	enter: function(parameters) {
		return new application.views.MetricsStatistics({ data: parameters });
	}
});

application.services.router.register({
	alias: "metricsGraphs",
	enter: function(parameters) {
		return new application.views.MetricsGraphs({ data: parameters });
	}
});