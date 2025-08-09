use solana_program_test::ProgramTest;
use solana_sdk::{
    hash::Hash,
    instruction::Instruction,
    pubkey::Pubkey,
    signature::{Keypair, Signer},
    transaction::Transaction,
};

pub fn get_program_test() -> ProgramTest {
    ProgramTest::new(
        "treasury_management",
        treasury_management::ID,
        None,
    )
}

pub mod treasury_management_ix_interface {
    use super::*;
    use solana_sdk::{system_program, instruction::AccountMeta};
    use treasury_management::instruction::*;

    // Initialize Treasury
    pub fn initialize_treasury_ix_setup(
        authority: &Keypair,
        treasury: Pubkey,
        system_program: Pubkey,
        name: &str,
        signers: &[Pubkey],
        threshold: u8,
        admin_limit: u64,
        treasurer_limit: u64,
        contributor_limit: u64,
        reset_period: u64,
        auto_stake: bool,
        stake_target_percentage: u8,
        recent_blockhash: Hash,
    ) -> Transaction {
        let accounts = vec![
            AccountMeta::new_readonly(authority.pubkey(), true),
            AccountMeta::new(treasury, false),
            AccountMeta::new_readonly(system_program, false),
        ];

        let data = InitializeTreasuryArgs {
            name: name.to_string(),
            signers: signers.to_vec(),
            threshold,
            admin_limit,
            treasurer_limit,
            contributor_limit,
            reset_period,
            auto_stake,
            stake_target_percentage,
        };

        let instruction = Instruction::new_with_borsh(
            treasury_management::ID,
            &TreasuryManagementInstruction::InitializeTreasury(data),
            accounts,
        );

        let mut transaction = Transaction::new_with_payer(&[instruction], Some(&authority.pubkey()));
        transaction.sign(&[authority], recent_blockhash);

        transaction
    }

    // Assign Role
    pub fn assign_role_ix_setup(
        authority: &Keypair,
        treasury: Pubkey,
        name: &str,
        user: Pubkey,
        role_type: u8,
        can_execute_payments: bool,
        can_create_streams: bool,
        can_manage_roles: bool,
        can_view_treasury: bool,
        can_propose: bool,
        can_vote: bool,
        recent_blockhash: Hash,
    ) -> Transaction {
        let accounts = vec![
            AccountMeta::new_readonly(authority.pubkey(), true),
            AccountMeta::new(treasury, false),
        ];

        let data = AssignRoleArgs {
            name: name.to_string(),
            user,
            role_type,
            can_execute_payments,
            can_create_streams,
            can_manage_roles,
            can_view_treasury,
            can_propose,
            can_vote,
        };

        let instruction = Instruction::new_with_borsh(
            treasury_management::ID,
            &TreasuryManagementInstruction::AssignRole(data),
            accounts,
        );

        let mut transaction = Transaction::new_with_payer(&[instruction], Some(&authority.pubkey()));
        transaction.sign(&[authority], recent_blockhash);

        transaction
    }

    // Create Payment Stream
    pub fn create_payment_stream_ix_setup(
        authority: &Keypair,
        treasury: Pubkey,
        payment_stream: Pubkey,
        system_program: Pubkey,
        name: &str,
        recipient: Pubkey,
        token_mint: Pubkey,
        amount_per_period: u64,
        period_duration: i64,
        start_time: i64,
        end_time: i64,
        category: u8,
        recent_blockhash: Hash,
    ) -> Transaction {
        let accounts = vec![
            AccountMeta::new_readonly(authority.pubkey(), true),
            AccountMeta::new_readonly(treasury, false),
            AccountMeta::new(payment_stream, false),
            AccountMeta::new_readonly(system_program, false),
        ];

        let data = CreatePaymentStreamArgs {
            name: name.to_string(),
            recipient,
            token_mint,
            amount_per_period,
            period_duration,
            start_time,
            end_time,
            category,
        };

        let instruction = Instruction::new_with_borsh(
            treasury_management::ID,
            &TreasuryManagementInstruction::CreatePaymentStream(data),
            accounts,
        );

        let mut transaction = Transaction::new_with_payer(&[instruction], Some(&authority.pubkey()));
        transaction.sign(&[authority], recent_blockhash);

        transaction
    }

