import { Injectable } from '@angular/core';

import { ChartHelper } from '../chart-helper'
import { OhlcBarChartHelper } from './ohlc-bar-chart-helper.service'

@Injectable()
export class CandlestickBarChartHelper implements ChartHelper {

	constructor(private ohlcBarChartHelper: OhlcBarChartHelper) {
	}

	options(dbOptions, microflowVariables) {
		return this.ohlcBarChartHelper.options(dbOptions, microflowVariables);
	};

	createData(dbData, microflowVariables) {
		return this.ohlcBarChartHelper.createData(dbData, microflowVariables);
	}
}