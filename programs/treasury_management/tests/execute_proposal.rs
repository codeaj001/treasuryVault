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
async fn execute_proposal_ix_success() {
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

	program_test.add_program(
		"csl_spl_token",
		Pubkey::from_str("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA").unwrap(),
		None,
	);

	// DATA
	let name: String = Default::default();
	let id: u64 = Default::default();

	// KEYPAIR
	let executor_keypair = Keypair::new();
	let authority_keypair = Keypair::new();
	let token_mint_keypair = Keypair::new();

	// PUBKEY
	let executor_pubkey = executor_keypair.pubkey();
	let authority_pubkey = authority_keypair.pubkey();
	let token_mint_pubkey = token_mint_keypair.pubkey();
	let source_pubkey = Pubkey::new_unique();
	let destination_pubkey = Pubkey::new_unique();

	// EXECUTABLE PUBKEY
	let csl_spl_token_v0_0_0_pubkey = Pubkey::from_str("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA").unwrap();

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
			treasury_pubkey.as_ref(),
			id.to_le_bytes().as_ref(),
		],
		&treasury_management::ID,
	);

	// ACCOUNT PROGRAM TEST SETUP
	program_test.add_account(
		executor_pubkey,
		Account {
			lamports: 1_000_000_000_000,
			data: vec![],
			owner: system_program::ID,
			executable: false,
			rent_epoch: 0,
		},
	);

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

	let ix = treasury_management_ix_interface::execute_proposal_ix_setup(
		&executor_keypair,
		treasury_pda,
		proposal_pda,
		token_mint_pubkey,
		source_pubkey,
		destination_pubkey,
		&authority_keypair,
		csl_spl_token_v0_0_0_pubkey,
		&name,
		id,
		recent_blockhash,
	);

	let result = banks_client.process_transaction(ix).await;

	// ASSERTIONS
	assert!(result.is_ok());

}
