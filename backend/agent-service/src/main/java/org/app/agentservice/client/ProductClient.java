package org.app.agentservice.client;


import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;


@FeignClient(
        name="product-service"
)
public interface ProductClient {


    @GetMapping("/api/products/search")
    String searchProducts(
            @RequestParam("name") String name
    );


}