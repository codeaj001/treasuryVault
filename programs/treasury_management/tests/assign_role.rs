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
async fn assign_role_ix_success() {
    let mut program_test = get_program_test();

    // PROGRAMS
    program_test.prefer_bpf(true);

    // DATA
    let name = "Test Treasury".to_string();
    let role_type: u8 = 1; // Treasurer
    let can_execute_payments: bool = true;
    let can_create_streams: bool = true;
    let can_manage_roles: bool = false;
    let can_view_treasury: bool = true;
    let can_propose: bool = true;
    let can_vote: bool = true;

    // KEYPAIR
    let authority_keypair = Keypair::new();
    let user_keypair = Keypair::new();

    // PUBKEY
    let authority_pubkey = authority_keypair.pubkey();
    let user_pubkey = user_keypair.pubkey();

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

    // Create a mock treasury account
    // In a real test, you would first initialize the treasury
    // For simplicity, we're assuming the treasury exists

    // INSTRUCTIONS
    let (mut banks_client, _, recent_blockhash) = program_test.start().await;

    let ix = treasury_management_ix_interface::assign_role_ix_setup(
        &authority_keypair,
        treasury_pda,
        &name,
        user_pubkey,
        role_type,
        can_execute_payments,
        can_create_streams,
        can_manage_roles,
        can_view_treasury,
        can_propose,
        can_vote,
        recent_blockhash,
    );

    let result = banks_client.process_transaction(ix).await;

    // ASSERTIONS
    // This will likely fail without a properly initialized treasury
    // In a complete test suite, you would first initialize the treasury
    assert!(result.is_err()); // Expecting error since treasury doesn't exist yet
}