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
import type { AnyObject } from 'chart.js/types/basic';
import { _DeepPartialObject } from 'chart.js/types/utils';
import type { FontObject } from '../types';

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

		const { text, textFont, subtext, subtextFont, min, max } = chart.options;

		const { ctx } = chart;

		ctx.restore();

		ctx.textAlign = 'start';
		ctx.textBaseline = 'middle';

		ctx.save();

		if (text) {
			const textFontSize = (this._innerArcWidth / 70).toFixed(2);

			ctx.font = this._processFontObject(textFont || {}, {
				fontSize: `${textFontSize}em`,
				fontWeight: 'bold',
			});

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

			ctx.fillStyle = this._getFontColor(textFont || {});
			ctx.fillText(text, textX, textY);
			ctx.restore();

			if (subtext) {
				const subtextFontSize = (Number(textFontSize) / 2).toFixed(2);
				ctx.font = this._processFontObject(subtextFont || {}, {
					fontSize: `${subtextFontSize}em`,
					fontWeight: 'bold',
				});

				const subtextDimensions = ctx.measureText(subtext);
				const subtextX = Math.round(this._canvasWidthHalf - subtextDimensions.width / 2);

				ctx.fillStyle = this._getFontColor(subtextFont || {});
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
				chart.update();
			}
		}

		super.draw();
	}

	private _drawMinMax(): number {
		const chart = this.chart as Chart<'solidgauge'>;
		const { ctx } = chart;
		const { min, max, minMaxFont } = chart.options;

		// MIN~MAX

		const minIsUndefined = typeof min === 'undefined';
		const maxIsUndefined = typeof max === 'undefined';

		const minString = !minIsUndefined ? `${min}` : '';
		const maxString = !maxIsUndefined ? `${max}` : '';

		const minMaxFontSize = (this._arcThickness / 60).toFixed(2);
		ctx.font = this._processFontObject(minMaxFont || {}, {
			fontSize: `${minMaxFontSize}em`,
		});

		const minOrMaxDimensions = ctx.measureText(minString || maxString);
		const minOrMaxHeight = minOrMaxDimensions.actualBoundingBoxAscent + minOrMaxDimensions.actualBoundingBoxDescent;

		const minMaxY = Math.round(this._arcY + minOrMaxHeight + minOrMaxHeight / 2);

		const minDimensions = ctx.measureText(minString);
		const minX = Math.round(this._distanceFromCanvasEdgeX + this._arcThicknessHalf - minDimensions.width / 2);

		const maxDimensions = ctx.measureText(maxString);
		const maxX = Math.round(
			this._canvasWidth - this._distanceFromCanvasEdgeX - this._arcThicknessHalf - maxDimensions.width / 2
		);

		ctx.fillStyle = this._getFontColor(minMaxFont || {});

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

	private _processFontObject(
		font: _DeepPartialObject<FontObject>,
		options?: _DeepPartialObject<Exclude<FontObject, string>>
	): string {
		if (typeof font === 'string') {
			return font;
		}

		let fontSize = options?.fontSize || '1em';
		if (font.fontSize) {
			fontSize = (parseFloat(`${font.fontSize}`) * (this._innerArcWidth / 150) * this._browserZoom).toFixed(2);
			fontSize = `${fontSize}${String(font.fontSize).replace(/\d\.+/g, '')}`;
		}

		return `${font.fontStyle || options?.fontStyle || 'normal'} ${
			font.fontVariant || options?.fontVariant || 'normal'
		} ${font.fontWeight || options?.fontWeight || 'normal'} ${fontSize} ${
			font.fontFamily || options?.fontFamily || 'sans-serif'
		}`;
	}

	private _getFontColor(font: _DeepPartialObject<FontObject>, defaultColor?: string): string {
		if (typeof font === 'string') {
			return defaultColor || '#000';
		}
		return font.fontColor || defaultColor || '#000';
	}
}

SolidGauge.id = 'solidgauge';
SolidGauge.defaults = {
	...DoughnutController.defaults,
	maintainAspectRatio: false,
	backgroundColor: ['#6CA6F0', 'transparent'],
	circumference: 180,
	rotation: -90,
	cutout: '70%',
	textFont: {
		fontColor: '#000',
	},
	subtextFont: {
		fontColor: '#000',
	},
	minMaxFont: {
		fontColor: '#000',
	},
	plugins: {
		tooltip: {
			enabled: false,
		},
	},
} as ChartOptions<'solidgauge'>;

Chart.register(SolidGauge, ArcElement);
