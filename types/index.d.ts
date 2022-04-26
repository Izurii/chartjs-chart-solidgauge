import {
	Scriptable,
	Color,
	ChartType,
	ChartDataset,
	Plugin,
	Element,
	VisualElement,
	DoughnutController,
} from 'chart.js';

export type FontObject =
	| {
			fontStyle: 'normal' | 'italic' | 'oblique';
			fontVariant: 'normal' | 'small-caps';
			fontWeight: 'normal' | 'bold' | 'bolder' | 'lighter' | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
			fontSize: number | string;
			fontFamily: string;
			fontColor: string;
	  }
	| string;

declare module 'chart.js' {
	interface ChartTypeRegistry {
		solidgauge: {
			chartOptions: {
				cutout: number | string;
				text: string;
				textFont: FontObject;
				subtext: string;
				subtextFont: FontObject;
				min: number | string;
				max: number | string;
				minMaxFont: FontObject;
			} & Omit<DoughnutControllerChartOptions, 'circumference' | 'rotation'>;
		} & Omit<ChartTypeRegistry['doughnut'], 'chartOptions'>;
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
