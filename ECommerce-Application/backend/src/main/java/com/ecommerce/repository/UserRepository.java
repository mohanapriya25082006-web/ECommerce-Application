package com.ecommerce.repository;
import com.ecommerce.model.AppUser; import org.springframework.data.jpa.repository.JpaRepository; import java.util.Optional;
public interface UserRepository extends JpaRepository<AppUser,Long>{ Optional<AppUser> findByEmail(String email); boolean existsByEmail(String email); }
