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
		amount: u64,
	)]
	pub struct WithdrawSol<'info> {
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

		#[account(
			mut,
		)]
		/// CHECK: implement manual checks if needed
		pub recipient: UncheckedAccount<'info>,
	}

/// Accounts:
/// 0. `[signer]` authority: [AccountInfo] 
/// 1. `[writable]` treasury: [Treasury] 
/// 2. `[writable]` recipient: [AccountInfo] 
///
/// Data:
/// - name: [String] 
/// - amount: [u64] 
pub fn handler(
	ctx: Context<WithdrawSol>,
	name: String,
	amount: u64,
) -> Result<()> {
    // Implement your business logic here...
	
	Ok(())
}
