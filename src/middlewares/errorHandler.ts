import type { NextFunction, Request, Response } from 'express';

export default (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    res.status(500).send({ message: 'An unexpected error occurred.' });
};
