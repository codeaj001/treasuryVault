
use anchor_lang::prelude::*;

#[account]
pub struct RecurringPayment {
	pub treasury: Pubkey,
	pub recipient: Pubkey,
	pub token_mint: Pubkey,
	pub amount: u64,
	pub interval: i64,
	pub next_payment_date: i64,
	pub is_active: bool,
	pub created_by: Pubkey,
	pub category: u8,
}
