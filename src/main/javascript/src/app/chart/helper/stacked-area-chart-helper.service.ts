import { Injectable } from '@angular/core';

import { ChartHelper } from '../chart-helper'
import { SimpleChartHelper } from './simple-chart-helper.service'

@Injectable()
export class StackedAreaChartHelper implements ChartHelper {

	constructor(private simpleChartHelper: SimpleChartHelper) {
	}

	options(dbOptions, microflowVariables) {
		let options = this.simpleChartHelper.options(dbOptions, microflowVariables);

		options.chart.useVoronoi = false;
		options.chart.clipEdge = true;
		options.chart.useInteractiveGuideline = true;

		return options;
	};

	createData(dbData, microflowVariables) {
		return this.simpleChartHelper.createData(dbData, microflowVariables);
	}
}