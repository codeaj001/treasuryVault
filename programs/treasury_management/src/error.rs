// This file is auto-generated from the CIDL source.
// Editing this file directly is not recommended as it may be overwritten.
//
// Docs: https://docs.codigo.ai/c%C3%B3digo-interface-description-language/specification#errors

use anchor_lang::prelude::*;

#[error_code]
pub enum TreasuryManagementError {
	#[msg("Treasury has insufficient funds for this operation")]
	InsufficientFunds,
	#[msg("User does not have sufficient permissions for this action")]
	InsufficientPermissions,
	#[msg("Signature threshold must be greater than 0 and less than or equal to the number of signers")]
	InvalidSignatureThreshold,
	#[msg("Treasury operations are currently paused")]
	TreasuryPaused,
	#[msg("Payment amount must be greater than 0")]
	InvalidPaymentAmount,
	#[msg("Payment stream is not active")]
	PaymentStreamInactive,
	#[msg("No payment is due for this stream yet")]
	PaymentStreamNotDue,
	#[msg("This milestone has already been completed")]
	MilestoneAlreadyCompleted,
	#[msg("This proposal has already been executed")]
	ProposalAlreadyExecuted,
	#[msg("This proposal has not been approved")]
	ProposalNotApproved,
	#[msg("User has already voted on this proposal")]
	UserAlreadyVoted,
	#[msg("Recipient is not on the whitelist")]
	RecipientNotWhitelisted,
	#[msg("This operation would exceed your spending limit")]
	SpendingLimitExceeded,
	#[msg("Stake target percentage must be between 0 and 100")]
	InvalidStakePercentage,
}
