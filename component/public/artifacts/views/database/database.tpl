<template id="metricsDatabase">
	<div class="metricsDatabase">
		<div class="page-menu">
			<h1 class="title">Metrics</h1>
			<div class="actions">
				<button class="info" @click="showFilter = !showFilter"><span class="n-icon n-icon-search"></span><span>Search</span></button>
				<div class="optional" v-show="showFilter" v-auto-close="function() { showFilter = false }">
					<div class="category" v-for="category in categories">
						<div class="type">
							<img v-on:click="toggleCategory(category)" src="${server.root()}resources/images/icons/minus.png" v-show="visibleCategories.indexOf(category) >= 0"/>
							<img v-on:click="toggleCategory(category)" src="${server.root()}resources/images/icons/plus.png" v-show="visibleCategories.indexOf(category) < 0"/>
							<span v-on:click="$services.router.route('metricsStatistics', { category: category, artifacts: getArtifactsInCategory(category) }, 'metricsContent')">{{ category ? category.replace(/^.*\./, "") : "Misc" }} ({{getArtifactsInCategory(category).length}})</span>
						</div>
						<ul v-show="visibleCategories.indexOf(category) >= 0">
							<li :title="artifact.id" v-for="artifact in getArtifactsInCategory(category).sort(function(a, b) { return a.id.localeCompare(b.id) })"><a href="javascript:void(0)" 
								v-on:click="$services.router.route('metricsGraphs', { artifact: artifact }, 'metricsContent')">{{ artifact.id }}</a></li>
						</ul>
					</div>
				</div>
			</div>
		</div>
		<div id="metricsContent"></div>
	</div>
</template>