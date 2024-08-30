import { Request, Response, NextFunction } from 'express';
import { Database, ExpressRouteFunc } from '../types';
import { getDatabase } from '../service-injection';
import { createCustomerService } from './customer-service';

export function createCustomerHandler(
  database: Database = getDatabase(),
): ExpressRouteFunc {
  return async function (req: Request, res: Response, next: NextFunction) {
    const { customer_code } = req.params;
    const { measure_type } = req.query;

    const measure_type_str =
      typeof measure_type === 'string' ? measure_type : '';

    try {
      const response = await createCustomerService(
        customer_code,
        measure_type_str.toUpperCase(),
        database,
      );

      res.json(response);
    } catch (err) {
      next(err);
    }
  };
}
