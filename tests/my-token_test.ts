import { describe, expect, it } from 'vitest';
import {
    Chain,
    Account,
    types,
} from './utils';

const accounts = Chain.getAccounts();
const deployer = accounts.get('deployer')!;
const wallet1 = accounts.get('wallet_1')!;
const wallet2 = accounts.get('wallet_2')!;

describe('my-token contract test', () => {
    it('ensures contract owner can mint tokens', () => {
        // Mint 1000 tokens to wallet1
        const mintResult = Chain.mineBlock([
            Chain.callContract('my-token', 'mint', [
                types.uint(1000),
                types.principal(wallet1.address),
            ], deployer.address),
        ]).receipts[0].result;

        // Check mint result
        expect(mintResult).toBeOk(types.uint(1000));

        // Check wallet1 balance
        const balance = Chain.callReadOnlyFn(
            'my-token',
            'get-balance',
            [types.principal(wallet1.address)],
            deployer.address,
        ).result;

        expect(balance).toBeOk(types.uint(1000));
    });

    it('ensures token transfer works correctly', () => {
        // First mint some tokens to wallet1
        Chain.mineBlock([
            Chain.callContract('my-token', 'mint', [
                types.uint(1000),
                types.principal(wallet1.address),
            ], deployer.address),
        ]);

        // Transfer 500 tokens from wallet1 to wallet2
        const transferResult = Chain.mineBlock([
            Chain.callContract('my-token', 'transfer', [
                types.uint(500),
                types.principal(wallet1.address),
                types.principal(wallet2.address),
            ], wallet1.address),
        ]).receipts[0].result;

        // Check transfer result
        expect(transferResult).toBeOk(types.uint(500));

        // Check wallet2 balance
        const wallet2Balance = Chain.callReadOnlyFn(
            'my-token',
            'get-balance',
            [types.principal(wallet2.address)],
            deployer.address,
        ).result;

        expect(wallet2Balance).toBeOk(types.uint(500));
    });

    it('ensures non-owner cannot mint tokens', () => {
        // Try to mint tokens from non-owner account
        const mintResult = Chain.mineBlock([
            Chain.callContract('my-token', 'mint', [
                types.uint(1000),
                types.principal(wallet1.address),
            ], wallet1.address),
        ]).receipts[0].result;

        // Should return error 100 (err-owner-only)
        expect(mintResult).toBeErr(types.uint(100));
    });
});
