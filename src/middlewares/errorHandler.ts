import type { NextFunction, Request, Response } from 'express';

export default (err: Error, req: Request, res: Response, _: NextFunction) => {
    console.error(err);
    res.status(500).send({ message: 'An unexpected error occurred.' });
};
