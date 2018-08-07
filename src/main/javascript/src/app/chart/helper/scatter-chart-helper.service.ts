import { Injectable } from '@angular/core';

import { ChartHelper } from '../chart-helper'
import { SimpleChartHelper } from './simple-chart-helper.service'

@Injectable()
export class ScatterChartHelper implements ChartHelper {

	constructor(private simpleChartHelper: SimpleChartHelper) {
	}

	options(dbOptions, microflowVariables) {
		let options = this.simpleChartHelper.options(dbOptions, microflowVariables);

		options.chart.showDistX = true;
		options.chart.showDistY = true;

		options.chart.tooltipContent = function (key) {
			return '<h3>' + key + '</h3>';
		};

		return options;
	};

	createData(dbData, microflowVariables) {
		return this.simpleChartHelper.createData(dbData, microflowVariables);
	}
}