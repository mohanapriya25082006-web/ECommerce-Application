package com.ecommerce.config;
import com.ecommerce.security.JwtFilter; import org.springframework.context.annotation.*; import org.springframework.http.HttpMethod; import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy; import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder; import org.springframework.security.crypto.password.PasswordEncoder; import org.springframework.security.web.SecurityFilterChain; import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.*;
@Configuration
public class SecurityConfig {
 @Bean PasswordEncoder passwordEncoder(){return new BCryptPasswordEncoder();}
 @Bean SecurityFilterChain filterChain(HttpSecurity http,JwtFilter jwt)throws Exception{
  http.csrf(c->c.disable()).cors(c->c.configurationSource(corsSource())).sessionManagement(s->s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
   .authorizeHttpRequests(a->a.requestMatchers("/api/auth/**").permitAll().requestMatchers(HttpMethod.GET,"/api/products/**").permitAll().requestMatchers("/error").permitAll().requestMatchers("/api/admin/**").hasRole("ADMIN").anyRequest().authenticated())
   .addFilterBefore(jwt,UsernamePasswordAuthenticationFilter.class); return http.build();
 }
 @Bean CorsConfigurationSource corsSource(){CorsConfiguration c=new CorsConfiguration();c.addAllowedOrigin("http://localhost:5173");c.addAllowedHeader("*");c.addAllowedMethod("*");c.setAllowCredentials(true);UrlBasedCorsConfigurationSource s=new UrlBasedCorsConfigurationSource();s.registerCorsConfiguration("/**",c);return s;}
}
