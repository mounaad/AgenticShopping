package org.app.agentservice.entity;


import jakarta.persistence.*;
import lombok.*;


@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ConversationMemory {


    @Id
    @GeneratedValue(
            strategy = GenerationType.IDENTITY
    )
    private Long id;


    private Long userId;


    @Column(columnDefinition = "TEXT")
    private String messages;

}