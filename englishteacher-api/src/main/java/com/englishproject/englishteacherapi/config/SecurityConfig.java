package com.englishproject.englishteacherapi.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(authz -> authz
                // Rutas públicas de autenticación
                .requestMatchers("/api/auth/login", "/api/auth/check-email", "/api/auth/validate-token").permitAll()

                // Rutas públicas de consulta (solo lectura)
                .requestMatchers("/api/teachers/all", "/api/teachers/{id}").permitAll()
                .requestMatchers("/api/levels/all", "/api/levels/{id}").permitAll()
                .requestMatchers("/api/activities/all", "/api/activities/{id}", "/api/activities/level/{levelId}").permitAll()

                // Rutas administrativas que requieren JWT
                .requestMatchers("/api/teachers/create", "/api/teachers/update/**", "/api/teachers/delete/**").authenticated()
                .requestMatchers("/api/teachers/admin/**").authenticated()
                .requestMatchers("/api/levels/create", "/api/levels/update/**", "/api/levels/delete/**").authenticated()
                .requestMatchers("/api/activities/create", "/api/activities/update/**", "/api/activities/delete/**").authenticated()

                // H2 Console para desarrollo
                .requestMatchers("/h2-console/**").permitAll()

                .anyRequest().authenticated()
            )
            .headers(headers -> headers.frameOptions(frameOptions -> frameOptions.sameOrigin()))
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Permitir los orígenes configurados en las variables de entorno
        String allowedOrigins = System.getenv("CORS_ORIGINS");
        if (allowedOrigins != null && allowedOrigins.equals("*")) {
            configuration.addAllowedOriginPattern("*");
        } else if (allowedOrigins != null) {
            configuration.setAllowedOrigins(Arrays.asList(allowedOrigins.split(",")));
        } else {
            // Fallback para desarrollo
            configuration.setAllowedOriginPatterns(Arrays.asList("http://localhost:*", "https://*.railway.app"));
        }
        
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
