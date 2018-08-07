import { Component, OnInit, OnChanges, Input, Output, AfterViewInit, EventEmitter, ViewChild } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit, OnChanges {
  @Input() id: String = null;
  @Input() features: any;
  @Input() columns: any[];
  @Input() rows: any[];
  @Output() changeRows: EventEmitter<any[]> = new EventEmitter<any[]>();
  @Input() pagination: any = null;
  @Input() nested: any = null;
  @Input() header: any = null;
  @Input() footer: any = null;
  @Input() lang: String = 'en';
  @Input() style: String = null;
  @Input() cssClass: String = null;

  private expanded: any = {};
  private totals: any = {};
  private footerTotals: any[] = [];
  private footerColSpan: number;
  @ViewChild('table') table: DatatableComponent;

  ngOnInit() {
  }

  ngOnChanges() {
  }

  removeRow(rowIndex) {
    this.rows.splice(rowIndex, 1);
    this.rows = [...this.rows];
    this.changeRows.emit(this.rows);
  }

  addRow(index) {
    if (!!index) {
      this.rows.splice(index, 0, {});
    } else {
      this.rows.push({});
    }
    this.rows = [...this.rows];
    this.changeRows.emit(this.rows);
  }

  updateValue(event, cell, rowIndex) {
    this.rows[rowIndex][cell] = event.target.value;
    this.rows = [...this.rows];
    this.changeRows.emit(this.rows);
  }

}
