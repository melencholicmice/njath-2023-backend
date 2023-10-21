import express from "express";
import cors from "cors";
import * as crypto from "crypto";

const app = express();

app.use(cors());

app.use(express.json());

var creds = [];

app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).send("Something broke 💩");
});

app.listen(8080, () => {
	console.log("Server is running on port 8080");
});

async function getHash(hash) {
	return crypto.webcrypto.subtle
		.digest("SHA-256", new TextEncoder().encode(hash))
		.then((result) => Array.from(new Uint8Array(result)))
		.then((result) => result.map((b) => b.toString(16).padStart(2, "0")).join(""))
		.then((result) => {
			return result;
		});
}

app.post("/auth", async (req, res) => {
	const pair = req.body;
	getHash(pair.hash).then((result) => {
		if (creds.find((cred) => cred.id == pair.id && cred.hash === result)) res.status(200).send("Correct");
		else res.status(401).send("Incorrect");
	});
});

app.post("/register", async (req, res) => {
	const list = req.body;
	console.log(list.hash);
	if (creds.find((cred) => cred.id == list.id || creds.phone == list.phone)) res.status(409).send("Already Exists");
	else {
		getHash(list.hash).then((result) => {
			console.log(result);
			creds = [...creds, { ...list, hash: result }];
			console.log(creds);
			res.status(201).send("Registered");
		});
	}
});
