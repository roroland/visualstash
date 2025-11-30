import { Component, ViewChild, ElementRef, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent {
  @ViewChild('dialog') dialog!: ElementRef<HTMLDialogElement>;
  @Input() name!: string;
  @Input() image!: string;
  @Output() afterClosed = new EventEmitter<void>();

  open(): void {
    this.dialog.nativeElement.showModal();
  }
  close(): void {
    this.dialog.nativeElement.close();
    this.afterClosed.emit();
  }
}