    // Execute Stream Payment
    pub fn execute_stream_payment_ix_setup(
        executor: &Keypair,
        treasury: Pubkey,
        payment_stream: Pubkey,
        token_mint: Pubkey,
        source: Pubkey,
        destination: Pubkey,
        token_program: Pubkey,
        name: &str,
        recipient: Pubkey,
        recent_blockhash: Hash,
    ) -> Transaction {
        let accounts = vec![
            AccountMeta::new_readonly(executor.pubkey(), true),
            AccountMeta::new(treasury, false),
            AccountMeta::new(payment_stream, false),
            AccountMeta::new_readonly(token_mint, false),
            AccountMeta::new(source, false),
            AccountMeta::new(destination, false),
            AccountMeta::new_readonly(token_program, false),
        ];

        let data = ExecuteStreamPaymentArgs {
            name: name.to_string(),
            recipient,
        };

        let instruction = Instruction::new_with_borsh(
            treasury_management::ID,
            &TreasuryManagementInstruction::ExecuteStreamPayment(data),
            accounts,
        );

        let mut transaction = Transaction::new_with_payer(&[instruction], Some(&executor.pubkey()));
        transaction.sign(&[executor], recent_blockhash);

        transaction
    }

    // Create Milestone Payment
    pub fn create_milestone_payment_ix_setup(
        authority: &Keypair,
        treasury: Pubkey,
        milestone_payment: Pubkey,
        system_program: Pubkey,
        name: &str,
        id: u64,
        recipient: Pubkey,
        token_mint: Pubkey,
        amount: u64,
        description: &str,
        category: u8,
        recent_blockhash: Hash,
    ) -> Transaction {
        let accounts = vec![
            AccountMeta::new_readonly(authority.pubkey(), true),
            AccountMeta::new_readonly(treasury, false),
            AccountMeta::new(milestone_payment, false),
            AccountMeta::new_readonly(system_program, false),
        ];

        let data = CreateMilestonePaymentArgs {
            name: name.to_string(),
            id,
            recipient,
            token_mint,
            amount,
            description: description.to_string(),
            category,
        };

        let instruction = Instruction::new_with_borsh(
            treasury_management::ID,
            &TreasuryManagementInstruction::CreateMilestonePayment(data),
            accounts,
        );

        let mut transaction = Transaction::new_with_payer(&[instruction], Some(&authority.pubkey()));
        transaction.sign(&[authority], recent_blockhash);

        transaction
    }

    // Complete Milestone
    pub fn complete_milestone_ix_setup(
        authority: &Keypair,
        treasury: Pubkey,
        milestone_payment: Pubkey,
        token_mint: Pubkey,
        source: Pubkey,
        destination: Pubkey,
        token_program: Pubkey,
        name: &str,
        id: u64,
        recent_blockhash: Hash,
    ) -> Transaction {
        let accounts = vec![
            AccountMeta::new_readonly(authority.pubkey(), true),
            AccountMeta::new(treasury, false),
            AccountMeta::new(milestone_payment, false),
            AccountMeta::new_readonly(token_mint, false),
            AccountMeta::new(source, false),
            AccountMeta::new(destination, false),
            AccountMeta::new_readonly(token_program, false),
        ];

        let data = CompleteMilestoneArgs {
            name: name.to_string(),
            id,
        };

        let instruction = Instruction::new_with_borsh(
            treasury_management::ID,
            &TreasuryManagementInstruction::CompleteMilestone(data),
            accounts,
        );

        let mut transaction = Transaction::new_with_payer(&[instruction], Some(&authority.pubkey()));
        transaction.sign(&[authority], recent_blockhash);

        transaction
    }

