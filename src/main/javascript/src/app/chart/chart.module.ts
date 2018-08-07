import { NgModule } from '@angular/core';
import { NvD3Module } from 'ng2-nvd3';
import 'd3';
import 'nvd3';

import { CapuxChartComponent } from './chart.component';

import { SimpleChartHelper } from './helper/simple-chart-helper.service';
import { AreaChartHelper } from './helper/area-chart-helper.service';
import { LineChartHelper } from "app/chart/helper/line-chart-helper.service";
import { PieChartHelper } from "./helper/pie-chart-helper.service";
import { DonutChartHelper } from "./helper/donut-chart-helper.service";
import { HistoricalBarChartHelper } from "./helper/historical-bar-chart-helper.service";
import { MultibarChartHelper } from "./helper/multibar-chart-helper.service";
import { ScatterChartHelper } from "./helper/scatter-chart-helper.service";
import { StackedAreaChartHelper } from "./helper/stacked-area-chart-helper.service";
import { DiscreteBarChartHelper } from "./helper/discrete-bar-chart-helper.service";
import { MultibarHorizontalChartHelper } from "./helper/multibar-horizontal-chart-helper.service";
import { OhlcBarChartHelper } from "./helper/ohlc-bar-chart-helper.service";
import { SparklinePlusChartHelper } from "./helper/sparkline-plus-chart-helper.service";
import { BoxPlotChartHelper } from "./helper/box-plot-chart-helper.service";
import { BulletChartHelper } from "./helper/bullet-chart-helper.service";
import { CandlestickBarChartHelper } from "./helper/candlestick-bar-chart-helper.service";

@NgModule({
	imports: [NvD3Module],
	declarations: [CapuxChartComponent],
	providers: [
		SimpleChartHelper,
		AreaChartHelper,
		LineChartHelper,
		PieChartHelper,
		DonutChartHelper,
		HistoricalBarChartHelper,
		MultibarChartHelper,
		ScatterChartHelper,
		StackedAreaChartHelper,
		DiscreteBarChartHelper,
		MultibarHorizontalChartHelper,
		OhlcBarChartHelper,
		SparklinePlusChartHelper,
		BoxPlotChartHelper,
		BulletChartHelper,
		CandlestickBarChartHelper
	],
	exports: [CapuxChartComponent, NvD3Module]
})
export class ChartModule {
}
