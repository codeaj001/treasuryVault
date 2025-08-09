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
	pub struct RemoveWhitelistRecipient<'info> {
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
			close=authority,
			seeds = [
				b"whitelist",
				treasury.key().as_ref(),
				recipient.as_ref(),
			],
			bump,
		)]
		pub whitelist_entry: Account<'info, WhitelistedRecipient>,
	}

/// Accounts:
/// 0. `[signer]` authority: [AccountInfo] 
/// 1. `[]` treasury: [Treasury] 
/// 2. `[writable]` whitelist_entry: [WhitelistedRecipient] 
///
/// Data:
/// - name: [String] 
/// - recipient: [Pubkey] 
pub fn handler(
	ctx: Context<RemoveWhitelistRecipient>,
	name: String,
	recipient: Pubkey,
) -> Result<()> {
    // Implement your business logic here...
	
	Ok(())
}
