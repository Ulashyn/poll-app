import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

export enum toastTypes {
  INFO = 'info', SUCCESS = 'success', WARN = 'warn', ERROR = 'error'
}

export interface IToastParam {
  disableTimeOut?: boolean;
  message?: string;
  status?: toastTypes;
  timeout?: number;
  title?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(
    private messageService: MessageService
  ) { }

  showToast({
    disableTimeOut = false,
    message = '',
    status = toastTypes.ERROR,
    timeout = 3000,
    title = ''
  }: IToastParam = {}): void {
    this.messageService.add({
      severity: status,
      summary: title,
      detail: message,
      sticky: disableTimeOut,
      life: timeout
    });
  }
}
