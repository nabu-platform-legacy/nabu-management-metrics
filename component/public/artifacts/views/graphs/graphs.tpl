<template id="metricsGraphs">
	<div class="metricsGraphs">
		<h1 class="subtitle">{{ artifact.id }}</h1>
		<div class="dashboards">
			<div class="chart dashboard" v-for="serie in artifact.series">
				<h1>{{ serie.name }} ({{ serie.values.length }})</h1>
				<n-metrics-graph :serie="serie"></n-metrics-graph>
				<table class="classic" v-if="serie.statistics" cellspacing="0" cellpadding="0">
					<tbody>
						<tr>
							<td class="title">Oldest Value</td>
							<td>{{ oldest(serie) }}</td>
						</tr>
						<tr>
							<td class="title">Youngest Value</td>
							<td>{{ youngest(serie) }}</td>
						</tr>
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
					</tbody>
				</table>
			</div>
		</div>
	</div>
</template>