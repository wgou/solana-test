#[macro_use]
extern crate borsh_derive;

use borsh::{BorshDeserialize, BorshSerialize,maybestd::format};
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    program_error::ProgramError,
    pubkey::Pubkey,
};

#[derive(Clone, Debug, BorshSerialize, BorshDeserialize, PartialEq)]
pub enum HelloWorldInstruction {
    Greeting {
        counter: u32,
    },
}

pub struct Processor;
impl Processor {
    pub fn process_instruction(
        program_id: &Pubkey,
        accounts: &[AccountInfo],
        instruction_data: &[u8],
    ) -> ProgramResult {
        let instruction = HelloWorldInstruction::try_from_slice(instruction_data)
            .map_err(|_| ProgramError::InvalidInstructionData)?;

        match instruction {
            HelloWorldInstruction::Greeting { counter } => {
                msg!("Instruction: Greeting");
                Self::process_greeting(program_id, accounts, counter)
            }
        }
    }

    fn process_greeting(
        _program_id: &Pubkey,
        accounts: &[AccountInfo],
        counter: u32,
    ) -> ProgramResult {
        let account_info_iter = &mut accounts.iter();
        let account = next_account_info(account_info_iter)?;

        msg!("Greeting counter: {}", counter);

        let mut data = account.try_borrow_mut_data()?;
        data[0] = counter as u8;

        Ok(())
    }
}

entrypoint!(process_instruction);
fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    Processor::process_instruction(program_id, accounts, instruction_data)
}
