import { Observable } from '../helpers/observable.js';

export const alerts$ = new Observable();

export function showError(error) {
  alerts$.next({ type: 'error', message: error });
}
