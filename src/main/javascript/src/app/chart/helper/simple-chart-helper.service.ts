import { Injectable } from '@angular/core';

import { ChartHelper } from '../chart-helper'
import { ChartUtils } from './chart.utils'

@Injectable()
export class SimpleChartHelper implements ChartHelper {

	options(dbOptions, microflowVariables) {
		let options = ChartUtils.defaultOptions(dbOptions.type);

		options.chart.xAxis.axisLabel =
			ChartUtils.resolveValue(dbOptions.xAxisLabel, microflowVariables) || options.chart.xAxis.axisLabel;

		options.chart.yAxis.axisLabel =
			ChartUtils.resolveValue(dbOptions.yAxisLabel, microflowVariables) || options.chart.yAxis.axisLabel;

		return options;
	};

	createData(dbData, microflowVariables) {
		return dbData.map(dbItem => this.createChartItem(dbItem, microflowVariables));
	}

	private createChartItem(dbItem, microflowVariables) {
		return {
			key: ChartUtils.resolveValue(dbItem.key, microflowVariables),
			color: ChartUtils.resolveValue(dbItem.color, microflowVariables),
			values: this.createChartValues(dbItem, microflowVariables)
		};
	}

	private createChartValues(dbItem, microflowVariables) {
		let _dataModel = ChartUtils.resolveValue(dbItem && dbItem.bindingObject, microflowVariables);
		return _dataModel && _dataModel.map(it => {
				return {
					x: it[dbItem.xBinding],
					y: it[dbItem.yBinding]
				};
			}) || null;
	}
}