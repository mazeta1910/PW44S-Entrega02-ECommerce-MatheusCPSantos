package br.edu.utfpr.pb.pw44s.server.dto;

import br.edu.utfpr.pb.pw44s.server.model.enums.OrderSupportRequestType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderSupportRequestDTO {

    @NotNull(message = "Informe o tipo de solicitação.")
    private OrderSupportRequestType type;

    @Size(max = 500, message = "A mensagem deve ter no máximo 500 caracteres.")
    private String message;
}
