const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "04c3ea8744f55dc3d3b009899577203df1748ba873aed3244ba9ad22dd686db692adf1613ed1b9938f0611a918d1680e95fb1276c014d8dceb7f027e528a668a72": 100, 
  // private key: ee63bbf9cf64b83530f1129032e88945feafeac5c6ee22aa3f72798828fa773c
  "04bf3927c6a747401f07fa91f354c5944edcadc016d38c049e56cf57afaaa355a0e97b960ee97458f3ae44b343e30c8e393a80b60e3effdc72b27604b98b790385": 50,
  // private key: 264acf759f2199a58f236d4eaa20aff44a4fc8ee5a03d0da551058c27f2f4f75
  "0436d78131a9c630b96753f4b3ed8055f9d210021f6b09595f4ca811ccb30f79e5d44b483c7f1ee83efb2886c498a2e8b6430960dfe073dfa46fdc5490f8361d53": 75,
  // private key: acd6f358789db30c880098128163d9c7cd14d65e542ed3af456a101fb21572e9
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
