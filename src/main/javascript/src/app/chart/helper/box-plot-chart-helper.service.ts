import { Injectable } from '@angular/core';

import { ChartHelper } from '../chart-helper'
import { ChartUtils } from './chart.utils'
import { SimpleChartHelper } from "./simple-chart-helper.service";

@Injectable()
export class BoxPlotChartHelper implements ChartHelper {

	constructor(private simpleChartHelper: SimpleChartHelper) {
	}

	options(dbOptions, microflowVariables) {
		let options = this.simpleChartHelper.options(dbOptions, microflowVariables);
		options.chart.maxBoxWidth = 75;
		options.chart.type = 'boxPlotChart';
		return options;
	};

	createData(dbData, microflowVariables) {
		let _dataModel = ChartUtils.resolveValue(dbData && dbData[0].bindingObject, microflowVariables),
			_value = _dataModel && _dataModel.map(it => {
					return {
						label: it[dbData[0].label],
						values: {
							Q1: it[dbData[0].q1],
							Q2: it[dbData[0].q2],
							Q3: it[dbData[0].q3],
							whisker_low: it[dbData[0].whiskerLow],
							whisker_high: it[dbData[0].whiskerHigh],
							outliers: it[dbData[0].outliers]
						}
					};
				}) || [];
		return _value;
	}
}