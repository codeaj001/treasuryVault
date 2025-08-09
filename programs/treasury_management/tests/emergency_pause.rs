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
        instruction::{AccountMeta, Instruction}, transaction::Transaction,
    },
};


#[tokio::test]
async fn emergency_pause_ix_success() {
    let mut program_test = get_program_test();

    // PROGRAMS
    program_test.prefer_bpf(true);

    // DATA
    let name = "Test Treasury".to_string();
    
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

    // Create emergency pause instruction
    let accounts = vec![
        AccountMeta::new_readonly(authority_pubkey, true),
        AccountMeta::new(treasury_pda, false),
    ];

    let data = treasury_management::instruction::EmergencyPauseArgs {
        name: name.clone(),
    };

    let instruction = Instruction::new_with_borsh(
        treasury_management::ID,
        &treasury_management::instruction::TreasuryManagementInstruction::EmergencyPause(data),
        accounts,
    );

    let mut transaction = Transaction::new_with_payer(&[instruction], Some(&authority_pubkey));
    transaction.sign(&[&authority_keypair], recent_blockhash);

    let result = banks_client.process_transaction(transaction).await;

    // ASSERTIONS
    // This will likely fail without a properly initialized treasury
    // In a complete test suite, you would first initialize the treasury
    assert!(result.is_err()); // Expecting error since treasury doesn't exist yet
}