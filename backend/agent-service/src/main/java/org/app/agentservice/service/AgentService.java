package org.app.agentservice.service;


import dev.langchain4j.model.ollama.OllamaChatModel;
import org.app.agentservice.ai.ShoppingAssistant;
import org.app.agentservice.tools.OrderTool;
import org.app.agentservice.tools.ProductTool;
import org.springframework.stereotype.Service;

import dev.langchain4j.service.AiServices;


@Service
public class AgentService {


    private final ShoppingAssistant assistant;


    public AgentService(
            OllamaChatModel model,
            ProductTool productTool,
            OrderTool orderTool
    ) {


        this.assistant =
                AiServices.builder(ShoppingAssistant.class)
                        .chatLanguageModel(model)
                        .tools(
                                productTool,
                                orderTool
                        )
                        .build();

    }
//        this.assistant =
//                AiServices.builder(ShoppingAssistant.class)
//                        .chatLanguageModel(model)
//                        .build();
//    }



    public String chat(String message){

        return assistant.chat(message);

    }


}