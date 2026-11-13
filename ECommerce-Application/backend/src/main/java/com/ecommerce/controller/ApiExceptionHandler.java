package com.ecommerce.controller;
import org.springframework.http.*; import org.springframework.web.bind.annotation.*; import java.util.Map;
@RestControllerAdvice public class ApiExceptionHandler {
 @ExceptionHandler(IllegalArgumentException.class) ResponseEntity<?> bad(IllegalArgumentException e){return ResponseEntity.badRequest().body(Map.of("message",e.getMessage()));}
 @ExceptionHandler(Exception.class) ResponseEntity<?> other(Exception e){return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message","Request could not be completed"));}
}
