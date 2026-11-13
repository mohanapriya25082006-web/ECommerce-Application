package com.ecommerce.controller;
import com.ecommerce.model.Product; import com.ecommerce.repository.ProductRepository; import org.springframework.web.bind.annotation.*; import java.util.List;
@RestController @RequestMapping("/api/products")
public class ProductController {
 private final ProductRepository repo; public ProductController(ProductRepository r){repo=r;}
 @GetMapping public List<Product> all(){return repo.findByActiveTrue();}
 @GetMapping("/{id}") public Product one(@PathVariable Long id){return repo.findById(id).filter(Product::isActive).orElseThrow();}
}
