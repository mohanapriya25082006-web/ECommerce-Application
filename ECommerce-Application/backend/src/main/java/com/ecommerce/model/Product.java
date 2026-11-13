package com.ecommerce.model;
import jakarta.persistence.*; import java.math.BigDecimal;
@Entity @Table(name="products")
public class Product {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @Column(nullable=false) private String name;
 @Column(length=2000) private String description;
 @Column(nullable=false,precision=10,scale=2) private BigDecimal price;
 private String category; private String imageUrl;
 @Column(nullable=false) private Integer stock=0;
 private boolean active=true;
 public Long getId(){return id;} public String getName(){return name;} public void setName(String v){name=v;}
 public String getDescription(){return description;} public void setDescription(String v){description=v;}
 public BigDecimal getPrice(){return price;} public void setPrice(BigDecimal v){price=v;}
 public String getCategory(){return category;} public void setCategory(String v){category=v;}
 public String getImageUrl(){return imageUrl;} public void setImageUrl(String v){imageUrl=v;}
 public Integer getStock(){return stock;} public void setStock(Integer v){stock=v;}
 public boolean isActive(){return active;} public void setActive(boolean v){active=v;}
}
