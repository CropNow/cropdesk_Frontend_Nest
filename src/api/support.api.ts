/**
 * Support API endpoints
 * Handles raising support tickets
 */

import apiClient from './client';

export interface RaiseTicketData {
  category: string;
  subject: string;
  message: string;
}

export const supportAPI = {
  /**
   * Raise a support ticket
   */
  raiseTicket: (data: RaiseTicketData) => 
    apiClient.post('/raiseTicket', data),
};
