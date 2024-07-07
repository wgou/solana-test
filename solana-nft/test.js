
const { Metaplex, keypairIdentity } =require(   "@metaplex-foundation/js");
const { Connection, Keypair, PublicKey , LAMPORTS_PER_SOL } =require( "@solana/web3.js");
const bs58 =require( 'bs58');

const privateKey = "62RuX2ESjUyzNvb9fKRqyy5********pb1HRH4c";
// Set up connection and wallet
const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

// Decode the base58 encoded private key to a Buffer
const secretKeyBuffer = bs58.default.decode(privateKey);

// Create the Keypair from the secret key Buffer
const wallet = Keypair.fromSecretKey(secretKeyBuffer);


// Initialize Metaplex
const metaplex = Metaplex.make(connection)
    .use(keypairIdentity(wallet));
   // .use(bundlrStorage());


const getGas = async()=>{ 
  //const fromKeypair = Keypair.generate()

  // const airdropSignature = await connection.requestAirdrop(
  //   fromKeypair.publicKey,
  //   LAMPORTS_PER_SOL
  // );

  // await connection.confirmTransaction(airdropSignature);

  // const lamportsToSend = 1_000_000;

  // const transferTransaction = new Transaction().add(
  //   SystemProgram.transfer({
  //     fromPubkey: fromKeypair.publicKey,
  //     toPubkey: wallet.publicKey,
  //     lamports: lamportsToSend,
  //   })
  // );

  // await sendAndConfirmTransaction(connection, transferTransaction, [
  //   fromKeypair,
  // ]);



  console.log(`${(await connection.getBalance(wallet.publicKey)) / LAMPORTS_PER_SOL} SOL`);



}


const transferNFT = async (mintAddress, toWallet) => {
    try {
        // 获取 NFT 对象
        const nftOrSft = await metaplex.nfts().findByMint({ mintAddress: new PublicKey(mintAddress) });
        console.log(nftOrSft)

          // 确保是标准的 NFT
    // if (!(nftOrSft instanceof NftWithToken)) {
    //     console.error('The specified mint address is not a standard NFT.');
    //     return;
    // }
        // 转移NFT
        const { response } = await metaplex.nfts().transfer({
            nftOrSft,
            toOwner: new PublicKey(toWallet),
            amount: 1,
        });

        // 确认交易
        await connection.confirmTransaction(response.signature, 'processed');

        console.log(`Transaction confirmed: https://explorer.solana.com/tx/${response.signature}?cluster=devnet`);
    } catch (error) {
        console.error('Error transferring NFT:', error);
    }
};

// 示例使用
const mintAddress = '3T971FezdeMcQLADV4Rp4F9WQX6e9pDJzx4ULiySfXBG'; // NFT 的 Mint 地址
const toWallet = '5XVqLcMm76k3mcUPdceRygagvvxQPsMdDQth8Pqa9rRj'; // 目标钱包地址

//transferNFT(mintAddress, toWallet);
getGas();