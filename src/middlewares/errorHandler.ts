import type { NextFunction, Request, Response } from 'express';
import { logger } from '../logger/logger';

export default (err: Error, req: Request, res: Response, _: NextFunction) => {
    logger.error(err);
    res.status(500).send({ message: 'An unexpected error occurred.' });
};
