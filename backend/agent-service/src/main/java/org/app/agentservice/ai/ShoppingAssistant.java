package org.app.agentservice.ai;

import dev.langchain4j.service.*;


public interface ShoppingAssistant {


    @SystemMessage("""
                        You are an intelligent e-commerce assistant.
            
                            Your role:
            
                            - help customers search for products
                            - recommend products
                            - track orders
                            - answer questions
            
                            If any information is missing, ask for clarification.
            
                            Use the available tools.
            
            """)
    String chat(
            @UserMessage String message
    );
}