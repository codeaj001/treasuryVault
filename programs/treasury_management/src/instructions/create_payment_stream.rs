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
		amount_per_period: u64,
		period_duration: i64,
		start_time: i64,
		end_time: i64,
		category: u8,
	)]
	pub struct CreatePaymentStream<'info> {
		#[account(mut)]
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
			space=186,
			payer=authority,
			seeds = [
				b"payment_stream",
				treasury.key().as_ref(),
				recipient.as_ref(),
			],
			bump,
		)]
		pub payment_stream: Account<'info, PaymentStream>,

		pub system_program: Program<'info, System>,
	}

/// Accounts:
/// 0. `[signer]` authority: [AccountInfo] 
/// 1. `[]` treasury: [Treasury] 
/// 2. `[writable]` payment_stream: [PaymentStream] 
/// 3. `[]` system_program: [AccountInfo] Auto-generated, for account initialization
///
/// Data:
/// - name: [String] 
/// - recipient: [Pubkey] 
/// - token_mint: [Pubkey] 
/// - amount_per_period: [u64] 
/// - period_duration: [i64] 
/// - start_time: [i64] 
/// - end_time: [i64] 
/// - category: [u8] 
pub fn handler(
	ctx: Context<CreatePaymentStream>,
	name: String,
	recipient: Pubkey,
	token_mint: Pubkey,
	amount_per_period: u64,
	period_duration: i64,
	start_time: i64,
	end_time: i64,
	category: u8,
) -> Result<()> {
    // Implement your business logic here...
	
	Ok(())
}
