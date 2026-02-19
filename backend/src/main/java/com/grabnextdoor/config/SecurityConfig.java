package com.grabnextdoor.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // Disable CSRF protection as we are not using cookies for session management
            .csrf(csrf -> csrf.disable())
            
            // Configure authorization rules
            .authorizeHttpRequests(authz -> authz
                // All requests must be authenticated
                .anyRequest().authenticated()
            )
            
            // Disable form-based login
            .formLogin(formLogin -> formLogin.disable())
            
            // Disable HTTP Basic authentication
            .httpBasic(httpBasic -> httpBasic.disable());
            
        return http.build();
    }
}
