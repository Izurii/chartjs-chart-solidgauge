import {
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
				textColor: Indexable<Color> | Scriptable<Color>;
				textFont: Indexable<Font> | Scriptable<Font>;
				subtext: string;
				subtextColor: Indexable<Color> | Scriptable<Color>;
				subtextFont: Indexable<Font> | Scriptable<Font>;
				min: number | string;
				max: number | string;
				minMaxFont: Indexable<Font> | Scriptable<Font>;
				minMaxColor: Indexable<Color> | Scriptable<Color>;
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
