

const { Metaplex, keypairIdentity }  =require(   "@metaplex-foundation/js");
const { Connection, clusterApiUrl, Keypair, PublicKey }  =require(  "@solana/web3.js");
const bs58  =require(  'bs58' );


const privateKey = "62RuX2ESjUyzNvb9fKRqy*********BH9pb1HRH4c";
// Set up connection and wallet
const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

// Decode the base58 encoded private key to a Buffer
const secretKeyBuffer = bs58.default.decode(privateKey);

// Create the Keypair from the secret key Buffer
const wallet = Keypair.fromSecretKey(secretKeyBuffer);

// Log the public key to verify
//sole.log("Public Key:", wallet.publicKey.toBase58());

// Initialize Metaplex
const metaplex = Metaplex.make(connection)
    .use(keypairIdentity(wallet));
   // .use(bundlrStorage());


///////////////////////////created nft///////////////////////////////////
const createdNft = async()=>{
    const nftMetadata = {
            name: 'My NFT',
            symbol: 'NFT',
            uri: 'http://nft.layerx.cc/metaData/1001.json',  // URL to metadata JSON file
            sellerFeeBasisPoints: 500,  // 5%
            maxSupply: 1000,
            creators:null
        
    };
     // Create NFT transaction
     const transactionBuilder = await metaplex.nfts().create(nftMetadata);
     const  mintAddress  = transactionBuilder.mintAddress.toString();
     console.log(transactionBuilder.mintAddress.toString())

     console.log(`Minted NFT: https://explorer.solana.com/address/${mintAddress}?cluster=devnet`);


}

///////////////////////////给指定钱包mint nft///////////////////////////////////
// 无效方法 /// 启用
const otherMintNft = async(targetWallet)=>{
    const _targetWallet_ = new PublicKey(targetWallet);
    // NFT Metadata
    const nftMetadata = {
        name: 'My NFT',
        symbol: 'NFT',
        uri: 'http://nft.layerx.cc/metaData/1001.json',  // URL to metadata JSON file
        sellerFeeBasisPoints: 500,  // 5%
        creators: null
    };

    // 创建 NFT
    const { nft } = await metaplex.nfts().create({
        ...nftMetadata,
        mintAuthority: wallet,
        updateAuthority: wallet,
        owner: _targetWallet_, // 设置目标钱包为所有者
      });
  
      console.log(`NFT 创建成功！Mint 地址: ${nft.address.toBase58()}`);

}


const transferNft = async(_nftAddress,_fromWallet,_tragetWallet) =>{

    try {
        const mintAddress = new PublicKey(_nftAddress);
        const sourceWallet = new PublicKey(_fromWallet);
        const targetWallet = new PublicKey(_tragetWallet);
        // 获取 NFT 的所有详细信息
            
        const nft = await metaplex.nfts().findByMint({ mintAddress });
        if (!nft) {
            throw new Error('无法找到指定的 NFT');
          }
          console.log(nft.json)
        const mintAddr = nft.mint.address;
        console.log(mintAddr);
        const largestAccounts = await connection.getTokenLargestAccounts( mintAddress );
        const largestAccountInfo = await connection.getParsedAccountInfo(largestAccounts.value[0].address  );
        console.log(_nftAddress  + " 所有者：" + largestAccountInfo.value.data.parsed.info.owner);
        if(largestAccountInfo.value.data.parsed.info.owner != _fromWallet){
            throw new Error('不拥有此NFT，无法转移');
        }
        // 创建转移交易
     const transferTransaction = new Transaction().add(
        metaplex.nfts().builders().transfer({
          nftOrSft: {address:_nftAddress},
          fromOwner: sourceWallet,
          toOwner: targetWallet,
        })
      ); 
        console.log('转移交易:', transferTransaction.serialize());
        
        // 签名并发送交易
        const signature = await connection.sendTransaction(transferTransaction, [wallet]);
        console.log('发送交易签名:', signature);
        
        await connection.confirmTransaction(signature, 'confirmed');
        console.log('确认交易成功！');
      } catch (error) {
        console.error('转移 NFT 时出错:', error);
      }



 
}




const getNft = async(wallet) =>{


    const walletAddress = new PublicKey(wallet);
   
    // 查找钱包地址持有的所有 NFT
    const nfts = await metaplex.nfts().findAllByOwner({ owner: walletAddress });

    if (nfts.length === 0) {
        console.log(`${wallet} 该地址没有持有任何 NFT`);
    } else {
        // 打印每个 NFT 的 Mint 地址
        nfts.forEach((nft, index) => {
          //  console.log(nft)
            console.log(`NFT ${index + 1} Mint地址: ${nft.mintAddress.toBase58()}`);
        });
    }

}


//createdNft();
//otherMintNft("5XVqLcMm76k3mcUPdceRygagvvxQPsMdDQth8Pqa9rRj");
// transferNft(
//     "s5HTAcvnEhiv2p25c4iTuLLqSp9Zvkpw3fr53LRVhpp",
//     "CuHSvAT1JXUNXVmKYiXbGc7dMQVXuhihAMWYBTbqpEq6",
//     "5XVqLcMm76k3mcUPdceRygagvvxQPsMdDQth8Pqa9rRj"
//     )
getNft( "5XVqLcMm76k3mcUPdceRygagvvxQPsMdDQth8Pqa9rRj");

//getNft( "CuHSvAT1JXUNXVmKYiXbGc7dMQVXuhihAMWYBTbqpEq6");