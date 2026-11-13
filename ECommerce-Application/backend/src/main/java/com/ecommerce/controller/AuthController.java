package com.ecommerce.controller;
import com.ecommerce.model.*; import com.ecommerce.repository.UserRepository; import com.ecommerce.security.JwtService;
import jakarta.validation.Valid; import jakarta.validation.constraints.*; import org.springframework.http.*; import org.springframework.security.crypto.password.PasswordEncoder; import org.springframework.web.bind.annotation.*; import java.util.Map;
@RestController @RequestMapping("/api/auth")
public class AuthController {
 private final UserRepository users; private final PasswordEncoder encoder; private final JwtService jwt;
 public AuthController(UserRepository u,PasswordEncoder e,JwtService j){users=u;encoder=e;jwt=j;}
 record RegisterRequest(@NotBlank String name,@Email @NotBlank String email,@Size(min=8) String password){}
 record LoginRequest(@Email String email,@NotBlank String password){}
 @PostMapping("/register") public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest r){
  if(users.existsByEmail(r.email()))return ResponseEntity.badRequest().body(Map.of("message","Email already registered"));
  AppUser u=new AppUser();u.setName(r.name());u.setEmail(r.email().toLowerCase());u.setPassword(encoder.encode(r.password()));u.setRole(Role.USER);users.save(u);
  return ResponseEntity.ok(Map.of("token",jwt.generate(u.getEmail(),u.getRole().name()),"user",Map.of("id",u.getId(),"name",u.getName(),"email",u.getEmail(),"role",u.getRole())));
 }
 @PostMapping("/login") public ResponseEntity<?> login(@Valid @RequestBody LoginRequest r){
  var u=users.findByEmail(r.email().toLowerCase()).orElse(null);if(u==null||!encoder.matches(r.password(),u.getPassword()))return ResponseEntity.status(401).body(Map.of("message","Invalid email or password"));
  return ResponseEntity.ok(Map.of("token",jwt.generate(u.getEmail(),u.getRole().name()),"user",Map.of("id",u.getId(),"name",u.getName(),"email",u.getEmail(),"role",u.getRole())));
 }
}
