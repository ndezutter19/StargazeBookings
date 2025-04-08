import { Request, Response, NextFunction } from 'express';

export const checkRole = (requiredRole: string) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (req.user?.role !== requiredRole) {
      res.status(403).json({ message: 'Access denied: insufficient permissions' });
      return;
    }

    next();
  };
};
