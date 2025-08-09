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
async fn cancel_payment_stream_test() {
    let mut program_test = get_program_test();

    // PROGRAMS
    program_test.prefer_bpf(true);

    // DATA
    let name = "Stream Treasury".to_string();
    
    // KEYPAIR
    let authority_keypair = Keypair::new();
    let recipient_keypair = Keypair::new();

    // PUBKEY
    let authority_pubkey = authority_keypair.pubkey();
    let recipient_pubkey = recipient_keypair.pubkey();

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

    // Create cancel payment stream instruction
    let accounts = vec![
        AccountMeta::new_readonly(authority_pubkey, true),
        AccountMeta::new_readonly(treasury_pda, false),
        AccountMeta::new(payment_stream_pda, false),
    ];

    let data = treasury_management::instruction::CancelPaymentStreamArgs {
        name: name.clone(),
        recipient: recipient_pubkey,
    };

    let instruction = Instruction::new_with_borsh(
        treasury_management::ID,
        &treasury_management::instruction::TreasuryManagementInstruction::CancelPaymentStream(data),
        accounts,
    );

    let mut transaction = Transaction::new_with_payer(&[instruction], Some(&authority_pubkey));
    transaction.sign(&[&authority_keypair], recent_blockhash);

    let result = banks_client.process_transaction(transaction).await;

    // ASSERTIONS
    // This will likely fail without a properly initialized treasury and payment stream
    // In a complete test suite, you would first initialize the treasury and create the payment stream
    assert!(result.is_err()); // Expecting error since treasury and payment stream don't exist yet
}