import * as moment from 'moment/moment';

export class XDateUtils {

	static configureXDate(xDate, options): void {
		if (XDateUtils.canConfigureXDate(xDate)) {
			XDateUtils.addXDateSettings(xDate, options);
		} else {
			XDateUtils.removeXDateSettings(options);
		}
	};

	private static canConfigureXDate(xDate) {
		return xDate && xDate.active && xDate.tickFormat && xDate.parseFormat;
	}

	private static addXDateSettings(xDate, options) {
		options.chart.x = function (d) {
			return moment(d.x, xDate.parseFormat).valueOf();
		};
		options.chart.xAxis.tickFormat = function (x) {
			return moment(x).format(xDate.tickFormat);
		};
	}

	private static removeXDateSettings(options) {
		delete options.chart.x;
		if (options.chart.xAxis) {
			delete options.chart.xAxis.tickFormat;
		}
	}
}