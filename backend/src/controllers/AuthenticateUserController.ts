import { Request, Response } from "express";
import { AuthenticateUserService } from "../services/AuthenticateUserService";
export class AuthenticateUserController {
  async handle(req: Request, res: Response) {
    const { code } = req.body;

    //Obter se a requisição está vindo do App ou do Web
    const userAgent = req.headers["user-agent"] || "error";
    const [host] = userAgent?.split("/")

    const service = new AuthenticateUserService;

    try {
      const result = await service.execute(code, host);
      return res.json(result);
    } catch (err: any) {
      return res.json({ error: err.message, message: "Acesso não autorizado!" })
    }
  }
}