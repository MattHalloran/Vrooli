// Handles wallet integration
import { walletInitMutation, walletCompleteMutation } from 'graphql/mutation';
import { initializeApollo } from 'graphql/utils/initialize';
import { Session } from 'types';
import { Pubs } from 'utils';

export const hasWalletExtension = () => Boolean(window.cardano);

const connectWallet = async (): Promise<boolean> => {
    if (!hasWalletExtension()) return false;
    return await window.cardano.enable();
}

// Initiate handshake to verify wallet with backend
// Returns hex string of payload, to be signed by wallet
const walletInit = async (publicAddress: string): Promise<any> => {
    const client = initializeApollo();
    const result = await client.mutate({
        mutation: walletInitMutation,
        variables: { input: { publicAddress } }
    });
    return result.data.walletInit;
}

/**
 * Completes handshake to verify wallet with backend
 * @param publicAddress Wallet's public address
 * @param signedMessage Message signed by wallet
 * @returns Session object if successful, null if not
 */
const walletComplete = async (publicAddress: string, signedMessage: string): Promise<Session | null> => {
    const client = initializeApollo();
    const result = await client.mutate({
        mutation: walletCompleteMutation,
        variables: { input: { publicAddress, signedMessage } }
    });
    return result.data.walletComplete;
}

// Signs payload received from walletInit
const signPayload = async (publicAddress: string, payload: string): Promise<any> => {
    if (!hasWalletExtension()) return null;
    return await window.cardano.signData(publicAddress, payload);
}

/**
 * Establish trust between a user's wallet and the backend
 * @returns Session object or null
 */
export const validateWallet = async (): Promise<Session | null> => {
    let session: Session | null = null;
    try {
        // Connect to wallet extension
        const walletConnected = await connectWallet();
        if (!walletConnected) return null;
        // Find wallet address
        const address = await window.cardano.getRewardAddress();
        // Request payload from backend
        const payload = await walletInit(address);
        if (!payload) return null;
        // Sign payload with wallet
        const signedPayload = await signPayload(address, payload);
        if (!signedPayload) return null;
        // Send signed payload to backend for verification
        session = await walletComplete(address, signedPayload);
    } catch (error: any) {
        console.error('Caught error completing wallet validation', error);
        PubSub.publish(Pubs.AlertDialog, {
            message: error.message ?? 'Unknown error occurred',
            buttons: [{ text: 'OK' }]
        });
    } finally {
        return session;
    }
}