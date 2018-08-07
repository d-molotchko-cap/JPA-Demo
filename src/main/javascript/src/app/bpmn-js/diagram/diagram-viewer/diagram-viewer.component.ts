import {Component, OnInit, OnChanges, Input, SimpleChange, ElementRef, ViewChild} from '@angular/core';
import NavigatedViewer from 'bpmn-js/lib/NavigatedViewer.js';
import {DiagramService} from '../shared/diagram.service';

@Component({
    selector: 'app-diagram-viewer',
    templateUrl: './diagram-viewer.component.html',
    styleUrls: ['./diagram-viewer.component.css']
})
export class DiagramViewerComponent implements OnInit, OnChanges {

    @Input() diagramId: string;
    currentDiagramId: string;
    @Input() nodeId: string;
    @ViewChild('diagramContainer') diagramContainer: ElementRef;

    viewer: any;
    canvas: any;
    overlays: any;
    zoomScroll: any;
    elementRegistry: any;
    eventBus: any;

    constructor(private diagramService: DiagramService) {
    }

    ngOnInit() {
        this.viewer = new NavigatedViewer({
            container: this.diagramContainer.nativeElement
        });
        this.canvas = this.viewer.get('canvas');
        this.overlays = this.viewer.get('overlays');
        this.zoomScroll = this.viewer.get('zoomScroll');
        this.elementRegistry = this.viewer.get('elementRegistry');
        this.eventBus = this.viewer.get('eventBus');
    }

    toMainLayer() {
        this.currentDiagramId = this.diagramId;
        this.renderDiagram(this.diagramId, this.nodeId);
    }

    zoomReset() {
        this.zoomScroll.reset();
    }

    zoomIn() {
        this.zoomScroll.stepZoom(1);
    }

    zoomOut() {
        this.zoomScroll.stepZoom(-1);
    }

    ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
        const diagramKey = changes && changes.diagramId && changes.diagramId.currentValue;
        this.currentDiagramId = diagramKey;
        this.renderDiagram(diagramKey, changes && changes.nodeId && changes.nodeId.currentValue);
    }

    renderDiagram(diagramKey: string, nodeKey: string) {
        this.diagramService.getDiagram(diagramKey).subscribe(resp => {
            this.viewer.importXML(resp, err => {
                if (!err) {
                    //Highlight selected acticity
                    if (nodeKey) {
                        this.canvas.addMarker(nodeKey, 'highlight');
                    }
                    //Show token statistics
                    this.diagramService.getStatistics(diagramKey).subscribe(resp => {
                        resp && resp.length && resp.forEach(statistic => {
                            this.overlays.add(statistic.id, {
                                position: {
                                    top: -22,
                                    left: -26
                                },
                                html: `<div class="token">${statistic.instances}</div>`
                            });
                        });

                        //Add click behavior for call activity (drill into subprocess)
                        const callActivityList = this.elementRegistry.filter(element => {
                            return element.type == "bpmn:CallActivity";
                        });
                        if (callActivityList) {
                            callActivityList.forEach(callActivity => {
                                this.canvas.addMarker(callActivity, 'clicable-visual');
                            });
                            this.eventBus.on("element.click", e => {
                                let element = e.element;
                                if (callActivityList.indexOf(element) > -1) {
                                    const currentDiagramId = element.businessObject && element.businessObject.calledElement;
                                    if (currentDiagramId) {
                                        this.currentDiagramId = currentDiagramId;
                                        this.renderDiagram(currentDiagramId, null);
                                    }
                                }
                            });
                        }
                    });
                }
            });
        });
    }
}
