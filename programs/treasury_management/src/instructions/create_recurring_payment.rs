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
		recipient: Pubkey,
		token_mint: Pubkey,
		amount: u64,
		interval: i64,
		category: u8,
	)]
	pub struct CreateRecurringPayment<'info> {
		pub authority: Signer<'info>,

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
			space=162,
			payer=authority,
			seeds = [
				b"recurring",
				treasury.key().as_ref(),
				recipient.as_ref(),
			],
			bump,
		)]
		pub recurring_payment: Account<'info, RecurringPayment>,

		pub system_program: Program<'info, System>,
	}

/// Accounts:
/// 0. `[signer]` authority: [AccountInfo] 
/// 1. `[]` treasury: [Treasury] 
/// 2. `[writable]` recurring_payment: [RecurringPayment] 
/// 3. `[]` system_program: [AccountInfo] Auto-generated, for account initialization
///
/// Data:
/// - name: [String] 
/// - recipient: [Pubkey] 
/// - token_mint: [Pubkey] 
/// - amount: [u64] 
/// - interval: [i64] 
/// - category: [u8] 
pub fn handler(
	ctx: Context<CreateRecurringPayment>,
	name: String,
	recipient: Pubkey,
	token_mint: Pubkey,
	amount: u64,
	interval: i64,
	category: u8,
) -> Result<()> {
    // Implement your business logic here...
	
	Ok(())
}
