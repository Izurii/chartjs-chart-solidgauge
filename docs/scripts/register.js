import { Chart } from 'chart.js';
import SolidGauge from '../../dist/SolidGauge.js';
import { version } from '../../package.json';

Chart.register(SolidGauge);

Chart.register({
	id: 'version',
	afterDraw(chart) {
		const ctx = chart.ctx;
		ctx.save();
		ctx.font = '9px monospace';
		ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
		ctx.textAlign = 'right';
		ctx.textBaseline = 'top';
		ctx.fillText('Chart.js v' + Chart.version + ' + chartjs-chart-solidgauge v' + version, chart.chartArea.right, 0);
		ctx.restore();
	}
});
