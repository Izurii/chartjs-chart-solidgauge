import {
	Scriptable,
	Color,
	ChartType,
	ChartDataset,
	Plugin,
	Element,
	VisualElement,
	DoughnutController,
} from "chart.js";

declare module "chart.js" {
	interface ChartTypeRegistry {
		solidgauge: {
			chartOptions: {
				cutout: number | string;
				text: string;
				textColor: string;
				textFont: string;
				subtext: string;
				subtextColor: string;
				subtextFont: string;
				min: number | string;
				max: number | string;
				minMaxFont: string;
				minMaxColor: string;
			} & Omit<
				DoughnutControllerChartOptions,
				"circumference" | "rotation"
			>;
		} & Omit<ChartTypeRegistry["doughnut"], "chartOptions">;
	}
}

export default class SolidGauge extends DoughnutController {
	private _outerArcWidth;
	private _innerArcWidth;
	private _arcThickness;
	private _arcThicknessHalf;
	private _arcY;
	private _distanceFromCanvasEdgeX;
	private readonly _box;
	draw(): void;
	private _drawMinMax;
}
