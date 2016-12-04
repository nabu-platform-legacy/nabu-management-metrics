application.views.MetricsStatistics = Vue.extend({
	props: ["artifacts", "category"],
	template: "#metricsStatistics",
	data: function() {
		return {
			statistics: [],
			sortParam: "amount",
			sortOrder: -1
		};
	},
	ready: function() {
		this.calculateStatistics();
	},
	methods: {
		calculateStatistics: function() {
			for (var i = 0; i < this.artifacts.length; i++) {
				if (this.artifacts[i].series) {
					for (var j = 0; j < this.artifacts[i].series.length; j++) {
						if (this.artifacts[i].series[j].statistics) {
							var statistic = {
								id: this.artifacts[i].id,
								category: this.artifacts[i].series[j].name,
								cumulativeAverage: this.artifacts[i].series[j].statistics.cumulativeAverage,
								exponentialAverage: this.artifacts[i].series[j].statistics.exponentialAverage,
								minimum: this.artifacts[i].series[j].statistics.minimum,
								maximum: this.artifacts[i].series[j].statistics.maximum,
								amount: this.artifacts[i].series[j].statistics.amountOfDataPoints
							};
							for (var k = 0; k < this.artifacts[i].series[j].statistics.cumulativeAverageDeviation.length; k++) {
								var deviation = this.artifacts[i].series[j].statistics.cumulativeAverageDeviation[k];
								if (deviation.deviation == 0.25) {
									statistic["deviation25"] = deviation.percentage;
								}
								else if (deviation.deviation == 0.50) {
									statistic["deviation50"] = deviation.percentage;
								}
								else if (deviation.deviation == 0.75) {
									statistic["deviation75"] = deviation.percentage;
								}
								else {
									statistic["deviationRest"] = deviation.percentage;
								}
							}
							this.statistics.push(statistic);
						}
					}
				}
			}
		},
		getCategory: function(category) {
			var statistics = [];
			for (var i = 0; i < this.statistics.length; i++) {
				if (this.statistics[i].category == category) {
					statistics.push(this.statistics[i]);
				}
			}
			return statistics;
		},
		round: function(number) {
			return Math.round(number * 100) / 100;
		}
	},
	computed: {
		categories: function() {
			var categories = [];
			for (var i = 0; i < this.statistics.length; i++) {
				if (categories.indexOf(this.statistics[i].category) < 0) {
					categories.push(this.statistics[i].category);
				}
			}
			return categories;
		}
	}
});