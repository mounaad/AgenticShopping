package org.app.agentservice.tools;


import dev.langchain4j.agent.tool.Tool;
import org.app.agentservice.client.ProductClient;
import org.springframework.stereotype.Component;


@Component
public class ProductTool {


    private final ProductClient productClient;


    public ProductTool(ProductClient productClient){

        this.productClient = productClient;

    }


    @Tool("Search products by name or keyword")
    public String searchProducts(String query){

        return productClient.searchProducts(query);

    }


}