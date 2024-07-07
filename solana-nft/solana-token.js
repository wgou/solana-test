

const { Metaplex, keypairIdentity }  =require(   "@metaplex-foundation/js");
const { Connection, clusterApiUrl, Keypair, PublicKey }  =require(  "@solana/web3.js");
const { createInitializeMintInstruction, TOKEN_PROGRAM_ID,MINT_SIZE, getMinimumBalanceForRentExemptMint, createMint } = require( '@solana/spl-token');

const bs58  =require(  'bs58' );


  
  (async () => {


    // Set up connection and wallet
    const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
    
  
    // 5YNmS1R9nNSCDzb5a7mMJ1dwK9uHeAAF4CmPEwKgVWr8
    const feePayer = Keypair.fromSecretKey(
        bs58.default.decode(
        "588FU4PktJWfGfxtzpAAXywSNt74AvtroVzGfKkVN1LwRuvHwKGr851uH8czM5qm4iqLbs1kKoMKtMJG4ATR7Ld2"
      )
    );
  
    // G2FAbFQPFa5qKXCetoFZQEvF9BVvCKbvUZvodpVidnoY
    const alice = Keypair.fromSecretKey(
        bs58.default.decode(
        "4NMwxzmYj2uvHuq8xoqhY8RXg63KSVJM1DXkpbmkUY7YQWuoyQgFnnzn6yo3CMnqZasnNPNuAT2TLwQsCaKkUddp"
      )
    );
  
    // 1) use build-in function
    let mintPubkey = await createMint(
      connection, // conneciton
      feePayer, // fee payer
      alice.publicKey, // mint authority
      alice.publicKey, // freeze authority (you can use `null` to disable it. when you disable it, you can't turn it on again)
      8 // decimals
    );
    console.log(`mint: ${mintPubkey.toBase58()}`);
  
    // or
  
    // 2) compose by yourself
    const mint = Keypair.generate();
    console.log(`mint: ${mint.publicKey.toBase58()}`);
  
    let tx = new Transaction().add(
      // create mint account
      SystemProgram.createAccount({
        fromPubkey: feePayer.publicKey,
        newAccountPubkey: mint.publicKey,
        space: MINT_SIZE,
        lamports: await getMinimumBalanceForRentExemptMint(connection),
        programId: TOKEN_PROGRAM_ID,
      }),
      // init mint account
      createInitializeMintInstruction(
        mint.publicKey, // mint pubkey
        8, // decimals
        alice.publicKey, // mint authority
        alice.publicKey // freeze authority (you can use `null` to disable it. when you disable it, you can't turn it on again)
      )
    );
    console.log(
      `txhash: ${await connection.sendTransaction(tx, [feePayer, mint])}`
    );
  })();