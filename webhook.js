import express from "express";
import crypto from "crypto";
import { exec } from "child_process";

const app = express();
app.use(express.json());

const secret = "mysecret123";

function verifySignature(req) {
  const signature = req.headers['x-hub-signature-256'];
  const hmac = crypto.createHmac('sha256', secret);
  const digest = 'sha256=' + hmac.update(JSON.stringify(req.body)).digest('hex');
  return signature === digest;
}

app.post(['/git-webhook', '/git-webhook/'], (req, res) => {
  if (!verifySignature(req)) {
    res.status(403).send("Forbidden");
    return;
  }

  exec("cd /var/www/COMP4537 && git pull origin main", (err, stdout, stderr) => {
    if (err) {
      console.error(err);
      res.status(500).send("Pull failed");
      return;
    }
    console.log(stdout);
    res.status(200).send("Pull successful");
  });
});
// comment flex
app.listen(3001, () => console.log("Webhook listener running on port 3001"));