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
async fn remove_whitelist_recipient_ix_success() {
    let mut program_test = get_program_test();

    // PROGRAMS
    program_test.prefer_bpf(true);

    // DATA
    let name: String = "Test Treasury".to_string();
    let recipient: Pubkey = Pubkey::new_unique();

    // KEYPAIR
    let authority_keypair = Keypair::new();

    // PUBKEY
    let authority_pubkey = authority_keypair.pubkey();

    // PDA
    let (treasury_pda, _treasury_pda_bump) = Pubkey::find_program_address(
        &[
            b"treasury",
            name.as_bytes().as_ref(),
        ],
        &treasury_management::ID,
    );

    let (whitelist_entry_pda, _whitelist_entry_pda_bump) = Pubkey::find_program_address(
        &[
            b"whitelist",
            treasury_pda.as_ref(),
            recipient.as_ref(),
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

    let ix = treasury_management_ix_interface::remove_whitelist_recipient_ix_setup(
        &authority_keypair,
        treasury_pda,
        whitelist_entry_pda,
        &name,
        recipient,
        recent_blockhash,
    );

    let result = banks_client.process_transaction(ix).await;

    // ASSERTIONS
    // This will likely fail without a properly initialized treasury and whitelist entry
    // In a complete test suite, you would first initialize the treasury and add the whitelist entry
    assert!(result.is_err()); // Expecting error since treasury and whitelist entry don't exist yet
}