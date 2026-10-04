package com.rollerblading.content.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;

@Component
public class JwtService {
    private final SecretKey key;

    public JwtService(@Value("${jwt.secret}") String secret) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    /** Throws JwtException if the token is invalid or expired */
    public Claims parseClaims(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    // Extract User id
    public String extractUserId(Claims claims) {
        return claims.getSubject();
    }

    // Extrac User Role
    public String extractRole(Claims claims) {
        Object role = claims.get("role");
        return role != null ? role.toString().toUpperCase() : "ROLLER";
    }
}
