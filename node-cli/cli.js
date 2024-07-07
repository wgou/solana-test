const web3 = require('@solana/web3.js');
const borsh = require('borsh');
const bs58 = require('bs58');

class Greeting {
  counter = 0;
  constructor(fields = { counter: 0 }) {
    if (fields) {
      this.counter = fields.counter;
    }
  }
}

const GreetingSchema = new Map([
  [Greeting, { kind: 'struct', fields: [['counter', 'u32']] }],
]);

const GREETING_SIZE = borsh.serialize(GreetingSchema, new Greeting()).length;

(async () => {
  const connection = new web3.Connection(web3.clusterApiUrl('devnet'), 'confirmed');
  const privateKeyBase58 = '3jMGN4gc1tiieAj6NV8zPQTjUu1b5anFPCUo2mzfdGp9xQ4dJuJBzJ97FmkToyU7UVSYecknjQ6Zu8cA1tKqq1jw';
  const privateKey = bs58.default.decode(privateKeyBase58);
  const wallet = web3.Keypair.fromSecretKey(privateKey);

  const greetingAccount = web3.Keypair.generate();
  const lamports = await connection.getMinimumBalanceForRentExemption(GREETING_SIZE);

  const createGreetingAccountIx = web3.SystemProgram.createAccount({
    fromPubkey: wallet.publicKey,
    lamports,
    newAccountPubkey: greetingAccount.publicKey,
    programId: new web3.PublicKey('3uo4qP7aCV1hDDY7k1gbUjMcyxvuF9mnvUVqZVf96uYG'),
    space: GREETING_SIZE,
  });

  const instructionData = borsh.serialize(GreetingSchema, new Greeting({ counter: 42 }));
  
  const greetIx = new web3.TransactionInstruction({
    keys: [
      { pubkey: greetingAccount.publicKey, isSigner: false, isWritable: true },
    ],
    programId: new web3.PublicKey('3uo4qP7aCV1hDDY7k1gbUjMcyxvuF9mnvUVqZVf96uYG'),
    data: Buffer.from(instructionData),
  });

  const tx = new web3.Transaction().add(createGreetingAccountIx, greetIx);
  
  const txHash = await web3.sendAndConfirmTransaction(connection, tx, [wallet, greetingAccount]);
  console.log(`Transaction hash: ${txHash}`);

  const accountInfo = await connection.getAccountInfo(greetingAccount.publicKey);
  const deserializedAccountData = borsh.deserialize(GreetingSchema, Greeting, accountInfo.data);
  console.log(`Greeting counter: ${deserializedAccountData.counter}`);
})();
