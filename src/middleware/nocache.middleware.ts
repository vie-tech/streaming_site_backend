import { Request, Response, NextFunction } from "express"
export const nocache = (req:Request, res:Response, next:NextFunction)=>{
   res.header('Cache-control', 'private, no-cache, no-store, must-revalidate')
   res.header('Expires', '-1')
   res.header('Pragma', 'no-cache')
   next()
}


