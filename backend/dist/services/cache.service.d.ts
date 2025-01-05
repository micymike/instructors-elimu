export declare class CacheService {
    private cache;
    set(key: string, value: any, ttl?: number): void;
    get<T>(key: string): T | null;
    delete(key: string): void;
    clear(): void;
    keys(): string[];
}
