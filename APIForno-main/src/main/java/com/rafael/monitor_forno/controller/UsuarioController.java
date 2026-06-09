package com.rafael.monitor_forno.controller;

import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.rafael.monitor_forno.dto.UserRequestDTO;
import com.rafael.monitor_forno.dto.UserResponseDTO;
import com.rafael.monitor_forno.service.UsuarioService;

@RestController
@RequestMapping("v1/usuario")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @PostMapping
    public ResponseEntity<Void> cadastrarUsuario(@RequestBody UserRequestDTO dto) {
        usuarioService.cadastrarUsuario(dto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarUsuario(@PathVariable UUID id) {
       usuarioService.deleteById(id);
       return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserResponseDTO> atualizarUsuario(@RequestBody UserRequestDTO dto, @PathVariable UUID id) {
        UserResponseDTO usuarioAtualizado =
                usuarioService.atualizarUsuario(dto, id);

        return ResponseEntity.ok(usuarioAtualizado);
    }

    @GetMapping
    public ResponseEntity<?> getUsuario(@RequestParam(required = false) UUID id) {
        if (id != null) {
            return ResponseEntity.ok(usuarioService.findById(id));
        }

        return ResponseEntity.ok(usuarioService.findAll());

    }

}
