const express = require("express");
const mysql = require("mysql");
const router = express.Router();
const connection = require("../db");
const {
  detectLanguage,
  translateText,
} = require("../utils/translateFunctions");
const { sendMail } = require("../utils/mailFunctions");
const { LANGUAGE_ISO_CODE } = require("../utils/dictionaries");

module.exports = router;

// app.get('/', (req, res) => {
//     res.send('Hello World again!')
//   });

//get all messages
router.get("/", (req, res) => {
  connection.query("SELECT * FROM messages", (err, results) => {
    if (err) {
      console.log(err);
      return res.send(err);
    }

    return res.json({
      messages: results,
    });
  });
});

//get a message by id
router.get("/:id", (req, res) => {
  const { id } = req.params;
  if (!id) {
    // send bad request error
    return res.status(400).send("Bad request. Missing parametres.");
  }

  connection.query(
    `SELECT * FROM messages where entryID = ${mysql.escape(id)}`,
    (err, results) => {
      if (err) {
        console.log(err);
        return res.send(err);
      }

      if (results.length === 0) {
        return res.status(400).json({
          error: "Message not found",
        });
      }

      return res.json({
        messages: results,
      });
    }
  );
});

// insert a new message
router.post("/", (req, res) => {
  const { senderName, senderMail, receiverMail, messageContent } = req.body;

  if (!senderName || !senderMail || !receiverMail || !messageContent) {
    // send bad request error
    return res.status(400).json({
      error: "Bad request. Missing parametres.",
    });
  }

  connection.query(
    `INSERT INTO messages (senderName, senderMail, receiverMail, messageContent) VALUES 
    (${mysql.escape(senderName)},
     ${mysql.escape(senderMail)}, 
     ${mysql.escape(receiverMail)}, 
     ${mysql.escape(messageContent)})`,
    (err, results) => {
      if (err) {
        return res.send(err);
      }

      return res.json({
        results,
      });
    }
  );
});

//delete a message
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  if (!id) {
    // send bad request error
    return res.status(400).send("Bad request. Missing parametres.");
  }

  const queryString = `DELETE FROM messages WHERE entryID = ${mysql.escape(
    id
  )}`;
  connection.query(queryString, (err, results) => {
    if (err) {
      return res.send(err);
    }
    if (results.length === 0) {
      return res.status(404).send("Message not found.");
    }
    return res.json({
      results,
    });
  });
});

// Update message by id
router.put("/:id", (req, res) => {
  const { id } = req.params;
  if (!id) {
    // send bad request error
    return res.status(400).send("Bad request. Missing parametres.");
  }

  const { senderName, senderMail, receiverMail, messageContent } = req.body;

  if (!senderName || !senderMail || !receiverMail || !messageContent) {
    // send bad request error
    return res.status(400).send("Bad request. Missing parametres.");
  }

  const queryString = `UPDATE messages SET senderName = ${mysql.escape(
    senderName
  )}, senderMail = ${mysql.escape(senderMail)}, receiverMail = ${mysql.escape(
    receiverMail
  )}, messageContent = ${mysql.escape(
    messageContent
  )} WHERE entryID = ${mysql.escape(id)}`;
  connection.query(queryString, (err, results) => {
    if (err) {
      return res.send(err);
    }
    if (results.length === 0) {
      return res.status(404).send("Message not found.");
    }
    return res.json({
      results,
    });
  });
});

router.post("/foreign", async (req, res) => {
  const { senderName, senderMail, receiverMail, messageContent, language } =
    req.body;

  if (
    !senderName ||
    !senderMail ||
    !receiverMail ||
    !messageContent ||
    !language
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (!LANGUAGE_ISO_CODE[language] && language !== "ALL") {
    return res.status(400).send("Invalid language!");
  }

  let translationData = {};

  try {
    if (LANGUAGE_ISO_CODE[language]) {
      const translatedText = await translateText(
        messageContent,
        LANGUAGE_ISO_CODE[language]
      );
      translationData.translatedText = translatedText[0];
    } else if (language === "ALL") {
      const availableLanguages = Object.values(LANGUAGE_ISO_CODE);

      const translatedAnswersArray = await Promise.all(
        availableLanguages.map(async (language) => {
          const translatedText = await translateText(messageContent, language);
          return translatedText[0];
        })
      );

      translationData.translatedText = translatedAnswersArray.reduce(
        (acc, curr) => {
          return acc + curr + "\n";
        },
        ""
      );
    } else {
      return res.send("Invalid language");
    }

    sendMail(
      receiverMail,
      senderMail,
      translationData.translatedText,
      `${senderName} has sent you a message. Read it.`
    );

    connection.query(
      `INSERT INTO messages (senderName, senderMail, receiverMail, messageContent) VALUES 
    (${mysql.escape(senderName)},
     ${mysql.escape(senderMail)}, 
     ${mysql.escape(receiverMail)}, 
     ${mysql.escape(messageContent)})`,
      (err, results) => {
        if (err) {
          console.log(err);
          return res.send(err);
        }

        return res.json({
          translationData,
        });
      }
    );
  } catch (err) {
    console.log(err);
    return res.send(err);
  }
});

module.exports = router;
