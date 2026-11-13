package com.ecommerce.model;
import java.math.BigDecimal;
 import java.time.LocalDateTime;
 import java.util.ArrayList;
 import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
@Entity @Table(name="customer_orders")
public class CustomerOrder {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @ManyToOne(optional=false) private AppUser user;
 @Column(nullable=false,precision=10,scale=2) private BigDecimal total;
 @Column(nullable=false) private String status="PLACED";
 @Column(nullable=false) private String paymentMethod="COD";
 @Column(nullable=false,length=1000) private String shippingAddress;
 private LocalDateTime createdAt=LocalDateTime.now();
 @OneToMany(mappedBy="order",cascade=CascadeType.ALL,orphanRemoval=true) private List<OrderItem> items=new ArrayList<>();
 public Long getId(){return id;} public AppUser getUser(){return user;} public void setUser(AppUser v){user=v;}
 public BigDecimal getTotal(){return total;} public void setTotal(BigDecimal v){total=v;}
 public String getStatus(){return status;} public void setStatus(String v){status=v;}
 public String getPaymentMethod(){return paymentMethod;} public void setPaymentMethod(String v){paymentMethod=v;}
 public String getShippingAddress(){return shippingAddress;} public void setShippingAddress(String v){shippingAddress=v;}
 public LocalDateTime getCreatedAt(){return createdAt;} public List<OrderItem> getItems(){return items;}
}
