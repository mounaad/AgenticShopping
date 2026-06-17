package org.app.agentservice.client;


import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;


@FeignClient(
        name="order-service",
        url="http://localhost:8084"
)
public interface OrderClient {


    @GetMapping("/api/orders/{id}")
    String getOrder(
            @PathVariable("id") Long id
    );


}