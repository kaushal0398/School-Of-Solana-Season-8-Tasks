use anchor_lang::prelude::*;
use anchor_lang::solana_program::program::invoke;
use anchor_lang::solana_program::system_instruction::transfer;
use crate::state::Vault;
use crate::errors::VaultError;
use crate::events::DepositEvent;

#[derive(Accounts)]
pub struct Deposit<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(
        mut,
        seeds = [b"vault", vault.vault_authority.as_ref()],
        bump,
        constraint = !vault.locked @ VaultError::VaultLocked,
    )]
    pub vault: Account<'info, Vault>,
    pub system_program: Program<'info, System>,
}

pub fn _deposit(ctx: Context<Deposit>, amount: u64) -> Result<()> {
    let user = &ctx.accounts.user;
    let vault = &ctx.accounts.vault;
    let system_program = &ctx.accounts.system_program;

    // Verify that the user has enough balance to deposit
    require!(user.lamports() >= amount, VaultError::InsufficientBalance);

    // Transfer lamports from user to vault using CPI
    let transfer_instruction = transfer(
        &user.key(),
        &vault.key(),
        amount,
    );

    invoke(
        &transfer_instruction,
        &[
            user.to_account_info(),
            vault.to_account_info(),
            system_program.to_account_info(),
        ],
    )?;

    // Emit a deposit event after successful transfer
    emit!(DepositEvent {
        amount,
        user: user.key(),
        vault: vault.key(),
    });

    Ok(())
}