package org.app.agentservice.config;

import dev.langchain4j.model.ollama.OllamaChatModel;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


@Configuration
public class AiConfig {



    @Bean
    public OllamaChatModel chatModel(){


        return OllamaChatModel.builder()

                .baseUrl(
                        "http://localhost:11434"
                )

                .modelName(
                        "llama3.2"
                )

                .temperature(0.7)

                .build();


    }


}
