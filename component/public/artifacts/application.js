application.configuration.modules.push(function($services) {
	nabu.utils.ajax({
		url: "${server.root()}api/metrics/database/list",
		success: function(response) {
			var result = JSON.parse(response.responseText);
			var actions = [];
			actions.push({
				title: "Localhost",
				handler: function() {
					$services.router.route("metricsLocal");
				}
			});
			for (var i = 0; i < result.peers.length; i++) {
				actions.push({
					title: result.peers[i],
					peer: result.peers[i],
					handler: function() {
						$services.router.route("metricsRemote", { host: self.peer });
					}
				});
			}
			for (var i = 0; i < result.databases.length; i++) {
				actions.push({
					title: result.databases[i],
					database: result.databases[i],
					handler: function(self) {
						$services.router.route("metricsDatabase", { database: self.database });
					}
				});
			}
			$services.manager.menu({
				title: "Metrics",
				actions: actions
			});
		}
	});
	
	$services.router.register({
		alias: "metricsDatabase",
		enter: function(parameters) {
			return new application.views.MetricsDatabase({ data: parameters });
		},
		url: "/metrics/database/{database}"
	});
	
	$services.router.register({
		alias: "metricsRemote",
		enter: function(parameters) {
			return new application.views.MetricsDatabase({ data: parameters });
		},
		url: "/metrics/remote/{host}"
	});
	
	$services.router.register({
		alias: "metricsLocal",
		enter: function(parameters) {
			return new application.views.MetricsDatabase();
		},
		url: "/metrics"
	});
	
	$services.router.register({
		alias: "metricsStatistics",
		enter: function(parameters) {
			return new application.views.MetricsStatistics({ data: parameters });
		}
	});
	
	$services.router.register({
		alias: "metricsGraphs",
		enter: function(parameters) {
			return new application.views.MetricsGraphs({ data: parameters });
		}
	});
});


var MetricsGraph = Vue.component("n-metrics-graph", {
	props: ["serie"],
	template: "<div></div>",
	data: function() {
		return {
			labels: [],
			values: [],
			cumulativeAverage: [],
			exponentialAverage: [],
			target: null
		}
	},
	ready: function() {
		this.calculate(this.serie);
	},
	methods: {
		calculate: function(serie) {
			this.labels.splice(0, this.labels.length);
			this.values.splice(0, this.values.length);
			this.cumulativeAverage.splice(0, this.cumulativeAverage.length);
			this.exponentialAverage.splice(0, this.exponentialAverage.length);
			
			for (var j = 0; j < serie.values.length; j++) {
				this.labels.push(new Date(serie.values[j].timestamp).toLocaleTimeString())
				this.values.push({
					meta: new Date(serie.values[j].timestamp).toLocaleTimeString(),
					value: serie.values[j].value
				});
				if (serie.statistics) {
					this.cumulativeAverage.push(serie.statistics.cumulativeAverage);
					this.exponentialAverage.push(serie.statistics.exponentialAverage);
				}
			}
			
			var self = this;
			var newTarget = document.createElement("div");
		 	var chart = new Chartist.Line(newTarget, {
				labels: self.labels,
				series: [
					self.values,
					self.cumulativeAverage,
					self.exponentialAverage
				]
			}, {
				showArea: true,
				axisX: {
					labelInterpolationFnc: function skipLabels(value, index) {
						var result = index % (value.length / 10.0) === 0 ? value : null;
						return isNaN(result) ? null : result;
					}
				},
				//showPoint: false,
				fullWidth: true,
	/*			low: 0,*/
				lineSmooth: Chartist.Interpolation.simple({
					divisor: 2
				}),
				/*plugins: [
					Chartist.plugins.tooltip()
				]*/
			});
			
			if (this.target) {
				this.$el.removeChild(this.target);
			}
			this.$el.appendChild(newTarget);
			this.target = newTarget;
		}
	},
	watch: {
		serie: {
			handler: function(newValue, oldValue) {
				this.calculate(newValue);
			},
			deep: true
		}
	}
});