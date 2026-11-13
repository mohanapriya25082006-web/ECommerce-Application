package com.ecommerce.controller;
import com.ecommerce.model.*; import com.ecommerce.repository.*; import org.springframework.security.core.Authentication; import org.springframework.web.bind.annotation.*; import java.math.BigDecimal; import java.util.*;
@RestController @RequestMapping("/api/orders")
public class OrderController {
 private final OrderRepository orders; private final ProductRepository products; private final UserRepository users;
 public OrderController(OrderRepository o,ProductRepository p,UserRepository u){orders=o;products=p;users=u;}
 record ItemRequest(Long productId,Integer quantity){} record CheckoutRequest(String shippingAddress,List<ItemRequest> items){}
 @PostMapping public CustomerOrder checkout(@RequestBody CheckoutRequest req,Authentication auth){
  if(req.shippingAddress()==null||req.shippingAddress().isBlank()||req.items()==null||req.items().isEmpty())throw new IllegalArgumentException("Address and cart items are required");
  AppUser user=users.findByEmail(auth.getName()).orElseThrow();CustomerOrder order=new CustomerOrder();order.setUser(user);order.setShippingAddress(req.shippingAddress());order.setPaymentMethod("COD");BigDecimal total=BigDecimal.ZERO;
  for(ItemRequest i:req.items()){if(i.quantity()==null||i.quantity()<1)throw new IllegalArgumentException("Invalid quantity");Product p=products.findById(i.productId()).orElseThrow();if(!p.isActive()||p.getStock()<i.quantity())throw new IllegalArgumentException("Insufficient stock for "+p.getName());p.setStock(p.getStock()-i.quantity());products.save(p);OrderItem line=new OrderItem();line.setOrder(order);line.setProduct(p);line.setQuantity(i.quantity());line.setUnitPrice(p.getPrice());order.getItems().add(line);total=total.add(p.getPrice().multiply(BigDecimal.valueOf(i.quantity())));}
  order.setTotal(total);return orders.save(order);
 }
 @GetMapping public List<CustomerOrder> mine(Authentication auth){AppUser u=users.findByEmail(auth.getName()).orElseThrow();return orders.findByUserIdOrderByCreatedAtDesc(u.getId());}
}
