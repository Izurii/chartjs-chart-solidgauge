# Basic

```js chart-editor
// <block:data:1>
const data = {
	datasets: [
		{
			data: [20, 100],
			backgroundColor: ['#6CA6F0', '#EDEDED'],
		},
	],
};
// </block:data>

// <block:config:0>
const config = {
	type: 'solidgauge',
	data: data,
	options: {
		min: '0%',
		max: '100%',
		text: '20%',
		subtext: '323',
	},
};
// </block:config:0>

const actions = [
	{
		name: 'Randomize',
		handler(chart) {
			chart.data.datasets.forEach((_, datasetIndex) => {
				const newValue = (Math.random() * 21.2).toFixed(0);
				chart.data.datasets[datasetIndex].data[0] = newValue;
				chart.options.text = newValue + '%';
			});
			chart.update();
		},
	},
];

module.exports = {
	actions,
	config,
};
```
