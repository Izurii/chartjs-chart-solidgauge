/* eslint-disable @typescript-eslint/lines-between-class-members */
/* eslint-disable no-underscore-dangle */
import {
	ArcElement,
	ArcOptions,
	ArcProps,
	Chart,
	ChartOptions,
	DoughnutController,
	Element,
	LayoutItem,
	layouts,
} from 'chart.js';
import { AnyObject } from 'chart.js/types/basic';

export default class SolidGauge extends DoughnutController {
	private _canvasWidth = 0;
	private _canvasWidthHalf = 0;
	private _canvasHeight = 0;
	// @ts-ignore
	private _canvasHeightHalf = 0;

	private _outerArcWidth = 0;
	private _innerArcWidth = 0;

	private _arcThickness = 0;
	private _arcThicknessHalf = 0;
	private _arcY = 0;

	private _distanceFromCanvasEdgeX = 0;

	private _browserZoom = 0;

	// @ts-ignore
	private readonly _box = {
		id: 'solidgauge-box',
		position: 'bottom',
		draw: () => {},
		weight: 1000,
		fullSize: true,
		width: 0,
		height: 0,
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		responsive: true,
		isHorizontal: () => true,
		update: () => {},
		options: {},
	} as LayoutItem;

	draw(): void {
		this._calculateDimensions();

		const chart = this.chart as Chart<'solidgauge'>;

		const { text, textFont, textColor, subtext, subtextFont, subtextColor, min, max } = chart.options;

		const { ctx } = chart;

		ctx.restore();

		ctx.textAlign = 'start';
		ctx.textBaseline = 'middle';

		ctx.save();

		if (text) {
			const textFontSize = (this._innerArcWidth / 70).toFixed(2);

			ctx.font = textFont || `bold ${textFontSize}em sans-serif`;

			const textDimensions = ctx.measureText(text);
			const textHeight = textDimensions.actualBoundingBoxAscent + textDimensions.actualBoundingBoxDescent;

			const textX = Math.round(this._canvasWidthHalf - textDimensions.width / 2);
			let textY = Math.round(this._arcY - textHeight);

			let subtextY = textY + textHeight;

			if (subtextY > this._canvasHeight) {
				const difference = subtextY - this._canvasHeight;

				textY -= difference;
				subtextY -= difference;
			}

			ctx.fillStyle = textColor || '#000';
			ctx.fillText(text, textX, textY);
			ctx.restore();

			if (subtext) {
				const subtextFontSize = (Number(textFontSize) / 2).toFixed(2);
				ctx.font = subtextFont || `bold ${subtextFontSize}em sans-serif`;

				const subtextDimensions = ctx.measureText(subtext);
				const subtextX = Math.round(this._canvasWidthHalf - subtextDimensions.width / 2);

				ctx.fillStyle = subtextColor || '#000';
				ctx.fillText(subtext, subtextX, subtextY);
				ctx.restore();
			}
		}

		if (typeof min !== 'undefined' || typeof max !== 'undefined') {
			const heightMinOrMax = this._drawMinMax();
			const newHeight = heightMinOrMax + this._arcThickness / 2;

			const solidGaugeBox = this.chart.boxes.find(
				// @ts-ignore
				(box) => box.id === 'solidgauge-box'
			);

			if (solidGaugeBox) {
				if (solidGaugeBox.height < newHeight) {
					solidGaugeBox.height = newHeight;
				}
			} else {
				layouts.addBox(this.chart, { ...this._box, height: newHeight });
			}
		}

		super.draw();
	}

	private _drawMinMax(): number {
		const chart = this.chart as Chart<'solidgauge'>;
		const { ctx } = chart;
		const { min, max, minMaxFont, minMaxColor } = chart.options;

		// MIN~MAX

		const minIsUndefined = typeof min === 'undefined';
		const maxIsUndefined = typeof max === 'undefined';

		const minString = !minIsUndefined ? `${min}` : '';
		const maxString = !maxIsUndefined ? `${max}` : '';

		const minMaxFontSize = (this._arcThickness / 70).toFixed(2);
		ctx.font = minMaxFont || `normal ${minMaxFontSize}em sans-serif`;

		const minOrMaxDimensions = ctx.measureText(minString || maxString);
		const minOrMaxHeight = minOrMaxDimensions.actualBoundingBoxAscent + minOrMaxDimensions.actualBoundingBoxDescent;

		const minMaxY = Math.round(this._arcY + minOrMaxHeight + minOrMaxHeight / 2);

		const minDimensions = ctx.measureText(minString);
		const minX = Math.round(this._distanceFromCanvasEdgeX + this._arcThicknessHalf - minDimensions.width / 2);

		const maxDimensions = ctx.measureText(maxString);
		const maxX = Math.round(
			this._canvasWidth - this._distanceFromCanvasEdgeX - this._arcThicknessHalf - maxDimensions.width / 2
		);

		ctx.fillStyle = minMaxColor || '#000';

		ctx.fillText(minString, minX, minMaxY);
		ctx.fillText(maxString, maxX, minMaxY);

		return minOrMaxHeight;
	}

	private _calculateDimensions(): void {
		this._browserZoom = window.devicePixelRatio || 1;

		const chart = this.chart as Chart<'solidgauge'>;
		const { ctx } = chart;

		const { height: canvasHeightReal, width: canvasWidthReal } = ctx.canvas;

		this._canvasWidth = Math.round(canvasWidthReal / this._browserZoom);
		this._canvasWidthHalf = Math.round(this._canvasWidth / 2);
		this._canvasHeight = Math.round(canvasHeightReal / this._browserZoom);
		this._canvasHeightHalf = Math.round(this._canvasHeight / 2);

		// @ts-ignore
		const datasetMeta: ChartMeta<
			Element<ArcElement, ArcOptions & AnyObject> & ArcProps,
			Element<ArcElement, ArcOptions & AnyObject> & ArcProps,
			'solidgauge'
		> = chart.getDatasetMeta(0);

		const { innerRadius, outerRadius, y: arcY } = datasetMeta.data[0];

		this._arcY = arcY;
		this._outerArcWidth = Math.round(this.outerRadius * 2);
		this._innerArcWidth = Math.round(this.innerRadius * 2);

		this._distanceFromCanvasEdgeX = Math.round((this._canvasWidth - this._outerArcWidth) / 2);

		this._arcThickness = Math.round(outerRadius - innerRadius);
		this._arcThicknessHalf = Math.round(this._arcThickness / 2);
	}
}

SolidGauge.id = 'solidgauge';
SolidGauge.defaults = {
	...DoughnutController.defaults,
	maintainAspectRatio: false,
	circumference: 180,
	rotation: -90,
	cutout: '70%',
	textColor: '#000',
	subtextColor: '#000',
	minMaxColor: '#000',
	plugins: {
		tooltip: {
			enabled: false,
		},
	},
} as ChartOptions<'solidgauge'>;

Chart.register(SolidGauge, ArcElement);
