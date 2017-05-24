application.views.MetricsDatabase = Vue.extend({
	props: ["database", "host"],
	template: "#metricsDatabase",
	data: function() {
		return {
			metrics: [],
			visibleCategories: [],
			timer: null,
			showFilter: false
		};
	},
	activate: function(done) {
		this.select().then(function(response) {
			done();
		});
	},
	beforeDestroy: function() {
		this.clearTimeout();
	},
	methods: {
		reset: function() {
			this.metrics = [];
			this.visibleCategories = [];
		},
		clearTimeout: function() {
			if (this.timer != null) {
				clearTimeout(this.timer);
				this.timer = null;
			}
		},
		select: function(since) {
			var sinceString;
			if (since) {
				sinceString = "?since=" + since.toISOString();
			}
			else {
				sinceString = "";
				this.reset();
			}
			var self = this;
			
			var url = this.database 
				? "${server.root()}api/metrics/database/" + self.database + sinceString
				: "${server.root()}api/metrics/server" + (self.host ? "/" + self.host : "") + sinceString;
				
			return nabu.utils.ajax({
				method: "get",
				url: url,
				success: function(response) {
					var data = JSON.parse(response.responseText);
					since = new Date(data.overview.timestamp);
					self.pushOverview(data.overview);
					self.timer = setTimeout(function() {
						self.select(since);
					}, 10000);
				}
			});
		},
		toggleCategory: function (category) {
			var index = this.visibleCategories.indexOf(category);
			if (index < 0) {
				this.visibleCategories.push(category);
			}
			else {
				this.visibleCategories.splice(index, 1);
			}
		},
		getArtifactsInCategory: function(category) {
			var artifacts = [];
			for (var i = 0; i < this.metrics.length; i++) {
				if (this.metrics[i].type == category) {
					artifacts.push(this.metrics[i]);
				}
			}
			return artifacts;
		},
		pushOverview: function(overview) {
			for (var i = 0; i < overview.metrics.length; i++) {
				var metrics = this.getOverviewById(overview.metrics[i].id);
				// create the metric overview
				if (metrics == null) {
					metrics = {
						id: overview.metrics[i].id
					};
					this.metrics.push(metrics);
				}
				// set the artifact type if it is not known yet
				if (!metrics.type && overview.metrics[i].type) {
					metrics["type"] = overview.metrics[i].type;
				}
				// push the data
				for (var snapshot in overview.metrics[i].snapshots) {
					if (!metrics.series) {
						metrics.series = [];
					}
					var current = null;
					for (var j = 0; j < metrics.series.length; j++) {
						if (metrics.series[j].name == snapshot) {
							current = metrics.series[j];
							break;
						}
					}
					if (current == null) {
						current = {
							name: snapshot,
							values: [],
							statistics: {}
						};
						metrics.series.push(current);
					}
					// push the value data
					for (var j = 0; j < overview.metrics[i].snapshots[snapshot].values.length; j++) {
						current.values.push(overview.metrics[i].snapshots[snapshot].values[j]);
					}
					// push the statistics
					current["statistics"] = overview.metrics[i].statistics[snapshot];
				}
			}
		},
		getOverviewById: function(id) {
			for (var i = 0; i < this.metrics.length; i++) {
				if (this.metrics[i].id == id) {
					return this.metrics[i];
				}
			}
			return null;
		}
	},
	computed: {
		categories: function() {
			var categories = [];
			for (var i = 0; i < this.metrics.length; i++) {
				if (this.metrics[i].type && categories.indexOf(this.metrics[i].type) < 0) {
					categories.push(this.metrics[i].type);
				}
			}
			return categories;
		}
	}
});