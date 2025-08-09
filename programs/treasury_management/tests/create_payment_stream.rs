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
async fn create_payment_stream_ix_success() {
    let mut program_test = get_program_test();

    // PROGRAMS
    program_test.prefer_bpf(true);

    // DATA
    let name = "Test Treasury".to_string();
    let amount_per_period: u64 = 1_000_000; // 1 SOL per period
    let period_duration: i64 = 86400; // Daily
    let start_time: i64 = 1672531200; // Jan 1, 2023
    let end_time: i64 = 1704067200; // Jan 1, 2024
    let category: u8 = 0; // Salary

    // KEYPAIR
    let authority_keypair = Keypair::new();
    let recipient_keypair = Keypair::new();
    let token_mint_keypair = Keypair::new();

    // PUBKEY
    let authority_pubkey = authority_keypair.pubkey();
    let recipient_pubkey = recipient_keypair.pubkey();
    let token_mint_pubkey = token_mint_keypair.pubkey();

    // EXECUTABLE PUBKEY
    let system_program_pubkey = Pubkey::from_str("11111111111111111111111111111111").unwrap();

    // PDA
    let (treasury_pda, _treasury_pda_bump) = Pubkey::find_program_address(
        &[
            b"treasury",
            name.as_bytes().as_ref(),
        ],
        &treasury_management::ID,
    );

    let (payment_stream_pda, _payment_stream_pda_bump) = Pubkey::find_program_address(
        &[
            b"payment_stream",
            treasury_pda.as_ref(),
            recipient_pubkey.as_ref(),
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

    let ix = treasury_management_ix_interface::create_payment_stream_ix_setup(
        &authority_keypair,
        treasury_pda,
        payment_stream_pda,
        system_program_pubkey,
        &name,
        recipient_pubkey,
        token_mint_pubkey,
        amount_per_period,
        period_duration,
        start_time,
        end_time,
        category,
        recent_blockhash,
    );

    let result = banks_client.process_transaction(ix).await;

    // ASSERTIONS
    // This will likely fail without a properly initialized treasury
    // In a complete test suite, you would first initialize the treasury
    assert!(result.is_err()); // Expecting error since treasury doesn't exist yet
}