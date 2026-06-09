package br.edu.utfpr.pb.pw44s.server.service;

import br.edu.utfpr.pb.pw44s.server.dto.CepLookupDTO;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

import java.util.Optional;

@Service
public class CepLookupService {

    private final RestClient restClient = RestClient.create();

    public CepLookupDTO lookup(String zipCode) {
        String cleanZipCode = zipCode.replaceAll("\\D", "");

        if (cleanZipCode.length() != 8) {
            throw new IllegalArgumentException("CEP inválido. Informe 8 dígitos.");
        }

        ViaCepResponse response;

        try {
            response = restClient.get()
                    .uri("https://viacep.com.br/ws/{cep}/json/", cleanZipCode)
                    .retrieve()
                    .body(ViaCepResponse.class);
        } catch (RestClientException ex) {
            throw new IllegalArgumentException("Não foi possível consultar o CEP no momento.");
        }

        if (response == null || response.isNotFound()) {
            return buildNotFoundResponse(cleanZipCode);
        }

        return CepLookupDTO.builder()
                .zipCode(formatZipCode(cleanZipCode))
                .street(nullToEmpty(response.logradouro))
                .complement(nullToEmpty(response.complemento))
                .neighborhood(nullToEmpty(response.bairro))
                .city(nullToEmpty(response.localidade))
                .state(nullToEmpty(response.uf))
                .found(true)
                .build();
    }

    private CepLookupDTO buildNotFoundResponse(String cleanZipCode) {
        CepLookupDTO.CepLookupDTOBuilder builder = CepLookupDTO.builder()
                .zipCode(formatZipCode(cleanZipCode))
                .street("")
                .complement("")
                .neighborhood("")
                .city("")
                .state("")
                .found(false);

        resolveRegionByPrefix(cleanZipCode).ifPresent(region -> builder
                .city(region[0])
                .state(region[1]));

        return builder.build();
    }

    private Optional<String[]> resolveRegionByPrefix(String cleanZipCode) {
        String prefix = cleanZipCode.substring(0, 5);

        if (prefix.compareTo("85501") >= 0 && prefix.compareTo("85505") <= 0) {
            return Optional.of(new String[]{"Pato Branco", "PR"});
        }

        return Optional.empty();
    }

    private String formatZipCode(String digits) {
        return digits.substring(0, 5) + "-" + digits.substring(5);
    }

    private String nullToEmpty(String value) {
        return value == null ? "" : value.trim();
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private static class ViaCepResponse {
        public String logradouro;
        public String complemento;
        public String bairro;
        public String localidade;
        public String uf;
        public Object erro;

        boolean isNotFound() {
            if (erro == null) {
                return false;
            }
            if (erro instanceof Boolean bool) {
                return bool;
            }
            return "true".equalsIgnoreCase(String.valueOf(erro));
        }
    }
}
