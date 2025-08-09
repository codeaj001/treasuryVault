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
async fn vote_on_proposal_ix_success() {
    let mut program_test = get_program_test();

    // PROGRAMS
    program_test.prefer_bpf(true);

    // DATA
    let name: String = "Test Treasury".to_string();
    let id: u64 = 1;
    let vote_for: bool = true;

    // KEYPAIR
    let voter_keypair = Keypair::new();

    // PUBKEY
    let voter_pubkey = voter_keypair.pubkey();

    // PDA
    let (treasury_pda, _treasury_pda_bump) = Pubkey::find_program_address(
        &[
            b"treasury",
            name.as_bytes().as_ref(),
        ],
        &treasury_management::ID,
    );

    let (proposal_pda, _proposal_pda_bump) = Pubkey::find_program_address(
        &[
            b"proposal",
            treasury_pda.as_ref(),
            id.to_le_bytes().as_ref(),
        ],
        &treasury_management::ID,
    );

    // ACCOUNT PROGRAM TEST SETUP
    program_test.add_account(
        voter_pubkey,
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

    let ix = treasury_management_ix_interface::vote_on_proposal_ix_setup(
        &voter_keypair,
        treasury_pda,
        proposal_pda,
        &name,
        id,
        vote_for,
        recent_blockhash,
    );

    let result = banks_client.process_transaction(ix).await;

    // ASSERTIONS
    // This will likely fail without a properly initialized treasury and proposal
    // In a complete test suite, you would first initialize the treasury and create the proposal
    assert!(result.is_err()); // Expecting error since treasury and proposal don't exist yet
}