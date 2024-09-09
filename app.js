const express = require("express");
const http = require("http");
const uid2 = require("uid2");
const moment = require("moment");

const app = express();
const server = http.createServer(app);

const USER_DATA = require("./user.data");
const teacherToken = require("./teacherToken");

let tokens = [];
let timeout;

app.post("/start", (_, res) => {
  const auth = req.headers.authorization || "";
  const [type, token] = auth.split(" ");
  if (!["Bearer", "Token"].includes(type) || token !== teacherToken.value)
    return res.json({
      result: false,
      message: "Ohoh vous n'êtes pas authorisé à relancer une partie!",
    });
  if (timeout)
    return res
      .status(400)
      .json({ result: false, message: "Un jeu est déjà lancé." });
  timeout = setTimeout(() => {
    console.log("Game over.");
    tokens = [];
  }, 600000);
  res.json({
    result: true,
    message: `Le jeu commence maintenant! Vous avez jusqu'à ${moment()
      .add(10, "minutes")
      .format(
        "HH[h]mm"
      )} pour découvrir la clé secrète. Rappelez-vous, agent : le temps est votre ennemi, et chaque seconde compte... 💣`,
  });
});

app.get("/agent-id", (_, res) => {
  res.json({
    result: true,
    id: USER_DATA.id,
    message:
      "Votre identifiant d'agent secret est révélé! Utilisez-le pour prouver votre identité... mais souvenez-vous, ce n'est pas une clé magique. 🔍",
  });
});

app.get("/access-token", (_, res) => {
  const token = {
    value: uid2(32),
    expiresAt: moment().add(3, "minutes").toDate(),
  };
  tokens.push(token);
  res.json({
    result: true,
    token: token.value,
    message:
      "Voici votre token d'accès ! ⚡ Soyez rapide! Il expirera dans 3 minutes. Vous pouvez toujours revenir ici si vous avez besoin d'un nouveau token. 🔑",
  });
});

app.get("/secret-vault", (req, res) => {
  if (!req.headers.authorization)
    return res.status(401).json({
      result: false,
      message:
        "Je ne vous reconnais pas ! Envoie-moi un header avec votre authorization. 🕵️‍♂️ Indice: Utilisez 'Authorization: Token <votre_token>' pour passer.",
    });
  const [type, token] = req.headers.authorization?.split(" ") || [];
  if (type !== "Token" || !token)
    return res.status(401).json({
      result: false,
      message: "Oups! Le header n'est pas formatté correctement.",
    });
  const myToken = tokens.find(el => el.value === token);
  if (!myToken)
    return res.status(401).json({
      result: false,
      message:
        "Ce token n'est pas valide 😕... Essayez d'en obtenir un nouveau !",
    });
  if (moment().isAfter(moment(myToken.expiresAt)))
    return res.status(403).json({
      result: false,
      message:
        "Oups! Ce token est expiré. ⏳ Les tokens expirent pour des raisons de sécurité. Obtenez-en un nouveau !",
    });
  res.json({
    result: true,
    message:
      "Accès autorisé! 🎉 Félicitations, vous êtes un wizard de l'authentification.",
    secretKey: USER_DATA.secretKey,
  });
});

app.get("/secret-agent/:id", (req, res) => {
  const { id } = req.params;
  if (id !== USER_DATA.id)
    return res
      .status(404)
      .json({ result: false, message: "Etes-vous sûr d'avoir le bon ID ?" });
  res.json({
    result: true,
    message:
      "Utilisateur identifié : voici ces informations publiques. 👤 Vous avez fait un bon choix ! Mais pour accéder aux secrets, vous devrez prouver votre authenticité avec un token valide. 💡",
    user: { username: USER_DATA.username },
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server listening on port ${PORT}.`));
