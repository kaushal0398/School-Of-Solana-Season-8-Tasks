use anchor_lang::prelude::*;
use crate::state::Vault;
use crate::errors::VaultError;
use crate::events::WithdrawEvent;

#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(mut)]
    pub vault_authority: Signer<'info>,
    #[account(
        mut,
        seeds = [b"vault", vault_authority.key().as_ref()],
        bump,
        constraint = vault.vault_authority == vault_authority.key() @ VaultError::Unauthorized,
        constraint = !vault.locked @ VaultError::VaultLocked,
    )]
    pub vault: Account<'info, Vault>,
}

pub fn _withdraw(ctx: Context<Withdraw>, amount: u64) -> Result<()> {
    let vault = &mut ctx.accounts.vault;
    let vault_authority = &ctx.accounts.vault_authority;

    // Verify that the vault has enough balance to withdraw
    require!(vault.to_account_info().lamports() >= amount, VaultError::InsufficientBalance);

    // Transfer lamports from vault to vault authority
    **vault.to_account_info().try_borrow_mut_lamports()? -= amount;
    **vault_authority.to_account_info().try_borrow_mut_lamports()? += amount;

    // Emit a withdraw event after successful transfer
    emit!(WithdrawEvent {
        amount,
        vault_authority: vault_authority.key(),
        vault: vault.key(),
    });

    Ok(())
}