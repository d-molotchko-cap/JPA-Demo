import { Injectable } from '@angular/core';

import { ChartHelper } from '../chart-helper'
import { ChartUtils } from './chart.utils'

@Injectable()
export class MultibarHorizontalChartHelper implements ChartHelper {

	options(dbOptions, microflowVariables) {
		let options = ChartUtils.defaultOptions(dbOptions.type);

		options.chart.showControls = true;
		options.chart.showValues = true;

		options.chart.xAxis = {
			showMaxMin: false
		};
		options.chart.yAxis = {
			axisLabel: ChartUtils.resolveValue(dbOptions.yAxisLabel, microflowVariables) || 'Values'
		};

		return options;
	};

	createData(dbData, microflowVariables) {
		return dbData.map(dbItem => this.createChartItem(dbItem, microflowVariables));
	}

	private createChartItem(dbItem, microflowVariables) {
		let _dataModel = ChartUtils.resolveValue(dbItem && dbItem.bindingObject, microflowVariables),
			values = _dataModel && _dataModel.map(it => {
					return {
						x: it[dbItem.labelBinding],
						y: it[dbItem.valueBinding]
					};
				}) || null;

		return {
			key: ChartUtils.resolveValue(dbItem.key, microflowVariables),
			values: values
		};
	}
}