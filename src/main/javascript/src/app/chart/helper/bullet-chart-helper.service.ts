import { Injectable } from '@angular/core';

import { ChartHelper } from '../chart-helper'
import { ChartUtils } from './chart.utils'

@Injectable()
export class BulletChartHelper implements ChartHelper {

	options(dbOptions, microflowVariables) {
		return {
			chart: {
				type: dbOptions.type,
				transitionDuration: 500
			}
		};
	};

	createData(dbData, microflowVariables) {
		let data = {
			title: ChartUtils.resolveValue(dbData[0].title, microflowVariables),
			subtitle: ChartUtils.resolveValue(dbData[0].subtitle, microflowVariables),
			ranges: ChartUtils.resolveValue(dbData[0].ranges, microflowVariables),
			measures: ChartUtils.resolveValue(dbData[0].measures, microflowVariables),
			markers: ChartUtils.resolveValue(dbData[0].markers, microflowVariables)
		};
		if (data &&
			data.ranges && data.ranges.length &&
			data.measures && data.measures.length &&
			data.markers && data.markers.length) {
			return data;
		}
		return {};
	}
}