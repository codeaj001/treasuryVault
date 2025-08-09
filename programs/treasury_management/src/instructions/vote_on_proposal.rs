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
		vote_for: bool,
	)]
	pub struct VoteOnProposal<'info> {
		pub voter: Signer<'info>,

		#[account(
			seeds = [
				b"treasury",
				name.as_bytes().as_ref(),
			],
			bump,
		)]
		pub treasury: Account<'info, Treasury>,

		#[account(
			mut,
			seeds = [
				b"proposal",
				treasury.key().as_ref(),
				id.to_le_bytes().as_ref(),
			],
			bump,
		)]
		pub proposal: Account<'info, Proposal>,
	}

/// Accounts:
/// 0. `[signer]` voter: [AccountInfo] 
/// 1. `[]` treasury: [Treasury] 
/// 2. `[writable]` proposal: [Proposal] 
///
/// Data:
/// - name: [String] 
/// - id: [u64] 
/// - vote_for: [bool] 
pub fn handler(
	ctx: Context<VoteOnProposal>,
	name: String,
	id: u64,
	vote_for: bool,
) -> Result<()> {
    // Implement your business logic here...
	
	Ok(())
}
