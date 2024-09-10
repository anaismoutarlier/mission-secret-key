const express = require("express");
const http = require("http");
const uid2 = require("uid2");
const moment = require("moment");

const app = express();
const server = http.createServer(app);

const USER_DATA = require("./user.data");
const MESSAGES = require("./messages.map");
const TEACHER_TOKEN = process.env.TEACHER_TOKEN;
const FAKE_SECRET_KEY = process.env.FAKE_SECRET_KEY;
const REAL_SECRET_KEY = process.env.REAL_SECRET_KEY;

let tokens = [];
let currentGame = null;

/**
 * Middleware to check if game is currently in progress.
 * @param {} _
 * @param {*} res
 * @param {*} next
 * @returns
 */
const isGameInProgress = (_, res, next) => {
  if (!currentGame)
    return res
      .status(418)
      .json({ result: false, message: MESSAGES.noCurrentGame });
  else next();
};

app.get("/health-check", (_, res) => {
  res.sendStatus(200);
});

app.post("/start", (req, res) => {
  const auth = req.headers.authorization || "";
  const [type, token] = auth.split(" ");
  if (!["Bearer", "Token"].includes(type) || token !== TEACHER_TOKEN)
    return res.json({
      result: false,
      message: MESSAGES.unauthorizedStart,
    });
  if (currentGame)
    return res
      .status(400)
      .json({ result: false, message: MESSAGES.gameOngoing });
  currentGame = setTimeout(() => {
    console.log("Game over.");
    tokens = [];
    clearTimeout(currentGame);
    currentGame = null;
  }, 600000);
  res.json({
    result: true,
    message: MESSAGES.gameStart(moment().add(10, "minutes").format("HH[h]mm")),
  });
});

app.post("/end", isGameInProgress, (req, res) => {
  const auth = req.headers.authorization || "";
  const [type, token] = auth.split(" ");
  if (!["Bearer", "Token"].includes(type) || token !== TEACHER_TOKEN)
    return res.json({
      result: false,
      message: MESSAGES.unauthorizedEnd,
    });
  if (currentGame) {
    tokens = [];
    clearTimeout(currentGame);
    currentGame = null;
  }
  res.json({ result: true });
});

app.get("/agent-id", (_, res) => {
  res.json({
    result: true,
    id: USER_DATA.id,
    message: MESSAGES.getId,
  });
});

app.get("/access-token", isGameInProgress, (_, res) => {
  const token = {
    value: uid2(32),
    expiresAt: moment().add(3, "minutes").toDate(),
  };
  tokens.push(token);
  res.json({
    result: true,
    token: token.value,
    message: MESSAGES.getToken,
  });
});

app.get("/secret-vault", isGameInProgress, (req, res) => {
  const auth = req.headers.authorization || "";
  if (!auth)
    return res.status(401).json({
      result: false,
      message: MESSAGES.noHeader,
    });
  const [type, token] = auth.split(" ") || [];
  if (type !== "Token" || !token)
    return res.status(401).json({
      result: false,
      message: MESSAGES.wrongHeaderFormat,
    });
  if (token === USER_DATA.id)
    return res.status(400).json({
      result: false,
      secretKey: FAKE_SECRET_KEY,
      message: MESSAGES.getKey,
    });
  const myToken = tokens.find(el => el.value === token);
  if (!myToken)
    return res.status(401).json({
      result: false,
      message: MESSAGES.invalidToken,
    });
  if (moment().isAfter(moment(myToken.expiresAt)))
    return res.status(403).json({
      result: false,
      message: MESSAGES.invalidToken,
    });
  res.json({
    result: true,
    message: MESSAGES.getKey,
    secretKey: REAL_SECRET_KEY,
  });
});

app.get("/secret-agent/:id", isGameInProgress, (req, res) => {
  const { id } = req.params;
  if (id !== USER_DATA.id)
    return res.status(404).json({ result: false, message: MESSAGES.invalidId });
  res.json({
    result: true,
    message: MESSAGES.getUserInfo,
    user: USER_DATA,
  });
});

app.get("/check-secret-key/:secretKey", isGameInProgress, (req, res) => {
  const { secretKey } = req.params;

  if (secretKey === REAL_SECRET_KEY)
    return res.json({
      result: true,
      message: MESSAGES.validKey,
    });
  else if (secretKey === FAKE_SECRET_KEY)
    return res.status(401).json({
      result: false,
      message: MESSAGES.invalidKey,
    });
  else
    res.status(400).json({
      result: false,
      message: MESSAGES.unknownKey,
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server listening on port ${PORT}.`));
