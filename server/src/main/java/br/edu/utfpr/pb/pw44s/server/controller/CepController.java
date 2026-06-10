package br.edu.utfpr.pb.pw44s.server.controller;

import br.edu.utfpr.pb.pw44s.server.dto.CepLookupDTO;
import br.edu.utfpr.pb.pw44s.server.service.CepLookupService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("cep")
public class CepController {

    private final CepLookupService cepLookupService;

    public CepController(CepLookupService cepLookupService) {
        this.cepLookupService = cepLookupService;
    }

    @GetMapping("{zipCode}")
    public ResponseEntity<CepLookupDTO> lookup(@PathVariable String zipCode) {
        try {
            return ResponseEntity.ok(cepLookupService.lookup(zipCode));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().build();
        }
    }
}
