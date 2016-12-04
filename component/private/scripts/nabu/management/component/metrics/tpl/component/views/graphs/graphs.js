application.views.MetricsGraphs = Vue.extend({
	props: ["artifact"],
	template: "#metricsGraphs",
	data: function() {
		return {};
	},
	methods: {
		round: function(number) {
			return Math.round(number * 100) / 100;
		}
	}
});