package com.cakeplatform.api.modules.interaction.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ReplyRequest {
    @NotBlank
    private String reply;
}
