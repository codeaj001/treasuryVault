import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { TreasuryManagement } from "../target/types/treasury_management";
import { PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY, Keypair } from "@solana/web3.js";
import { assert, expect } from "chai";

describe("treasury_management", () => {
  // Configure the client
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.TreasuryManagement as Program<TreasuryManagement>;
  
  // Test accounts
  const treasuryKeypair = anchor.web3.Keypair.generate();
  const authority = provider.wallet;
  const user = anchor.web3.Keypair.generate();
  
  // Test parameters
  const name = "Test Treasury";
  const signers = [authority.publicKey];
  const threshold = 1;
  const adminLimit = new anchor.BN(1000000000); // 1 SOL
  const treasurerLimit = new anchor.BN(500000000); // 0.5 SOL
  const contributorLimit = new anchor.BN(100000000); // 0.1 SOL
  const resetPeriod = new anchor.BN(86400); // 24 hours
  const autoStake = false;
  const stakeTargetPercentage = 50;

  let treasuryPDA: PublicKey;
  let treasuryBump: number;

  before(async () => {
    // Airdrop SOL to test accounts
    await provider.connection.requestAirdrop(user.publicKey, 2e9);
    
    // Derive treasury PDA
    [treasuryPDA, treasuryBump] = PublicKey.findProgramAddressSync(
      [Buffer.from("treasury"), Buffer.from(name)],
      program.programId
    );
  });

  it("Initialize Treasury", async () => {
    try {
      await program.methods
        .initializeTreasury(
          name,
          signers,
          threshold,
          adminLimit,
          treasurerLimit,
          contributorLimit,
          resetPeriod,
          autoStake,
          stakeTargetPercentage
        )
        .accounts({
          authority: authority.publicKey,
          treasury: treasuryPDA,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      // Fetch treasury account
      const treasury = await program.account.treasury.fetch(treasuryPDA);
      
      // Verify initialization
      expect(treasury.name).to.equal(name);
      expect(treasury.signers[0].toString()).to.equal(authority.publicKey.toString());
      expect(treasury.threshold).to.equal(threshold);
    } catch (err) {
      console.error("Error initializing treasury:", err);
      throw err;
    }
  });

  it("Assign Role", async () => {
    try {
      const roleType = 2; // Treasurer role
      await program.methods
        .assignRole(
          name,
          user.publicKey,
          roleType,
          true, // can_execute_payments
          true, // can_create_streams
          false, // can_manage_roles
          true, // can_view_treasury
          true, // can_propose
          true  // can_vote
        )
        .accounts({
          authority: authority.publicKey,
          treasury: treasuryPDA,
        })
        .rpc();

      // Verify role assignment (you'll need to implement role fetching in your contract)
      // const userRole = await program.account.role.fetch(...);
      // expect(userRole.roleType).to.equal(roleType);
    } catch (err) {
      console.error("Error assigning role:", err);
      throw err;
    }
  });

  it("Deposit SOL", async () => {
    const depositAmount = new anchor.BN(100000000); // 0.1 SOL
    
    try {
      const beforeBalance = await provider.connection.getBalance(treasuryPDA);

      await program.methods
        .depositSol(name, depositAmount)
        .accounts({
          depositor: authority.publicKey,
          treasury: treasuryPDA,
        })
        .rpc();

      const afterBalance = await provider.connection.getBalance(treasuryPDA);
      
      // Verify deposit
      expect(afterBalance - beforeBalance).to.equal(depositAmount.toNumber());
    } catch (err) {
      console.error("Error depositing SOL:", err);
      throw err;
    }
  });

  it("Create and Complete Milestone Payment", async () => {
    const milestoneId = new anchor.BN(1);
    const amount = new anchor.BN(50000000); // 0.05 SOL
    const description = "Test milestone";
    const category = 1;

    try {
      // Create milestone payment
      await program.methods
        .createMilestonePayment(
          name,
          milestoneId,
          user.publicKey,
          SystemProgram.programId, // Using SOL
          amount,
          description,
          category
        )
        .accounts({
          authority: authority.publicKey,
          treasury: treasuryPDA,
          milestonePayment: getMilestonePDA(milestoneId),
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      // Complete milestone payment
      await program.methods
        .completeMilestone(name, milestoneId)
        .accounts({
          authority: authority.publicKey,
          treasury: treasuryPDA,
          milestonePayment: getMilestonePDA(milestoneId),
          tokenMint: SystemProgram.programId,
          source: treasuryPDA,
          destination: user.publicKey,
        })
        .rpc();

      // Verify milestone completion
      // Add verification logic based on your contract state
    } catch (err) {
      console.error("Error handling milestone payment:", err);
      throw err;
    }
  });
});

// Helper function to derive milestone PDA
function getMilestonePDA(milestoneId: anchor.BN): PublicKey {
  const [pda] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("milestone"),
      milestoneId.toArrayLike(Buffer, "le", 8)
    ],
    program.programId
  );
  return pda;
}