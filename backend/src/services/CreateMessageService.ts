import prismaClient from "../prisma";
import { io } from "../app";

export class CreateMessageService {
  async execute(text: string, user_id: string) {

    //  Criar mensagem e, simultaneamente, obter a mensagem e os dados do usuário
    //  que publicou está mensagem.
    const message = await prismaClient.message.create({
      data: { text, user_id },
      include: { user: true }
    });

    const key = "new_message";
    const msgSocket = {
      text: message.text,
      user_id: message.user_id,
      created_at: message.created_at,
      user: {
        name: message.user.name,
        avatar_url: message.user.avatar_url
      }
    }

    io.emit(key, msgSocket);

    return message;
  }
}