package org.app.agentservice.tools;


import dev.langchain4j.agent.tool.Tool;
import org.app.agentservice.client.OrderClient;
import org.springframework.stereotype.Component;


@Component
public class OrderTool {


    private final OrderClient orderClient;


    public OrderTool(OrderClient orderClient){

        this.orderClient = orderClient;

    }


    @Tool("Get order details by order id")
    public String trackOrder(Long orderId){

        return orderClient.getOrder(orderId);

    }


}