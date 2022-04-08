# Usage

```js chart-editor
const config = {
	type: 'solidgauge',
	options: {
		min: '0%',
		max: '100%',
	},
	data: {
		datasets: [
			{
				data: [20, 100],
				backgroundColor: ['#6CA6F0', '#EDEDED'],
			},
		],
	},
};

module.exports = {
	config,
};
```
