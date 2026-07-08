import type { Request, Response } from 'express';
import { ApiResponse } from '@common/utils/ApiResponse';
import { BadRequestError } from '@common/errors';
import { PaymentsService } from './payments.service';

/**
 * HTTP layer for payments: parses validated input, delegates to the service,
 * shapes the response. Never touches a gateway SDK directly.
 */
const paymentsService = new PaymentsService();

export class PaymentsController {
  /** Create a gateway order the browser can hand to Checkout. */
  static async createOrder(req: Request, res: Response): Promise<Response> {
    const order = await paymentsService.createOrder(req.body);
    return ApiResponse.created(res, order);
  }

  /** Verify a completed Checkout payment before the client grants access. */
  static async verify(req: Request, res: Response): Promise<Response> {
    const result = await paymentsService.verify(req.body);
    if (!result.verified) {
      throw new BadRequestError('Payment could not be verified');
    }
    return ApiResponse.success(res, result);
  }
}
