export declare const MongodbConfig: (() => {
    uri: string;
    options: {
        maxPoolSize: number;
        minPoolSize: number;
        maxIdleTimeMS: number;
        serverSelectionTimeoutMS: number;
        socketTimeoutMS: number;
        bufferMaxEntries: number;
        bufferCommands: boolean;
    };
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    uri: string;
    options: {
        maxPoolSize: number;
        minPoolSize: number;
        maxIdleTimeMS: number;
        serverSelectionTimeoutMS: number;
        socketTimeoutMS: number;
        bufferMaxEntries: number;
        bufferCommands: boolean;
    };
}>;
