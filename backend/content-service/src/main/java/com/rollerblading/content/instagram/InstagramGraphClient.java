package com.rollerblading.content.instagram;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Client placeholder against Instagram Graph API
 * using 'instagram.graph-api-token'.
 */
@Component
public class InstagramGraphClient {

    private final String token;

    public InstagramGraphClient(@Value("${instagram.graph-api-token}") String token) {
        this.token = token;
    }

    public List<InstagramPost> fetchLatestPosts() {
        // All: integrate with https://graph.instagram.com/me/media with 'token'
        return List.of();
    }
}