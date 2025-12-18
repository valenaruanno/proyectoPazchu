package com.englishproject.englishteacherapi.service;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class TokenServices {

    // Clave secreta para firmar tokens (en producción debe estar en variables de entorno)
    @Value("${jwt.secret:mySecretKeyForJWTTokenGenerationThatMustBeAtLeast256BitsLong}")
    private String secretKey;

    @Value("${jwt.expiration:1800}") // 30 minutos por defecto
    private int defaultExpirationTime;

    /**
     * Genera un token JWT para un usuario
     */
    public String generateToken(String email, int expirationTimeInSeconds) {
        Map<String, Object> claims = new HashMap<>();
        return createToken(claims, email, expirationTimeInSeconds);
    }

    /**
     * Genera un token JWT con tiempo de expiración por defecto
     */
    public String generateToken(String email) {
        return generateToken(email, defaultExpirationTime);
    }

    /**
     * Crea el token JWT
     */
    private String createToken(Map<String, Object> claims, String subject, int expirationTimeInSeconds) {
        Date now = new Date(System.currentTimeMillis());
        Date expiryDate = new Date(System.currentTimeMillis() + expirationTimeInSeconds * 1000L);

        SecretKey key = Keys.hmacShaKeyFor(secretKey.getBytes());

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * Extrae el email (subject) del token
     */
    public String extractEmail(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    /**
     * Extrae la fecha de expiración del token
     */
    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    /**
     * Extrae un claim específico del token
     */
    public <T> T extractClaim(String token, ClaimsResolver<T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.resolve(claims);
    }

    /**
     * Extrae todos los claims del token
     */
    private Claims extractAllClaims(String token) {
        SecretKey key = Keys.hmacShaKeyFor(secretKey.getBytes());

        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    /**
     * Verifica si el token ha expirado
     */
    public boolean isTokenExpired(String token) {
        try {
            return extractExpiration(token).before(new Date());
        } catch (JwtException e) {
            return true;
        }
    }

    /**
     * Valida el token
     */
    public boolean validateToken(String token, String email) {
        try {
            final String extractedEmail = extractEmail(token);
            return (extractedEmail.equals(email) && !isTokenExpired(token));
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    /**
     * Valida si el token es válido (sin verificar el email)
     */
    public boolean validateToken(String token) {
        try {
            extractAllClaims(token);
            return !isTokenExpired(token);
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    /**
     * Interface funcional para resolver claims
     */
    @FunctionalInterface
    public interface ClaimsResolver<T> {
        T resolve(Claims claims);
    }
}
