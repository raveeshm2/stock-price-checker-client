export interface SubscriptionPayload {
    endpoint: string;
    keys: {
        auth: string;
        p256dh: string;
    }
}
