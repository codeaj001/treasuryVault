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
async fn initialize_treasury_ix_success() {
    let mut program_test = get_program_test();

    // PROGRAMS
    program_test.prefer_bpf(true);

    // DATA
    let name = "Test Treasury".to_string();
    let threshold: u8 = 2;
    let admin_limit: u64 = 1_000_000_000;
    let treasurer_limit: u64 = 500_000_000;
    let contributor_limit: u64 = 100_000_000;
    let reset_period: u64 = 604800; // Weekly
    let auto_stake: bool = true;
    let stake_target_percentage: u8 = 50;

    // KEYPAIR
    let authority_keypair = Keypair::new();
    let signer1_keypair = Keypair::new();
    let signer2_keypair = Keypair::new();
    let signer3_keypair = Keypair::new();

    // PUBKEY
    let authority_pubkey = authority_keypair.pubkey();
    let signer1_pubkey = signer1_keypair.pubkey();
    let signer2_pubkey = signer2_keypair.pubkey();
    let signer3_pubkey = signer3_keypair.pubkey();

    // Create signers array
    let signers = vec![signer1_pubkey, signer2_pubkey, signer3_pubkey];

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

    let ix = treasury_management_ix_interface::initialize_treasury_ix_setup(
        &authority_keypair,
        treasury_pda,
        system_program_pubkey,
        &name,
        &signers,
        threshold,
        admin_limit,
        treasurer_limit,
        contributor_limit,
        reset_period,
        auto_stake,
        stake_target_percentage,
        recent_blockhash,
    );

    let result = banks_client.process_transaction(ix).await;

    // ASSERTIONS
    assert!(result.is_ok());
}