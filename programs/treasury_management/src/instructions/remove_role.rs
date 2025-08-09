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
		user: Pubkey,
	)]
	pub struct RemoveRole<'info> {
		pub authority: Signer<'info>,

		#[account(
			seeds = [
				b"treasury",
				name.as_bytes().as_ref(),
			],
			bump,
		)]
		pub treasury: Account<'info, Treasury>,
	}

/// Accounts:
/// 0. `[signer]` authority: [AccountInfo] 
/// 1. `[]` treasury: [Treasury] 
///
/// Data:
/// - name: [String] 
/// - user: [Pubkey] 
pub fn handler(
	ctx: Context<RemoveRole>,
	name: String,
	user: Pubkey,
) -> Result<()> {
    // Implement your business logic here...
	
	Ok(())
}
