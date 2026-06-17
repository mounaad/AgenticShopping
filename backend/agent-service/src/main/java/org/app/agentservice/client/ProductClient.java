package org.app.agentservice.client;


import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;


@FeignClient(
        name="product-service",
        url="http://localhost:8083"
)
public interface ProductClient {


    @GetMapping("/api/products/search")
    String searchProducts(
            @RequestParam("query") String query
    );


}