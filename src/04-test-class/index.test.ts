import {
  getBankAccount,
  BankAccount,
  InsufficientFundsError,
  TransferFailedError,
  SynchronizationFailedError,
} from '.';
import { random } from 'lodash';

jest.mock('lodash');

describe('BankAccount', () => {
  test('should create account with initial balance', () => {
    const balance = 20;
    const myBankAccount = getBankAccount(balance);

    const getBalance = myBankAccount.getBalance();

    expect.assertions(2);

    expect(myBankAccount).toBeInstanceOf(BankAccount);
    expect(getBalance).toBe(balance);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const balance = 20;
    const myBankAccount = getBankAccount(balance);

    expect.assertions(2);

    try {
      myBankAccount.withdraw(40);
    } catch (error) {
      expect(error).toBeInstanceOf(InsufficientFundsError);
      expect(error).toHaveProperty(
        'message',
        `Insufficient funds: cannot withdraw more than ${balance}`,
      );
    }
  });

  test('should throw error when transferring more than balance', () => {
    const balance = 20;
    const myBankAccount = getBankAccount(balance);
    const otherBankAccount = getBankAccount(balance);

    expect.assertions(2);

    try {
      myBankAccount.transfer(40, otherBankAccount);
    } catch (error) {
      expect(error).toBeInstanceOf(InsufficientFundsError);
      expect(error).toHaveProperty(
        'message',
        `Insufficient funds: cannot withdraw more than ${balance}`,
      );
    }
  });

  test('should throw error when transferring to the same account', () => {
    const balance = 20;
    const myBankAccount = getBankAccount(balance);

    expect.assertions(2);

    try {
      myBankAccount.transfer(40, myBankAccount);
    } catch (error) {
      expect(error).toBeInstanceOf(TransferFailedError);
      expect(error).toHaveProperty('message', `Transfer failed`);
    }
  });

  test('should deposit money', () => {
    const balance = 20;
    const myBankAccount = getBankAccount(balance);

    const deposit = myBankAccount.deposit(30);

    expect(deposit).toHaveProperty('_balance', 50);
  });

  test('should withdraw money', () => {
    const balance = 20;
    const myBankAccount = getBankAccount(balance);

    const withdraw = myBankAccount.withdraw(5);

    expect(withdraw).toHaveProperty('_balance', 15);
  });

  test('should transfer money', () => {
    const balance = 20;
    const myBankAccount = getBankAccount(balance);
    const otherBankAccount = getBankAccount(balance);

    myBankAccount.transfer(15, otherBankAccount);

    expect(myBankAccount.getBalance()).toBe(5);
    expect(otherBankAccount.getBalance()).toBe(35);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    const myBankAccount = getBankAccount(20);

    const expectedBalance = 50;
    (random as jest.Mock).mockReturnValueOnce(expectedBalance);
    (random as jest.Mock).mockReturnValueOnce(1);

    const balance = await myBankAccount.fetchBalance();
    expect(balance).toBe(50);
    expect(typeof balance).toBe('number');
    expect(random).toHaveBeenCalledWith(0, 100, false);
    expect(random).toHaveBeenCalledWith(0, 1, false);
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const myBankAccount = getBankAccount(20);
    const expectedBalance = 50;

    jest
      .spyOn(myBankAccount, 'fetchBalance')
      .mockResolvedValue(expectedBalance);

    await myBankAccount.synchronizeBalance();

    expect(myBankAccount.fetchBalance).toHaveBeenCalled();
    expect(myBankAccount.getBalance()).toBe(expectedBalance);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    const balance = 20;
    const myBankAccount = getBankAccount(20);

    jest.spyOn(myBankAccount, 'fetchBalance').mockResolvedValue(null);

    await expect(myBankAccount.synchronizeBalance()).rejects.toThrow(
      SynchronizationFailedError,
    );
    expect(myBankAccount.fetchBalance).toHaveBeenCalled();
    expect(myBankAccount.getBalance()).toBe(balance);
  });
});
