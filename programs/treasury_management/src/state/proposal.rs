
use anchor_lang::prelude::*;

#[account]
pub struct Proposal {
	pub treasury: Pubkey,
	pub proposer: Pubkey,
	pub title: String,
	pub description: String,
	pub amount: u64,
	pub token_mint: Pubkey,
	pub recipient: Pubkey,
	pub votes_for: u32,
	pub votes_against: u32,
	pub status: u8,
	pub created_at: i64,
	pub executed_at: i64,
	pub voters: Vec<Pubkey>,
}
