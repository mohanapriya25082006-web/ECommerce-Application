
package com.ecommerce.config;

import java.math.BigDecimal;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.ecommerce.model.AppUser;
import com.ecommerce.model.Product;
import com.ecommerce.model.Role;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.UserRepository;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seed(
            UserRepository users,
            ProductRepository products,
            PasswordEncoder encoder) {

        return args -> {

            if (!users.existsByEmail("admin@shop.com")) {
                AppUser admin = new AppUser();
                admin.setName("Store Admin");
                admin.setEmail("admin@shop.com");
                admin.setPassword(encoder.encode("Admin@123"));
                admin.setRole(Role.ADMIN);
                users.save(admin);
            }

            if (products.count() == 0) {

                String[][] data = {
                    {"Classic Sneakers", "Everyday comfort sneakers", "Footwear",
                     "49.99", "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=700", "25"},

                    {"Minimal Backpack", "A clean everyday backpack", "Accessories",
                     "39.00", "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=700", "18"},

                    {"Wireless Headphones", "Immersive sound and comfort", "Electronics",
                     "79.50", "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=700", "12"},

                    {"Ceramic Coffee Set", "Minimal ceramic cup set", "Home",
                     "24.00", "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=700", "30"}
                };

                for (String[] d : data) {
                    Product product = new Product();
                    product.setName(d[0]);
                    product.setDescription(d[1]);
                    product.setCategory(d[2]);
                    product.setPrice(new BigDecimal(d[3]));
                    product.setImageUrl(d[4]);
                    product.setStock(Integer.valueOf(d[5]));

                    products.save(product);
                }
            }
        };
    }
}
