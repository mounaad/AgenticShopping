package com.agenticshopping.orderservice.service;

import com.agenticshopping.orderservice.entity.Order;
import com.stripe.Stripe;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class StripeService {

    @Value("${stripe.secret.key}")
    private String stripeKey;

    public String createCheckoutSession(Order order) {

        Stripe.apiKey = stripeKey;

        try {
            SessionCreateParams params =
                    SessionCreateParams.builder()
                            .setMode(SessionCreateParams.Mode.PAYMENT)
                            .setSuccessUrl("http://localhost:8084/api/payments/success?orderId=" + order.getId())
                            .setCancelUrl("http://localhost:8084/api/payments/cancel?orderId=" + order.getId())
                            .addLineItem(
                                    SessionCreateParams.LineItem.builder()
                                            .setQuantity(1L)
                                            .setPriceData(
                                                    SessionCreateParams.LineItem.PriceData.builder()
                                                            .setCurrency("eur")
                                                            .setUnitAmount((long)(order.getTotalAmount() * 100))
                                                            .setProductData(
                                                                    SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                                            .setName("Order #" + order.getId())
                                                                            .build()
                                                            )
                                                            .build()
                                            )
                                            .build()
                            )
                            .build();

            Session session = Session.create(params);

            return session.getUrl(); //  URL Stripe Checkout

        } catch (Exception e) {
            throw new RuntimeException("Stripe error: " + e.getMessage());
        }
    }
}
