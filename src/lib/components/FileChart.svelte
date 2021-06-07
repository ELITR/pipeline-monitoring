<script lang="ts">
	import ChartJS from 'chart.js/auto/auto.esm';
	export let data;

	const initialOptions = {
		type: 'line',
		data: {
			labels: ['January'],
			datasets: [
				{
					label: 'Modification durations',
					backgroundColor: 'rgb(255, 99, 132)',
					borderColor: 'rgb(255, 99, 132)',
					data: [0]
				}
			]
		},
		options: {}
	};

	const chart = (node, data) => {
		const chart = new ChartJS(node, initialOptions);
		return {
			update(data) {
				console.log(data);
				chart.data = Object.assign({}, data);
				chart.update();
			},

			destroy() {
				chart.destroy();
			}
		};
	};
</script>

<canvas use:chart={data} />
