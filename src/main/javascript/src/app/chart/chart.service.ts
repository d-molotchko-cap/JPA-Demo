import { Injectable } from '@angular/core';

import { ChartHelper } from './chart-helper'
import { XDateUtils } from './xdate.utils'

import { AreaChartHelper } from "./helper/area-chart-helper.service";
import { LineChartHelper } from "./helper/line-chart-helper.service";
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

@Injectable()
export class ChartService {

	private helpers: { [type: string]: ChartHelper };

	constructor(areaChartHelper: AreaChartHelper,
				lineChartHelper: LineChartHelper,
				pieChartHelper: PieChartHelper,
				donutChartHelper: DonutChartHelper,
				historicalBarChartHelper: HistoricalBarChartHelper,
				multibarChartHelper: MultibarChartHelper,
				scatterChartHelper: ScatterChartHelper,
				stackedAreaChartHelper: StackedAreaChartHelper,
				discreteBarChartHelper: DiscreteBarChartHelper,
				multibarHorizontalChartHelper: MultibarHorizontalChartHelper,
				ohlcBarChartHelper: OhlcBarChartHelper,
				sparklinePlusChartHelper: SparklinePlusChartHelper,
				boxPlotChartHelper: BoxPlotChartHelper,
				bulletChartHelper: BulletChartHelper,
				candlestickBarChartHelper: CandlestickBarChartHelper) {
		this.helpers = {
			areaChart: areaChartHelper,
			lineChart: lineChartHelper,
			pieChart: pieChartHelper,
			donutChart: donutChartHelper,
			historicalBarChart: historicalBarChartHelper,
			multiBarChart: multibarChartHelper,
			scatterChart: scatterChartHelper,
			stackedAreaChart: stackedAreaChartHelper,
			discreteBarChart: discreteBarChartHelper,
			multiBarHorizontalChart: multibarHorizontalChartHelper,
			ohlcBarChart: ohlcBarChartHelper,
			sparklinePlus: sparklinePlusChartHelper,
			boxPlotChart: boxPlotChartHelper,
			bulletChart: bulletChartHelper,
			candlestickBarChart: candlestickBarChartHelper
		};
	}

	private getHelper(type) {
		let helper = this.helpers[type];
		if (helper === undefined) {
			throw new Error('Not implemented yet');
		}
		return helper;
	}

	createData(type, dbData, microflowVariables) {
		let helper = this.getHelper(type);
		return helper.createData(dbData, microflowVariables);
	}

	options(dbOptions, microflowVariables) {
		let helper = this.getHelper(dbOptions.type);
		let options = helper.options(dbOptions, microflowVariables);
		XDateUtils.configureXDate(dbOptions.xDate, options);
		options.chart.duration = 0;
		return options;
	};

}