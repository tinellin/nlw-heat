import { Request, Response } from "express";
import { CreateMessageService } from "../services/CreateMessageService";

export class CreateMessageController {
  async handle(req: Request, res: Response) {
    const { text } = req.body;

    const service = new CreateMessageService;
    const result = await service.execute(text, req.user_id);

    return res.json(result);
  }
}
