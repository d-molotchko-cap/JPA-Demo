import { Injectable } from '@angular/core';

import { ChartHelper } from '../chart-helper'
import { ChartUtils } from './chart.utils'
import { SimpleChartHelper } from './simple-chart-helper.service'

@Injectable()
export class HistoricalBarChartHelper implements ChartHelper {

	constructor(private simpleChartHelper: SimpleChartHelper) {
	}

	options(dbOptions, microflowVariables) {
		let options = this.simpleChartHelper.options(dbOptions, microflowVariables);

		options.chart.showValues = true;
		options.chart.stacked = true;

		options.chart.xAxis.rotateLabels = 30;
		options.chart.xAxis.showMaxMin = false;

		options.chart.zoom = {
			enabled: true,
			scaleExtent: [1, 10],
			useFixedDomain: false,
			useNiceScale: false,
			horizontalOff: false,
			verticalOff: true,
			unzoomEventType: 'dblclick.zoom'
		};

		return options;
	};

	createData(dbData, microflowVariables) {
		let _dataModel = ChartUtils.resolveValue(dbData && dbData[0].bindingObject, microflowVariables),
			values = _dataModel && _dataModel.map(it => {
					return {
						x: it[dbData[0].xBinding],
						y: it[dbData[0].yBinding],
						open: it[dbData[0].openBinding],
						close: it[dbData[0].closeBinding],
						high: it[dbData[0].highBinding],
						low: it[dbData[0].lowBinding]
					};
				}) || null;

		return [{
			key: ChartUtils.resolveValue(dbData[0].key, microflowVariables),
			color: ChartUtils.resolveValue(dbData[0].color, microflowVariables),
			values: values
		}];
	}
}