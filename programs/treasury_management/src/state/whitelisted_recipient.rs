
use anchor_lang::prelude::*;

#[account]
pub struct WhitelistedRecipient {
	pub treasury: Pubkey,
	pub recipient: Pubkey,
	pub label: String,
	pub added_by: Pubkey,
	pub added_at: i64,
}
