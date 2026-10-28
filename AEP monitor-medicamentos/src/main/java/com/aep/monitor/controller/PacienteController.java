package com.aep.monitor.controller;

import com.aep.monitor.model.Paciente;
import com.aep.monitor.service.PacienteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/pacientes")
public class PacienteController {

    private final PacienteService service;

    public PacienteController(PacienteService service) {
        this.service = service;
    }

    @Operation(summary = "Cadastrar um novo paciente")
    @ApiResponse(responseCode = "201", description = "Paciente cadastrado com sucesso")
    @ApiResponse(responseCode = "400", description = "Dados inválidos")
    @PostMapping
    public ResponseEntity<Paciente> cadastrar(@Valid @RequestBody Paciente paciente) {
        Paciente salvo = service.cadastrar(paciente);
        return ResponseEntity.created(URI.create("/pacientes/" + salvo.getId())).body(salvo);
    }

    @Operation(summary = "Listar todos os pacientes")
    @ApiResponse(responseCode = "200", description = "Lista de pacientes")
    @GetMapping
    public ResponseEntity<List<Paciente>> listarTodos() {
        return ResponseEntity.ok(service.listarTodos());
    }

    @Operation(summary = "Buscar um paciente por id")
    @ApiResponse(responseCode = "200", description = "Paciente encontrado")
    @ApiResponse(responseCode = "404", description = "Paciente não encontrado")
    @GetMapping("/{id}")
    public ResponseEntity<Paciente> buscarPorId(@PathVariable String id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @Operation(summary = "Remover um paciente")
    @ApiResponse(responseCode = "204", description = "Paciente removido")
    @ApiResponse(responseCode = "404", description = "Paciente não encontrado")
    @ApiResponse(responseCode = "409", description = "Paciente possui medicamentos vinculados")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remover(@PathVariable String id) {
        service.remover(id);
        return ResponseEntity.noContent().build();
    }
}
