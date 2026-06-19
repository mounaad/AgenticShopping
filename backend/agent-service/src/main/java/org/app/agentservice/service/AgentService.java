package org.app.agentservice.service;


import dev.langchain4j.model.ollama.OllamaChatModel;
import dev.langchain4j.service.AiServices;
import org.app.agentservice.ai.ShoppingAssistant;
import org.app.agentservice.tools.OrderTool;
import org.app.agentservice.tools.ProductTool;
import org.springframework.stereotype.Service;


@Service
public class AgentService {



    private final ShoppingAssistant assistant;




    public AgentService(
            OllamaChatModel model,
            ProductTool productTool,
            OrderTool orderTool
    ){


        this.assistant =
                AiServices.builder(ShoppingAssistant.class)

                        .chatLanguageModel(model)

                        .tools(
                                productTool,
                                orderTool
                        )

                        .build();


    }




    public String chat(
            String userId,
            String message
    ){


        return assistant.chat(
                """
                User id: %s

                User request:
                %s
                """
                        .formatted(
                                userId,
                                message
                        )
        );


    }



}