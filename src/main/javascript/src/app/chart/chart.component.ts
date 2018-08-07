import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { ChartService } from './chart.service'

@Component({
	selector: 'capux-chart',
	template: "<nvd3 [options]='options' [data]='data'></nvd3>",
	providers: [ChartService]
})
export class CapuxChartComponent implements OnInit, OnDestroy {

	@Input() dbOptions;
	@Input() dbData;
	@Input() microflowVariables;

	private options;
	private data;

	private oldMicroflowVariablesAsString: string;
	private updater: Subscription;

	constructor(private chartService: ChartService) {
	}

	ngOnInit() {
		let timer = interval(2000);
		this.updater = timer.subscribe(() => this.updateIfNeeded());
	}

	ngOnDestroy() {
		this.updater.unsubscribe();
	}

	private updateIfNeeded() {
		if (this.isDiffer()) {
			this.oldMicroflowVariablesAsString = JSON.stringify(this.microflowVariables);
			this.refresh();
		}
	}

	private isDiffer(): boolean {
		return this.oldMicroflowVariablesAsString !== JSON.stringify(this.microflowVariables);
	}

	private refresh() {
		this.options = this.chartService.options(this.dbOptions, this.microflowVariables);
		this.data = this.chartService.createData(this.dbOptions.type, this.dbData, this.microflowVariables);
	}
}
