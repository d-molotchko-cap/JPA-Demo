import { Injectable } from '@angular/core';

import { ChartHelper } from '../chart-helper'
import { ChartUtils } from './chart.utils'
import { PieChartHelper } from './pie-chart-helper.service'

@Injectable()
export class DonutChartHelper implements ChartHelper {

	constructor(private pieChartHelper: PieChartHelper) {
	}

	options(dbOptions, microflowVariables) {
		let options: any = {
			chart: {
				type: 'pieChart',
				height: ChartUtils.DEFAULT_HEIGHT,
				donut: true,
				showLabels: true,
				duration: 500,
				labelSunbeamLayout: dbOptions.labelSunbeamLayout
			}
		};

		options.chart.title = ChartUtils.resolveValue(dbOptions.title, microflowVariables);

		return options;
	};

	createData(dbData, microflowVariables) {
		return this.pieChartHelper.createData(dbData, microflowVariables);
	}
}