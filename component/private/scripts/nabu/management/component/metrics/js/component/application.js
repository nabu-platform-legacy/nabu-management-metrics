application.initialize.modules.push(function() {
	nabu.utils.ajax({
		url: "${server.root()}api/metrics/database/list",
		success: function(response) {
			var databases = JSON.parse(response.responseText);
			var children = [];
			children.push({
				title: "Localhost",
				handle: function() {
					application.services.router.route("metricsLocal");
				}
			})
			for (var i = 0; i < databases.length; i++) {
				children.push({
					title: databases[i],
					handle: function() {
						application.services.router.route("metricsDatabase", { database: databases[i] });
					}
				});
			}
			application.services.vue.menu.push({
				title: "Metrics",
				children: children
			});
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