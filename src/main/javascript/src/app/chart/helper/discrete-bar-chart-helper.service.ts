import { Injectable } from '@angular/core';

import { ChartHelper } from '../chart-helper'
import { ChartUtils } from './chart.utils'
import { SimpleChartHelper } from "./simple-chart-helper.service";

@Injectable()
export class DiscreteBarChartHelper implements ChartHelper {

	constructor(private simpleChartHelper: SimpleChartHelper) {
	}

	options(dbOptions, microflowVariables) {
		return this.simpleChartHelper.options(dbOptions, microflowVariables);
	};

	createData(dbData, microflowVariables) {
		let _dataModel = ChartUtils.resolveValue(dbData[0].bindingObject, microflowVariables);
		let values = _dataModel && _dataModel.map(it => {
				return {
					x: it[dbData[0].labelBinding],
					y: it[dbData[0].valueBinding]
				};
			}) || null;

		return [{
			key: ChartUtils.resolveValue(dbData[0].key, microflowVariables),
			values: values
		}];
	}
}