use crate::*;
use anchor_lang::prelude::*;
use std::str::FromStr;

use anchor_spl::{
    associated_token::AssociatedToken,
    token::{Mint, Token, TokenAccount},
};




	#[derive(Accounts)]
	#[instruction(
		name: String,
		id: u64,
		title: String,
		description: String,
		amount: u64,
		token_mint: Pubkey,
		recipient: Pubkey,
	)]
	pub struct CreateProposal<'info> {
		pub proposer: Signer<'info>,

		#[account(
			seeds = [
				b"treasury",
				name.as_bytes().as_ref(),
			],
			bump,
		)]
		pub treasury: Account<'info, Treasury>,

		#[account(
			init,
			space=1421,
			payer=proposer,
			seeds = [
				b"proposal",
				treasury.key().as_ref(),
				id.to_le_bytes().as_ref(),
			],
			bump,
		)]
		pub proposal: Account<'info, Proposal>,

		pub system_program: Program<'info, System>,
	}

/// Accounts:
/// 0. `[signer]` proposer: [AccountInfo] 
/// 1. `[]` treasury: [Treasury] 
/// 2. `[writable]` proposal: [Proposal] 
/// 3. `[]` system_program: [AccountInfo] Auto-generated, for account initialization
///
/// Data:
/// - name: [String] 
/// - id: [u64] 
/// - title: [String] 
/// - description: [String] type
/// - amount: [u64] 
/// - token_mint: [Pubkey] 
/// - recipient: [Pubkey] 
pub fn handler(
	ctx: Context<CreateProposal>,
	name: String,
	id: u64,
	title: String,
	description: String,
	amount: u64,
	token_mint: Pubkey,
	recipient: Pubkey,
) -> Result<()> {
    // Implement your business logic here...
	
	Ok(())
}
