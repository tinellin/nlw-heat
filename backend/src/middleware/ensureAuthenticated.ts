import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken"

interface IPayload {
  sub: string
}

export function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
  const authToken = req.headers.authorization;

  //Verificar se o token é undefined
  if (!authToken) {
    return res.status(401).json({ errorCode: "token.invalid" });
  }

  //Bearer (token)
  //Separar a string por espaço, para pegar apenas o token e eliminar o Bearer
  const [, token] = authToken.split(" ");

  //Verificar se o token é VÁLIDO e NÃO está EXPIRADO
  //Caso a verificação falhe, lança um erro que será tratado
  try {
    const { sub } = verify(token, process.env.JWT_SECRET || "") as IPayload;

    //sub: id (uuid) do usuário
    req.user_id = sub;

    return next();
  } catch (err) {
    return res.status(401).json({ errorCode: "token.expired" })
  }
}