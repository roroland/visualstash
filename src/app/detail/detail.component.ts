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
    void this.runDialogTransition(() => this.dialog.nativeElement.showModal());
  }
  close(): void {
    this.runDialogTransition(() => this.dialog.nativeElement.close())
      .catch(() => void 0)
      .finally(() => this.afterClosed.emit());
  }

  showSpinner(): void {
    this.image = '';
  }

  private runDialogTransition(action: () => void): Promise<void> {
    const doc = document as Document & {
      startViewTransition?: (callback: () => void) => {
        finished: Promise<void>;
      };
    };

    if (doc.startViewTransition) {
      const transition = doc.startViewTransition(() => action());
      return transition.finished;
    }

    action();
    return Promise.resolve();
  }
}
