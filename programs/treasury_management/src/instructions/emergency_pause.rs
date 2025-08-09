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
	)]
	pub struct EmergencyPause<'info> {
		pub authority: Signer<'info>,

		#[account(
			mut,
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
/// 1. `[writable]` treasury: [Treasury] 
///
/// Data:
/// - name: [String] 
pub fn handler(
	ctx: Context<EmergencyPause>,
	name: String,
) -> Result<()> {
    // Implement your business logic here...
	
	Ok(())
}
