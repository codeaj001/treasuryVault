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
		signers: Vec<Pubkey>,
		threshold: u8,
		admin_limit: u64,
		treasurer_limit: u64,
		contributor_limit: u64,
		reset_period: u64,
		auto_stake: bool,
		stake_target_percentage: u8,
	)]
	pub struct InitializeTreasury<'info> {
		#[account(mut)]
		pub authority: Signer<'info>,

		#[account(
			init,
			space=479,
			payer=authority,
			seeds = [
				b"treasury",
				name.as_bytes().as_ref(),
			],
			bump,
		)]
		pub treasury: Account<'info, Treasury>,

		pub system_program: Program<'info, System>,
	}

/// Accounts:
/// 0. `[signer]` authority: [AccountInfo] 
/// 1. `[writable]` treasury: [Treasury] 
/// 2. `[]` system_program: [AccountInfo] Auto-generated, for account initialization
///
/// Data:
/// - name: [String] 
/// - signers: [Vec<Pubkey>] 
/// - threshold: [u8] 
/// - admin_limit: [u64] 
/// - treasurer_limit: [u64] 
/// - contributor_limit: [u64] 
/// - reset_period: [u64] 
/// - auto_stake: [bool] 
/// - stake_target_percentage: [u8] 
pub fn handler(
	ctx: Context<InitializeTreasury>,
	name: String,
	signers: Vec<Pubkey>,
	threshold: u8,
	admin_limit: u64,
	treasurer_limit: u64,
	contributor_limit: u64,
	reset_period: u64,
	auto_stake: bool,
	stake_target_percentage: u8,
) -> Result<()> {
    // Implement your business logic here...
	
	Ok(())
}
