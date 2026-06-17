package org.app.agentservice.repository;


import org.app.agentservice.entity.ConversationMemory;
import org.springframework.data.jpa.repository.JpaRepository;


import java.util.Optional;


public interface ConversationMemoryRepository
        extends JpaRepository<ConversationMemory,Long>{


    Optional<ConversationMemory>
    findByUserId(Long userId);


}