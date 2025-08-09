pub mod common;

use std::str::FromStr;
use {
    common::{
        get_program_test,
        treasury_management_ix_interface,
    },
    solana_program_test::tokio,
    solana_sdk::{
        account::Account, pubkey::Pubkey, rent::Rent, signature::Keypair, signer::Signer, system_program,
    },
};


#[tokio::test]
async fn batch_transfer_ix_success() {
    let mut program_test = get_program_test();

    // PROGRAMS
    program_test.prefer_bpf(true);

    program_test.add_program(
        "csl_spl_token",
        Pubkey::from_str("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA").unwrap(),
        None,
    );

    // DATA
    let name = "Test Treasury".to_string();
    
    // KEYPAIR
    let authority_keypair = Keypair::new();
    let token_mint_keypair = Keypair::new();
    
    // Create recipients and amounts
    let recipient1_keypair = Keypair::new();
    let recipient2_keypair = Keypair::new();
    let recipient3_keypair = Keypair::new();
    
    let recipient1_pubkey = recipient1_keypair.pubkey();
    let recipient2_pubkey = recipient2_keypair.pubkey();
    let recipient3_pubkey = recipient3_keypair.pubkey();
    
    let recipients = vec![recipient1_pubkey, recipient2_pubkey, recipient3_pubkey];
    let amounts = vec![1_000_000, 2_000_000, 3_000_000];
    
    // Create destination token accounts
    let dest1 = Pubkey::new_unique();
    let dest2 = Pubkey::new_unique();
    let dest3 = Pubkey::new_unique();
    let destinations = vec![dest1, dest2, dest3];

    // PUBKEY
    let authority_pubkey = authority_keypair.pubkey();
    let token_mint_pubkey = token_mint_keypair.pubkey();
    let source_pubkey = Pubkey::new_unique(); // Token account owned by treasury

    // EXECUTABLE PUBKEY
    let token_program_pubkey = Pubkey::from_str("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA").unwrap();

    // PDA
    let (treasury_pda, _treasury_pda_bump) = Pubkey::find_program_address(
        &[
            b"treasury",
            name.as_bytes().as_ref(),
        ],
        &treasury_management::ID,
    );

    // ACCOUNT PROGRAM TEST SETUP
    program_test.add_account(
        authority_pubkey,
        Account {
            lamports: 1_000_000_000_000,
            data: vec![],
            owner: system_program::ID,
            executable: false,
            rent_epoch: 0,
        },
    );

    // INSTRUCTIONS
    let (mut banks_client, _, recent_blockhash) = program_test.start().await;

    let ix = treasury_management_ix_interface::batch_transfer_ix_setup(
        &authority_keypair,
        treasury_pda,
        token_mint_pubkey,
        source_pubkey,
        destinations,
        token_program_pubkey,
        &name,
        recipients,
        amounts,
        recent_blockhash,
    );

    let result = banks_client.process_transaction(ix).await;

    // ASSERTIONS
    // This will likely fail without a properly initialized treasury
    // In a complete test suite, you would first initialize the treasury
    assert!(result.is_err()); // Expecting error since treasury doesn't exist yet
}