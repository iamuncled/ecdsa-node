const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "0409c728633078767eb8f232687fd8aeb5f8f0b1bbeb779c17ce3d51fd7a763375dce65d072555552da24ab3b2ff49a92f8b56e48ce36ce0baf95c593cad8173c7": 100,
  "04fbfed86ba25f2c2714d84a0501c2713275a61999f08483dd44eee132cebb4b4a6f056f059ae94c2671d4c0d535b171b80e7e1e40f91f18015912726575652ae0": 50,
  "046d8bb863c71ea3f0f171ed1dbaad16b02ae262cc5c04fff9b4bd0f2dba8ce7b704c70b1cfe24557a8fefd5c8a7326c6f57d27da09aaac0c39e356a79463f15b3": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
