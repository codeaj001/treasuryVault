
use anchor_lang::prelude::*;

#[account]
pub struct Treasury {
	pub name: String,
	pub authority: Pubkey,
	pub signers: Vec<Pubkey>,
	pub threshold: u8,
	pub is_paused: bool,
	pub total_deposited: u64,
	pub total_withdrawn: u64,
	pub created_at: i64,
	pub admin_limit: u64,
	pub treasurer_limit: u64,
	pub contributor_limit: u64,
	pub reset_period: u64,
	pub auto_stake: bool,
	pub stake_target_percentage: u8,
	pub whitelist_enabled: bool,
}
