package org.app.agentservice.tools;


import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import dev.langchain4j.agent.tool.Tool;
import org.app.agentservice.client.OrderClient;
import org.app.agentservice.client.ProductClient;
import org.springframework.stereotype.Component;


@Component
public class OrderTool {


    private final ProductClient productClient;

    private final OrderClient orderClient;


    private final ObjectMapper mapper =
            new ObjectMapper();



    public OrderTool(
            OrderClient orderClient,
            ProductClient productClient
    ){

        this.orderClient = orderClient;
        this.productClient = productClient;

    }



    // =========================
    // ADD TO CART
    // =========================


    @Tool("Add product to cart")
    public String addToCart(
            String userId,
            String productName,
            Integer quantity
    ){

        try {


            if(quantity == null){
                quantity = 1;
            }


            JsonNode product =
                    findProduct(productName);



            if(product == null){

                return "Product not found";

            }



            orderClient.addToCart(
                    userId,
                    product.get("id").asText(),
                    product.get("name").asText(),
                    product.get("price").asDouble(),
                    quantity
            );



            return "Product added to cart: "
                    + product.get("name").asText()
                    + " quantity "
                    + quantity;


        }
        catch(Exception e){


            e.printStackTrace();

            return "Error adding product : "
                    + e.getMessage();

        }

    }







    // =========================
    // GET CART
    // =========================


    @Tool("Get shopping cart")
    public String getCart(
            String userId
    ){

        return orderClient.getCart(userId);

    }







    // =========================
    // CREATE ORDER
    // =========================


    @Tool("Create order from cart")
    public String createOrder(
            String userId,
            String paymentMethod
    ){

        return orderClient.createOrder(
                userId,
                paymentMethod
        );

    }









    // =========================
    // BUY + PAYMENT
    // =========================


    @Tool("Complete purchase with payment")
    public String buyProduct(
            String userId,
            String productName,
            Integer quantity,
            String paymentMethod
    ){


        try {


            if(quantity == null){
                quantity = 1;
            }


            if(paymentMethod == null){
                paymentMethod = "ONLINE";
            }



            JsonNode product =
                    findProduct(productName);



            if(product == null){

                return "Product not found";

            }



            // ADD TO CART

            orderClient.addToCart(
                    userId,
                    product.get("id").asText(),
                    product.get("name").asText(),
                    product.get("price").asDouble(),
                    quantity
            );





            // CREATE ORDER

            String orderResponse =
                    orderClient.createOrder(
                            userId,
                            paymentMethod.toUpperCase()
                    );



            JsonNode order =
                    mapper.readTree(orderResponse);



            String orderId =
                    order.get("orderId").asText();





            // ONLINE PAYMENT ONLY

            if(paymentMethod.equalsIgnoreCase("ONLINE")){


                return orderClient.createCheckout(orderId);


            }



            return "Order created successfully with Cash on delivery";


        }
        catch(Exception e){


            e.printStackTrace();

            return "Purchase failed : "
                    + e.getMessage();

        }

    }








    // =========================
    // ORDERS
    // =========================


    @Tool("Get order details")
    public String getOrder(
            String orderId
    ){

        return orderClient.getOrder(orderId);

    }







    @Tool("Get user orders")
    public String getUserOrders(
            String userId
    ){

        return orderClient.getUserOrders(userId);

    }







    // =========================
    // PAYMENT
    // =========================


    @Tool("Cancel payment")
    public String cancelPayment(
            String orderId
    ){

        return orderClient.cancelPayment(orderId);

    }







    // =========================
    // HELPER
    // =========================


    private JsonNode findProduct(
            String productName
    ) throws Exception {



        String response =
                productClient.searchProducts(productName);



        JsonNode products =
                mapper.readTree(response);




        // API returns list

        if(products.isArray()){


            if(products.isEmpty()){

                return null;

            }


            return products.get(0);


        }




        // API returns single object

        return products;

    }



}