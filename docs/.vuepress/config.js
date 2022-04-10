const path = require('path');

module.exports = {
	title: 'chartjs-chart-solidgauge',
	description: 'Chart.js module for creating solid gauge charts',
	theme: 'chartjs',
	base: '/chartjs-chart-solidgauge/',
	head: [
		['link', { rel: 'icon', href: '/favicon.ico' }],
	],
	plugins: [
		['flexsearch'],
		['redirect', {
			redirectors: [
				// Default sample page when accessing /samples.
				{ base: '/samples', alternative: ['basic'] },
			],
		}],
	],
	themeConfig: {
		repo: 'Izurii/chartjs-chart-solidgauge',
		logo: '/favicon.ico',
		lastUpdated: 'Last Updated',
		searchPlaceholder: 'Search...',
		editLinks: false,
		docsDir: 'docs',
		chart: {
			imports: [
				['scripts/register.js'],
			]
		},
		nav: [
			{ text: 'Home', link: '/' },
			{ text: 'Samples', link: `/samples/` },
			{
				text: 'Ecosystem',
				ariaLabel: 'Community Menu',
				items: [
					{ text: 'Awesome', link: 'https://github.com/chartjs/awesome' },
				]
			}
		],
		sidebar: {
			'/samples/': [
				'basic',
			],
			'/': [
				'',
				'integration',
				'usage'
			],
		}
	},
	extraWatchFiles: [
		path.resolve(__dirname, '../../src/SolidGauge.ts')
	]
};
