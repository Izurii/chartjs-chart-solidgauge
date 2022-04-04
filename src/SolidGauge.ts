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
} from "chart.js";
import { AnyObject } from "chart.js/types/basic";

export default class SolidGauge extends DoughnutController {
	private _outerArcWidth: number = 0;
	private _innerArcWidth: number = 0;

	private _arcThickness: number = 0;
	private _arcThicknessHalf: number = 0;
	private _arcY: number = 0;

	private _distanceFromCanvasEdgeX: number = 0;

	private readonly _box = {
		id: "solidgauge-box",
		position: "bottom",
		draw: () => {},
		weight: 1000,
		fullSize: false,
		width: 0,
		height: 0,
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		responsive: false,
		isHorizontal: () => true,
		update: () => {},
		options: {},
	} as LayoutItem;

	draw(): void {
		const chart = this.chart as Chart<"solidgauge">;

		const {
			text,
			textFont,
			textColor,
			subtext,
			subtextFont,
			subtextColor,
			min,
			max,
		} = chart.options;

		const { ctx } = chart;

		const { height: canvasHeight, width: canvasWidth } = ctx.canvas;
		const canvasWidthHalf = canvasWidth / 2;

		// @ts-ignore
		const datasetMeta: ChartMeta<
			Element<ArcElement, ArcOptions & AnyObject> & ArcProps,
			Element<ArcElement, ArcOptions & AnyObject> & ArcProps,
			"solidgauge"
		> = chart.getDatasetMeta(0);

		const { innerRadius, outerRadius, y: arcY } = datasetMeta.data[0];

		this._arcY = arcY;
		this._outerArcWidth = Math.round(this.outerRadius * 2);
		this._innerArcWidth = Math.round(this.innerRadius * 2);

		this._distanceFromCanvasEdgeX = Math.round(
			(canvasWidth - this._outerArcWidth) / 2
		);

		this._arcThickness = Math.round(outerRadius - innerRadius);
		this._arcThicknessHalf = Math.round(this._arcThickness / 2);

		ctx.restore();

		ctx.textAlign = "start";
		ctx.textBaseline = "middle";

		ctx.save();

		if (text) {
			const textFontSize = (this._innerArcWidth / 70).toFixed(2);

			ctx.font = textFont || `bold ${textFontSize}em sans-serif`;

			const textDimensions = ctx.measureText(text);
			const textHeight =
				textDimensions.actualBoundingBoxAscent +
				textDimensions.actualBoundingBoxDescent;

			const textX = Math.round(
				canvasWidthHalf - textDimensions.width / 2
			);
			let textY = Math.round(arcY - textHeight);

			let subtextY = textY + textHeight;

			if (subtextY > canvasHeight) {
				const difference = subtextY - canvasHeight;

				textY -= difference;
				subtextY -= difference;
			}

			ctx.fillStyle = textColor;
			ctx.fillText(text, textX, textY);
			ctx.restore();

			if (subtext) {
				const subtextFontSize = (Number(textFontSize) / 2).toFixed(2);
				ctx.font =
					subtextFont || `bold ${subtextFontSize}em sans-serif`;

				const subtextDimensions = ctx.measureText(subtext);
				const subtextX = Math.round(
					canvasWidthHalf - subtextDimensions.width / 2
				);

				ctx.fillStyle = subtextColor;
				ctx.fillText(subtext, subtextX, subtextY);
				ctx.restore();
			}
		}

		ctx.save();

		if (min || max) {
			const heightMinOrMax = this._drawMinMax();
			const newHeight = heightMinOrMax + this._arcThickness / 2;

			const solidGaugeBox = this.chart.boxes.find(
				// @ts-ignore
				(box) => box.id === "solidgauge-box"
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
		const chart = this.chart as Chart<"solidgauge">;
		const { ctx } = chart;
		const { min, max, minMaxFont, minMaxColor } = chart.options;
		const { width: canvasWidth } = ctx.canvas;

		// MIN~MAX

		const minIsNumber = typeof min === "number";
		const maxIsNumber = typeof max === "number";

		const minString = minIsNumber ? `${min}` : "0";
		const maxString = maxIsNumber ? `${max}` : "100";

		const minMaxFontSize = (this._arcThickness / 70).toFixed(2);
		ctx.font = minMaxFont || `normal ${minMaxFontSize}em sans-serif`;

		const minOrMaxDimensions = ctx.measureText(minString || maxString);
		const minOrMaxHeight =
			minOrMaxDimensions.actualBoundingBoxAscent +
			minOrMaxDimensions.actualBoundingBoxDescent;

		const minMaxY = Math.round(
			this._arcY + minOrMaxHeight + minOrMaxHeight / 2
		);

		const minDimensions = ctx.measureText(minString);
		const minX = Math.round(
			this._distanceFromCanvasEdgeX +
				this._arcThicknessHalf -
				minDimensions.width / 2
		);

		const maxDimensions = ctx.measureText(maxString);
		const maxX = Math.round(
			canvasWidth -
				this._distanceFromCanvasEdgeX -
				this._arcThicknessHalf -
				maxDimensions.width / 2
		);

		if (minMaxColor) {
			ctx.fillStyle = minMaxColor;
		}

		ctx.fillText(minString, minX, minMaxY);
		ctx.fillText(maxString, maxX, minMaxY);

		return minOrMaxHeight;
	}
}

SolidGauge.id = "solidgauge";
SolidGauge.defaults = {
	...DoughnutController.defaults,
	maintainAspectRatio: false,
	circumference: 180,
	rotation: -90,
	cutout: "70%",
	textColor: "#000",
	subtextColor: "#000",
	minMaxColor: "#000",
} as ChartOptions<"solidgauge">;

Chart.register(SolidGauge);
