package services;

import java.util.concurrent.ConcurrentHashMap;
import java.util.logging.Logger;

/**
 * High-performance thread-safe caching layer for SkyVoyage.
 * Implements Time-To-Live (TTL) logic to ensure data freshness for external API responses.
 */
public class CacheManager {
    private static final Logger LOGGER = Logger.getLogger(CacheManager.class.getName());
    
    // Cache entry with expiration timestamp
    private static class CacheEntry {
        final String data;
        final long expiryTime;

        CacheEntry(String data, long ttlMillis) {
            this.data = data;
            this.expiryTime = System.currentTimeMillis() + ttlMillis;
        }

        boolean isExpired() {
            return System.currentTimeMillis() > expiryTime;
        }
    }

    private final ConcurrentHashMap<String, CacheEntry> cache = new ConcurrentHashMap<>();
    private static final long DEFAULT_TTL = 300000; // 5 minutes in milliseconds

    /**
     * Retrieves data from the cache if it exists and hasn't expired.
     */
    public String get(String key) {
        CacheEntry entry = cache.get(key);
        if (entry != null) {
            if (!entry.isExpired()) {
                LOGGER.info("Celestial Cache HIT: [" + key + "]");
                return entry.data;
            } else {
                LOGGER.info("Celestial Cache EXPIRED: [" + key + "]");
                cache.remove(key);
            }
        }
        return null;
    }

    /**
     * Stores data in the cache with the default TTL.
     */
    public void put(String key, String data) {
        LOGGER.info("Updating Celestial Manifest for: [" + key + "]");
        cache.put(key, new CacheEntry(data, DEFAULT_TTL));
    }

    /**
     * Clears all entries from the cache (Administrative Reset).
     */
    public void clear() {
        LOGGER.info("Purging all celestial temporal data...");
        cache.clear();
    }
}
