package br.edu.utfpr.pb.pw44s.server.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CepLookupDTO {

    private String zipCode;
    private String street;
    private String complement;
    private String neighborhood;
    private String city;
    private String state;
    private boolean found;
}
