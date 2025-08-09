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
	)]
	pub struct CancelPaymentStream<'info> {
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
			mut,
			seeds = [
				b"payment_stream",
				treasury.key().as_ref(),
				recipient.as_ref(),
			],
			bump,
		)]
		pub payment_stream: Account<'info, PaymentStream>,
	}

/// Accounts:
/// 0. `[signer]` authority: [AccountInfo] 
/// 1. `[]` treasury: [Treasury] 
/// 2. `[writable]` payment_stream: [PaymentStream] 
///
/// Data:
/// - name: [String] 
/// - recipient: [Pubkey] 
pub fn handler(
	ctx: Context<CancelPaymentStream>,
	name: String,
	recipient: Pubkey,
) -> Result<()> {
    // Implement your business logic here...
	
	Ok(())
}
