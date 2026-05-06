import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-error-card',
  standalone: true,
  imports: [],
  templateUrl: './error-card.html',
  styleUrl: './error-card.css',
})
export class ErrorCard {
  message = input.required<string>();
  buttonText = input<string>('Tentar novamente');
  
  retry = output<void>();

  onRetry(): void {
    this.retry.emit();
  }
}
