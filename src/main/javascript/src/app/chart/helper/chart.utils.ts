export class ChartUtils {

	public static DEFAULT_HEIGHT: number = 450;

	static defaultMargin() {
		return {
			top: 20,
			right: 20,
			bottom: 50,
			left: 65
		};
	};

	static defaultOptions(type): any {
		return {
			chart: {
				type: type,
				height: ChartUtils.DEFAULT_HEIGHT,
				margin: this.defaultMargin(),
				duration: 500,
				showValues: true,
				useInteractiveGuideline: true,
				xAxis: {
					axisLabel: 'X Axis'
				},
				yAxis: {
					axisLabel: 'Y Axis',
					axisLabelDistance: -10
				}
			}
		};
	};

	static resolveValue(value, microflowVariables) {
		var _result = null;
		if (value !== undefined && value !== null) {
			let without_$ = value.startsWith('$')? value.substring(1): value,
				_pathArr = without_$.split(/[\.-]/),
				pathLength = _pathArr && _pathArr.length || 0;

			if (_pathArr && pathLength) {
				var _context = microflowVariables;
				_pathArr.forEach(function(_path, i) {
					var _data = _context[_path];
					if (_data) {
						if (i == pathLength - 1) {
							_result = _data;
						} else {
							_context = _data;
						}
					}
				});
			}
		}
		return _result;
	};
}