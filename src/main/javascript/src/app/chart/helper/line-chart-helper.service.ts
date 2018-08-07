import { Injectable } from '@angular/core';

import { ChartHelper } from '../chart-helper'
import { SimpleChartHelper } from './simple-chart-helper.service'

@Injectable()
export class LineChartHelper implements ChartHelper {

	constructor(private simpleChartHelper: SimpleChartHelper) {
	}

	options(dbOptions, microflowVariables) {
		return this.simpleChartHelper.options(dbOptions, microflowVariables);
	};

	createData(dbData, microflowVariables) {
		return this.simpleChartHelper.createData(dbData, microflowVariables);
	}
}