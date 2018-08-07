import { Injectable } from '@angular/core';

import { ChartHelper } from '../chart-helper'
import { ChartUtils } from './chart.utils'

@Injectable()
export class SparklinePlusChartHelper implements ChartHelper {

	options(dbOptions, microflowVariables) {
		return ChartUtils.defaultOptions(dbOptions.type);
	};

	createData(dbData, microflowVariables) {
		let _dataModel = ChartUtils.resolveValue(dbData && dbData[0].bindingObject, microflowVariables);
		return _dataModel && _dataModel.map(it => {
				return {
					x: it[dbData[0].xBinding],
					y: it[dbData[0].yBinding]
				};
			});
	}
}