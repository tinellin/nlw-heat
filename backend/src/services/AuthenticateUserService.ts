import axios from "axios";
import prismaClient from "../prisma";
import { sign } from "jsonwebtoken"

interface ITokenResponse {
  access_token: string
}

interface IUserResponse {
  id: number,
  login: string,
  name: string
  avatar_url: string,
}

const WEB = "Mozilla";
const MOBILE = "okhttp";

export class AuthenticateUserService {
  async execute(code: string, host: string) {
    let CLIENT, SECRET;

    //Configurar as credenciais a partir do local que está vindo a requisição
    if (host == WEB) {
      CLIENT = process.env.GITHUB_CLIENT_ID_WEB;
      SECRET = process.env.GITHUB_CLIENT_SECRET_WEB;
    } else if (host == MOBILE) {
      CLIENT = process.env.GITHUB_CLIENT_ID_MOBILE;
      SECRET = process.env.GITHUB_CLIENT_SECRET_MOBILE;
    } else
      throw new Error;

    //Recuperar access_token no github
    const url = "https://github.com/login/oauth/access_token";

    const { data } = await axios.post<ITokenResponse>(url, null, {
      params: {
        client_id: CLIENT,
        client_secret: SECRET,
        code,
      },
      headers: {
        "Accept": "application/json"
      }
    })

    //Obter os dados do usuário
    const res = await axios.get<IUserResponse>("https://api.github.com/user", {
      headers: {
        authorization: `Bearer ${data.access_token}`
      }
    })

    const { id, login, name, avatar_url } = res.data;

    //Verificar se o usuário existe
    let user = await prismaClient.user.findFirst({ where: { github_id: id } })

    //Se não existir, cria-lo
    if (!user) {
      user = await prismaClient.user.create({
        data:
          { github_id: id, login, name, avatar_url }
      })
    }

    //Gerar token de acesso (JWT)
    const token = sign(
      {
        user: {
          id: user.id,
          name: user.name,
          avatar_url: user.avatar_url
        },
      },
      process.env.JWT_SECRET || "",
      {
        subject: user.id,
        expiresIn: "1d"
      }
    );

    return { token, user };
  }
}