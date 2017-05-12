<template id="metricsStatistics">
	<div class="metricsStatistics">
		<div class="category" v-for="category in categories">
			<h2>{{ category }}</h2>
			<table class="statistics" cellspacing="0" cellpadding="0">
				<thead>
					<tr>
						<td>Id</td>
						<td>Amount</td>
						<td>Cumulative Average</td>
						<td>Exponential Average</td>
						<td>Minimum</td>
						<td>Maximum</td>
						<td>25% Deviation</td>
						<td>50% Deviation</td>
						<td>75% Deviation</td>
						<td>Larger Deviation</td>
					</tr>
				</thead>
				<tbody>
					<tr v-for="statistic in getCategory(category).sort(function(a, b) { return b.amount - a.amount })">
						<td>{{ statistic.id }}</td>
						<td>{{ statistic.amount }}</td>
						<td>{{ round(statistic.cumulativeAverage) }}</td>
						<td>{{ round(statistic.exponentialAverage) }}</td>
						<td>{{ statistic.minimum.value }}</td>
						<td>{{ statistic.maximum.value }}</td>
						<td v-bind:class="{ good: statistic.deviation25 >= 0.4 }">{{ round(statistic.deviation25) }}</td>
						<td v-bind:class="{ warning: statistic.deviation50 >= 0.4 }">{{ round(statistic.deviation50) }}</td>
						<td v-bind:class="{ warning: statistic.deviation75 >= 0.4 }">{{ round(statistic.deviation75) }}</td>
						<td v-bind:class="{ bad: statistic.deviationRest >= 0.4 }">{{ round(statistic.deviationRest) }}</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>