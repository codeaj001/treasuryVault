
use anchor_lang::prelude::*;

#[account]
pub struct MilestonePayment {
	pub treasury: Pubkey,
	pub recipient: Pubkey,
	pub token_mint: Pubkey,
	pub amount: u64,
	pub description: String,
	pub is_completed: bool,
	pub created_at: i64,
	pub completed_at: i64,
	pub created_by: Pubkey,
	pub category: u8,
}
