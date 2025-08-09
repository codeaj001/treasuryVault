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
		recipient: Pubkey,
		token_mint: Pubkey,
		amount: u64,
		description: String,
		category: u8,
	)]
	pub struct CreateMilestonePayment<'info> {
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
			space=366,
			payer=authority,
			seeds = [
				b"milestone",
				treasury.key().as_ref(),
				id.to_le_bytes().as_ref(),
			],
			bump,
		)]
		pub milestone_payment: Account<'info, MilestonePayment>,

		pub system_program: Program<'info, System>,
	}

/// Accounts:
/// 0. `[signer]` authority: [AccountInfo] 
/// 1. `[]` treasury: [Treasury] 
/// 2. `[writable]` milestone_payment: [MilestonePayment] 
/// 3. `[]` system_program: [AccountInfo] Auto-generated, for account initialization
///
/// Data:
/// - name: [String] 
/// - id: [u64] 
/// - recipient: [Pubkey] 
/// - token_mint: [Pubkey] 
/// - amount: [u64] 
/// - description: [String] type
/// - category: [u8] 
pub fn handler(
	ctx: Context<CreateMilestonePayment>,
	name: String,
	id: u64,
	recipient: Pubkey,
	token_mint: Pubkey,
	amount: u64,
	description: String,
	category: u8,
) -> Result<()> {
    // Implement your business logic here...
	
	Ok(())
}