    // Batch Transfer
    pub fn batch_transfer_ix_setup(
        authority: &Keypair,
        treasury: Pubkey,
        token_mint: Pubkey,
        source: Pubkey,
        destinations: Vec<Pubkey>,
        token_program: Pubkey,
        name: &str,
        recipients: Vec<Pubkey>,
        amounts: Vec<u64>,
        recent_blockhash: Hash,
    ) -> Transaction {
        let mut accounts = vec![
            AccountMeta::new_readonly(authority.pubkey(), true),
            AccountMeta::new(treasury, false),
            AccountMeta::new_readonly(token_mint, false),
            AccountMeta::new(source, false),
            AccountMeta::new_readonly(token_program, false),
        ];

        // Add destination accounts
        for dest in destinations {
            accounts.push(AccountMeta::new(dest, false));
        }

        let data = BatchTransferArgs {
            name: name.to_string(),
            recipients,
            amounts,
        };

        let instruction = Instruction::new_with_borsh(
            treasury_management::ID,
            &TreasuryManagementInstruction::BatchTransfer(data),
            accounts,
        );

        let mut transaction = Transaction::new_with_payer(&[instruction], Some(&authority.pubkey()));
        transaction.sign(&[authority], recent_blockhash);

        transaction
    }

    // Create Proposal
    pub fn create_proposal_ix_setup(
        proposer: &Keypair,
        treasury: Pubkey,
        proposal: Pubkey,
        system_program: Pubkey,
        name: &str,
        id: u64,
        title: &str,
        description: &str,
        amount: u64,
        token_mint: Pubkey,
        recipient: Pubkey,
        recent_blockhash: Hash,
    ) -> Transaction {
        let accounts = vec![
            AccountMeta::new_readonly(proposer.pubkey(), true),
            AccountMeta::new_readonly(treasury, false),
            AccountMeta::new(proposal, false),
            AccountMeta::new_readonly(system_program, false),
        ];

        let data = CreateProposalArgs {
            name: name.to_string(),
            id,
            title: title.to_string(),
            description: description.to_string(),
            amount,
            token_mint,
            recipient,
        };

        let instruction = Instruction::new_with_borsh(
            treasury_management::ID,
            &TreasuryManagementInstruction::CreateProposal(data),
            accounts,
        );

        let mut transaction = Transaction::new_with_payer(&[instruction], Some(&proposer.pubkey()));
        transaction.sign(&[proposer], recent_blockhash);

        transaction
    }

    // Vote on Proposal
    pub fn vote_on_proposal_ix_setup(
        voter: &Keypair,
        treasury: Pubkey,
        proposal: Pubkey,
        name: &str,
        id: u64,
        vote_for: bool,
        recent_blockhash: Hash,
    ) -> Transaction {
        let accounts = vec![
            AccountMeta::new_readonly(voter.pubkey(), true),
            AccountMeta::new_readonly(treasury, false),
            AccountMeta::new(proposal, false),
        ];

        let data = VoteOnProposalArgs {
            name: name.to_string(),
            id,
            vote_for,
        };

        let instruction = Instruction::new_with_borsh(
            treasury_management::ID,
            &TreasuryManagementInstruction::VoteOnProposal(data),
            accounts,
        );

        let mut transaction = Transaction::new_with_payer(&[instruction], Some(&voter.pubkey()));
        transaction.sign(&[voter], recent_blockhash);

        transaction
    }

