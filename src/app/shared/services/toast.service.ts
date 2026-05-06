import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
  duration: number;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private nextId = 0;

  /** Signal-based reactive toast list */
  readonly toasts = signal<Toast[]>([]);

  /**
   * Shows a toast notification.
   */
  show(message: string, type: ToastType = 'info', duration = 4000): void {
    const toast: Toast = {
      id: this.nextId++,
      message,
      type,
      duration,
    };

    this.toasts.update((current) => [...current, toast]);

    // Auto-dismiss
    setTimeout(() => this.dismiss(toast.id), duration);
  }

  success(message: string): void {
    this.show(message, 'success');
  }

  error(message: string): void {
    this.show(message, 'error', 6000);
  }

  warning(message: string): void {
    this.show(message, 'warning', 5000);
  }

  info(message: string): void {
    this.show(message, 'info');
  }

  /**
   * Dismisses a specific toast by ID.
   */
  dismiss(id: number): void {
    this.toasts.update((current) => current.filter((t) => t.id !== id));
  }
}
