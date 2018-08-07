import { Injectable } from '@angular/core';

import { ChartHelper } from '../chart-helper'
import { ChartUtils } from './chart.utils'

@Injectable()
export class PieChartHelper implements ChartHelper {

	options(dbOptions, microflowVariables) {
		let options = ChartUtils.defaultOptions(dbOptions.type);

		options.chart.showLabels = true;
		options.chart.labelThreshold = 0.01;
		options.chart.labelSunbeamLayout = dbOptions.labelSunbeamLayout;

		return options;
	};

	createData(dbData, microflowVariables) {
		let _dataModel = ChartUtils.resolveValue(dbData && dbData[0].bindingObject, microflowVariables);
		return _dataModel && _dataModel.map(it => {
				return {
					x: it[dbData[0].labelBinding],
					y: it[dbData[0].valueBinding]
				};
			}) || null;
	}
}