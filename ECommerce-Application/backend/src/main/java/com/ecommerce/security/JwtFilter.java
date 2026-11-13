package com.ecommerce.security;
import com.ecommerce.repository.UserRepository; import jakarta.servlet.*; import jakarta.servlet.http.*; import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority; import org.springframework.security.core.context.SecurityContextHolder; import org.springframework.stereotype.Component; import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException; import java.util.List;
@Component
public class JwtFilter extends OncePerRequestFilter {
 private final JwtService jwt; private final UserRepository users;
 public JwtFilter(JwtService j,UserRepository u){jwt=j;users=u;}
 protected void doFilterInternal(HttpServletRequest req,HttpServletResponse res,FilterChain chain)throws ServletException,IOException{
  String h=req.getHeader("Authorization");
  if(h!=null&&h.startsWith("Bearer ")){try{String email=jwt.email(h.substring(7));var user=users.findByEmail(email).orElseThrow();var auth=new UsernamePasswordAuthenticationToken(email,null,List.of(new SimpleGrantedAuthority("ROLE_"+user.getRole().name())));SecurityContextHolder.getContext().setAuthentication(auth);}catch(Exception ignored){}}
  chain.doFilter(req,res);
 }
}
