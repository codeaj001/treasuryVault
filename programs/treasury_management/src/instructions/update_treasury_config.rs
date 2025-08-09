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
		new_signers: Vec<Pubkey>,
		new_threshold: u8,
		admin_limit: u64,
		treasurer_limit: u64,
		contributor_limit: u64,
		reset_period: u64,
		auto_stake: bool,
		stake_target_percentage: u8,
	)]
	pub struct UpdateTreasuryConfig<'info> {
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
/// - new_signers: [Vec<Pubkey>] 
/// - new_threshold: [u8] 
/// - admin_limit: [u64] 
/// - treasurer_limit: [u64] 
/// - contributor_limit: [u64] 
/// - reset_period: [u64] 
/// - auto_stake: [bool] 
/// - stake_target_percentage: [u8] 
pub fn handler(
	ctx: Context<UpdateTreasuryConfig>,
	name: String,
	new_signers: Vec<Pubkey>,
	new_threshold: u8,
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
