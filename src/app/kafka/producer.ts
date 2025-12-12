import { Kafka, logLevel } from 'kafkajs';
import { env } from '../config/env';

const kafka = new Kafka({
    clientId: env.KAFKA_CLIENT_ID,
    brokers: [env.KAFKA_BROKER!],
    logLevel: logLevel.INFO,
});

const producer = kafka.producer({ idempotent: true });

export const connectProducer = async () => {
    await producer.connect();
    console.log('Kafka producer connected');
};

export const sendUserCreatedEvent = async (user: any) => {
    try {
        await producer.send({
            topic: 'user.created',
            messages: [{ key: user.id, value: JSON.stringify(user) }],
        });
        console.log(`User created event sent: ${user.id}`);
    } catch (err) {
        console.error('Failed to send user.created event', err);
        // Retry logic or DLQ can be implemented here
    }
};
