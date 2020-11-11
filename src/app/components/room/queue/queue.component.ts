import {Component, Input, OnInit} from '@angular/core';
import {QueueService} from './queue.service';
import {Media} from '../../../clases/media';

@Component({
  selector: 'app-queue',
  templateUrl: './queue.component.html',
  styleUrls: ['./queue.component.css']
})
export class QueueComponent implements OnInit {
  public p = 1;
  @Input() videos: Media[];
  constructor(public queueService: QueueService) { }
  ngOnInit(): void {
  }
  cerrarModal(): void{
    this.queueService.cerrarModal();
  }

}
