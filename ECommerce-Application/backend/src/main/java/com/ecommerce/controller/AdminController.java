
package com.ecommerce.controller;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ecommerce.model.CustomerOrder;
import com.ecommerce.model.Product;
import com.ecommerce.repository.OrderRepository;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.UserRepository;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final ProductRepository products;
    private final OrderRepository orders;
    private final UserRepository users;

    public AdminController(
            ProductRepository p,
            OrderRepository o,
            UserRepository u) {
        products = p;
        orders = o;
        users = u;
    }

    @GetMapping("/products")
    public List<Product> products() {
        return products.findAll();
    }

    @PostMapping("/products")
    public Product create(@RequestBody Product p) {
        return products.save(p);
    }

    @PutMapping("/products/{id}")
    public Product update(
            @PathVariable Long id,
            @RequestBody Product p) {

        Product old = products.findById(id).orElseThrow();

        old.setName(p.getName());
        old.setDescription(p.getDescription());
        old.setPrice(p.getPrice());
        old.setCategory(p.getCategory());
        old.setImageUrl(p.getImageUrl());
        old.setStock(p.getStock());
        old.setActive(p.isActive());

        return products.save(old);
    }

    @DeleteMapping("/products/{id}")
    public void delete(@PathVariable Long id) {
        Product p = products.findById(id).orElseThrow();
        p.setActive(false);
        products.save(p);
    }

    @GetMapping("/orders")
    public List<CustomerOrder> orders() {
        return orders.findAllByOrderByCreatedAtDesc();
    }

    @PutMapping("/orders/{id}/status")
    public CustomerOrder status(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {

        CustomerOrder o = orders.findById(id).orElseThrow();
        o.setStatus(body.get("status"));

        return orders.save(o);
    }

    @GetMapping("/users")
    public List<Map<String, Object>> users() {
        return this.users.findAll().stream()
                .map(u -> Map.<String, Object>of(
                        "id", u.getId(),
                        "name", u.getName(),
                        "email", u.getEmail(),
                        "role", u.getRole()))
                .toList();
    }
}
