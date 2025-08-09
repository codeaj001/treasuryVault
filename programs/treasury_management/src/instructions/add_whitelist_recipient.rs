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
		label: String,
	)]
	pub struct AddWhitelistRecipient<'info> {
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
			space=166,
			payer=authority,
			seeds = [
				b"whitelist",
				treasury.key().as_ref(),
				recipient.as_ref(),
			],
			bump,
		)]
		pub whitelist_entry: Account<'info, WhitelistedRecipient>,

		pub system_program: Program<'info, System>,
	}

/// Accounts:
/// 0. `[signer]` authority: [AccountInfo] 
/// 1. `[]` treasury: [Treasury] 
/// 2. `[writable]` whitelist_entry: [WhitelistedRecipient] 
/// 3. `[]` system_program: [AccountInfo] Auto-generated, for account initialization
///
/// Data:
/// - name: [String] 
/// - recipient: [Pubkey] 
/// - label: [String] 
pub fn handler(
	ctx: Context<AddWhitelistRecipient>,
	name: String,
	recipient: Pubkey,
	label: String,
) -> Result<()> {
    // Implement your business logic here...
	
	Ok(())
}
