application.views.MetricsGraphs = Vue.extend({
	props: ["artifact"],
	template: "#metricsGraphs",
	data: function() {
		return {};
	},
	methods: {
		round: function(number) {
			return Math.round(number * 100) / 100;
		},
		oldest: function(series) {
			if (!series.values || !series.values.length) {
				return null;
			}
			else {
				return this.formatDateTime(new Date(series.values[0].timestamp));
			}
		},
		youngest: function(series) {
			if (!series.values || !series.values.length) {
				return null;
			}
			else {
				return this.formatDateTime(new Date(series.values[series.values.length - 1].timestamp));
			}
		}
	}
});