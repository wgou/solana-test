use std::str::FromStr;

use solana_sdk::signature::Signer;
use solana_client::rpc_client::RpcClient;
use solana_sdk::signer::keypair::Keypair;
use solana_sdk::transaction::Transaction;
use solana_program::instruction::{AccountMeta, Instruction};
use solana_program::pubkey::Pubkey;

const RPC_ADDR: &str = "https://api.devnet.solana.com";

fn main() {
    let helloworld = Pubkey::from_str("2WEDMfC8N9Q63vjJymAqNA3bskixFTXZNjGGKqjVh5da").unwrap();
    
    let me = Keypair::from_base58_string("3jMGN4gc1tiieAj6NV8zPQTjUu1b5anFPCUo2mzfdGp9xQ4dJuJBzJ97FmkToyU7UVSYecknjQ6Zu8cA1tKqq1jw");
    println!("me is {}", me.pubkey());

    let client = RpcClient::new(RPC_ADDR);

    let account_metas = vec![
        AccountMeta::new(me.pubkey(), true),
    ];

    let instruction = Instruction::new_with_bytes(
        helloworld,
        "hello".as_bytes(),
        account_metas,
    );
    let ixs = vec![instruction];

    let latest_blockhash = client.get_latest_blockhash().unwrap();
    let sig = client.send_and_confirm_transaction(&Transaction::new_signed_with_payer(
        &ixs,
        Some(&me.pubkey()),
        &[&me],
        latest_blockhash,
    )).unwrap();

    println!("tx:{}", sig);
}
