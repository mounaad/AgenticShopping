package com.agenticshopping.userservice.dto;
import com.agenticshopping.userservice.model.Role;
import lombok.Data;

@Data
public class RegisterRequest {

    private String email;
    private String password;
    private String fullName;
    private String phone;
    private Role role;
}