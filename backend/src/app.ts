import "dotenv/config";
import express from "express";
import { Server } from "socket.io";
import http from "http"
import cors from "cors";

import { router } from "./routes";

const app = express();

app.use(cors());
app.use(express.json());
app.use(router);

const serverHttp = http.createServer(app);

//Habilitando o socket.io
const io = new Server(serverHttp, {
  cors: { origin: "*" }
});

/*
  Toda vez que o usuário acessar o front-end, ele irá se conectar ao socket.io.
  Logo, a função on() ficará ouvindo chamadas de conexão do front-end,
  a partir da "key": connection.
*/
io.on("connection", socket => {
  console.log(`Usuário conectado no socket ${socket.id}`);
})

//Obter código do usuário pelo back-end
app.get("/github", (req, res) => {
  res.redirect(`https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}`);
});

app.get("/signin/callback", (req, res) => {
  const { code } = req.query;
  return res.json(code);
})


export { serverHttp, io }