    // Execute Proposal
    pub fn execute_proposal_ix_setup(
        executor: &Keypair,
        treasury: Pubkey,
        proposal: Pubkey,
        token_mint: Pubkey,
        source: Pubkey,
        destination: Pubkey,
        authority: &Keypair,
        token_program: Pubkey,
        name: &str,
        id: u64,
        recent_blockhash: Hash,
    ) -> Transaction {
        let accounts = vec![
            AccountMeta::new_readonly(executor.pubkey(), true),
            AccountMeta::new(treasury, false),
            AccountMeta::new(proposal, false),
            AccountMeta::new_readonly(token_mint, false),
            AccountMeta::new(source, false),
            AccountMeta::new(destination, false),
            AccountMeta::new_readonly(authority.pubkey(), true),
            AccountMeta::new_readonly(token_program, false),
        ];

        let data = ExecuteProposalArgs {
            name: name.to_string(),
            id,
        };

        let instruction = Instruction::new_with_borsh(
            treasury_management::ID,
            &TreasuryManagementInstruction::ExecuteProposal(data),
            accounts,
        );

        let mut transaction = Transaction::new_with_payer(&[instruction], Some(&executor.pubkey()));
        transaction.sign(&[executor, authority], recent_blockhash);

        transaction
    }

    // Add Whitelist Recipient
    pub fn add_whitelist_recipient_ix_setup(
        authority: &Keypair,
        treasury: Pubkey,
        whitelist_entry: Pubkey,
        system_program: Pubkey,
        name: &str,
        recipient: Pubkey,
        label: &str,
        recent_blockhash: Hash,
    ) -> Transaction {
        let accounts = vec![
            AccountMeta::new_readonly(authority.pubkey(), true),
            AccountMeta::new_readonly(treasury, false),
            AccountMeta::new(whitelist_entry, false),
            AccountMeta::new_readonly(system_program, false),
        ];

        let data = AddWhitelistRecipientArgs {
            name: name.to_string(),
            recipient,
            label: label.to_string(),
        };

        let instruction = Instruction::new_with_borsh(
            treasury_management::ID,
            &TreasuryManagementInstruction::AddWhitelistRecipient(data),
            accounts,
        );

        let mut transaction = Transaction::new_with_payer(&[instruction], Some(&authority.pubkey()));
        transaction.sign(&[authority], recent_blockhash);

        transaction
    }

    // Remove Whitelist Recipient
    pub fn remove_whitelist_recipient_ix_setup(
        authority: &Keypair,
        treasury: Pubkey,
        whitelist_entry: Pubkey,
        name: &str,
        recipient: Pubkey,
        recent_blockhash: Hash,
    ) -> Transaction {
        let accounts = vec![
            AccountMeta::new_readonly(authority.pubkey(), true),
            AccountMeta::new_readonly(treasury, false),
            AccountMeta::new(whitelist_entry, false),
        ];

        let data = RemoveWhitelistRecipientArgs {
            name: name.to_string(),
            recipient,
        };

        let instruction = Instruction::new_with_borsh(
            treasury_management::ID,
            &TreasuryManagementInstruction::RemoveWhitelistRecipient(data),
            accounts,
        );

        let mut transaction = Transaction::new_with_payer(&[instruction], Some(&authority.pubkey()));
        transaction.sign(&[authority], recent_blockhash);

        transaction
    }
}

pub mod csl_spl_token_ix_interface {
    use super::*;
    use solana_sdk::instruction::AccountMeta;

    pub fn transfer_ix_setup(
        authority: &Keypair,
        source: Pubkey,
        destination: Pubkey,
        authority_pubkey: Pubkey,
        token_program: Pubkey,
        amount: u64,
        recent_blockhash: Hash,
    ) -> Transaction {
        let accounts = vec![
            AccountMeta::new(source, false),
            AccountMeta::new(destination, false),
            AccountMeta::new_readonly(authority_pubkey, true),
        ];

        let instruction = solana_sdk::spl_token::instruction::transfer(
            &token_program,
            &source,
            &destination,
            &authority_pubkey,
            &[],
            amount,
        )
        .unwrap();

        let mut transaction = Transaction::new_with_payer(&[instruction], Some(&authority.pubkey()));
        transaction.sign(&[authority], recent_blockhash);

        transaction
    }
}