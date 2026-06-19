package org.app.agentservice.controller;


import lombok.RequiredArgsConstructor;

import org.app.agentservice.dto.ChatRequest;
import org.app.agentservice.dto.ChatResponse;

import org.app.agentservice.service.AgentService;

import org.springframework.web.bind.annotation.*;



@RestController
@RequestMapping("/api/agent")
@RequiredArgsConstructor
public class AgentController {


    private final AgentService agentService;



    @PostMapping("/chat")
    public ChatResponse chat(
            @RequestBody ChatRequest request
    ){


        String answer =
                agentService.chat(
                        request.getUserId(),
                        request.getMessage()
                );


        return new ChatResponse(answer);


    }


}