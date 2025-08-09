pub mod common;

use std::str::FromStr;
use {
    common::{
		get_program_test,
		treasury_management_ix_interface,
		csl_spl_token_ix_interface,
	},
    solana_program_test::tokio,
    solana_sdk::{
        account::Account, pubkey::Pubkey, rent::Rent, signature::Keypair, signer::Signer, system_program,
    },
};


#[tokio::test]
async fn create_recurring_payment_ix_success() {
	let mut program_test = get_program_test();

	// PROGRAMS
	program_test.prefer_bpf(true);

	program_test.add_program(
		"account_compression",
		Pubkey::from_str("cmtDvXumGCrqC1Age74AVPhSRVXJMd8PJS91L8KbNCK").unwrap(),
		None,
	);

	program_test.add_program(
		"noop",
		Pubkey::from_str("noopb9bkMVfRPU8AsbpTUg8AQkHtKwMYZiFUjNRtMmV").unwrap(),
		None,
	);

	// DATA
	let name: String = Default::default();
	let recipient: Pubkey = Pubkey::default();
	let token_mint: Pubkey = Pubkey::default();
	let amount: u64 = Default::default();
	let interval: i64 = Default::default();
	let category: u8 = Default::default();

	// KEYPAIR
	let authority_keypair = Keypair::new();

	// PUBKEY
	let authority_pubkey = authority_keypair.pubkey();

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

	let (recurring_payment_pda, _recurring_payment_pda_bump) = Pubkey::find_program_address(
		&[
			b"recurring",
			treasury_pubkey.as_ref(),
			recipient.as_ref(),
		],
		&treasury_management::ID,
	);

	// ACCOUNT PROGRAM TEST SETUP
	program_test.add_account(
		authority_pubkey,
		Account {
			lamports: 0,
			data: vec![],
			owner: system_program::ID,
			executable: false,
			rent_epoch: 0,
		},
	);

	// INSTRUCTIONS
	let (mut banks_client, _, recent_blockhash) = program_test.start().await;

	let ix = treasury_management_ix_interface::create_recurring_payment_ix_setup(
		&authority_keypair,
		treasury_pda,
		recurring_payment_pda,
		system_program_pubkey,
		&name,
		recipient,
		token_mint,
		amount,
		interval,
		category,
		recent_blockhash,
	);

	let result = banks_client.process_transaction(ix).await;

	// ASSERTIONS
	assert!(result.is_ok());

}
