<template id="metricsGraphs">
	<h1>{{ artifact.id }}</h1>
	<div class="chart" v-for="serie in artifact.series">
		<h2>{{ serie.name }} ({{ serie.values.length }})</h2>
		<n-metrics-graph :serie="serie"></n-metrics-graph>
		<table v-if="serie.statistics" cellspacing="0" cellpadding="0">
			<tr>
				<td class="title">Cumulative Average</td>
				<td>{{ round(serie.statistics.cumulativeAverage) }}</td>
			</tr>
			<tr>
				<td class="title">Exponential Average</td>
				<td>{{ round(serie.statistics.exponentialAverage) }}</td>
			</tr>
			<tr>
				<td class="title">Minimum</td>
				<td>{{ serie.statistics.minimum.value }}</td>
			</tr>
			<tr>
				<td class="title">Maximum</td>
				<td>{{ serie.statistics.maximum.value }}</td>
			</tr>
			<tr>
				<td class="title">Amount Of Data Points</td>
				<td>{{ serie.statistics.amountOfDataPoints }}</td>
			</tr>
		</table>
	</div>
</template>