module.exports = {
  unauthorizedStart: "Ohoh vous n'êtes pas authorisé à relancer une partie!",
  unauthorizedEnd:
    "Non non vous n'avait pas le droit de mettre fin à la partie.",
  noCurrentGame: "Oups, il n'y a pas de jeu en cours.",
  gameOngoing: "Un jeu est déjà lancé.",
  gameStart: time =>
    `Le jeu commence maintenant! Vous avez jusqu'à ${time} pour découvrir la clé secrète. Rappelez-vous, agent : le temps est votre ennemi, et chaque seconde compte... 💣`,
  getId:
    "Votre identifiant d'agent secret est révélé! Utilisez-le pour prouver votre identité... mais souvenez-vous, ce n'est pas une clé magique. 🔍",
  getToken:
    "Voici votre token d'accès ! ⚡ Soyez rapide! Il expirera dans 3 minutes. Vous pouvez toujours revenir ici si vous avez besoin d'un nouveau token. 🔑",
  noHeader:
    "Je ne vous reconnais pas ! Envoie-moi un header avec votre authorization. 🕵️ Indice: Utilisez 'Authorization: Bearer <value>' pour passer.",
  wrongHeaderFormat:
    "Oups! Le header n'est pas formatté correctement. 🕵️ Indice: Utilisez 'Authorization: Bearer <value>' pour passer.",
  getKey: "Voici une clé secrète. Mais est-ce la bonne ? 🤔",
  invalidToken:
    "Ce token n'est pas valide 😕... Essayez d'en obtenir un nouveau !",
  expiredToken:
    "Oups! Ce token est expiré. ⏳ Les tokens expirent pour des raisons de sécurité. Obtenez-en un nouveau !",
  invalidId: "Etes-vous sûr d'avoir le bon ID ?",
  getUserInfo:
    "Agent identifié : voici ces informations publiques. 👤 Vous avez fait un bon choix ! Mais pour accéder aux secrets, vous devrez prouver votre authenticité avec un token valide. 💡",
  validKey:
    "Waouh! Vous étes vraiment un wizard de l'authentification. Mettez une 🔑 dans le chat pour encourager les autres.",
  invalidKey:
    "Oups! Vous avez trouver une clé, mais pas la bonne . . . Réssayez!",
  unknownKey:
    "Eh bien, vous avez trouvé quelque chose, mais ce n'est ni la clé secrète ni une clé fausse ! Essayez encore, peut-être que la clé est cachée ailleurs… 🔍😜",
};
