package com.aep.monitor.controller;

import com.aep.monitor.dto.AtualizarHorarioRequest;
import com.aep.monitor.model.Medicamento;
import com.aep.monitor.model.RegistroDose;
import com.aep.monitor.service.MedicamentoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/medicamentos")
public class MedicamentoController {

    private final MedicamentoService service;

    public MedicamentoController(MedicamentoService service) {
        this.service = service;
    }

    @Operation(summary = "Cadastrar um novo medicamento")
    @ApiResponse(responseCode = "201", description = "Medicamento cadastrado com sucesso")
    @ApiResponse(responseCode = "400", description = "Dados inválidos")
    @ApiResponse(responseCode = "404", description = "Paciente não encontrado")
    @PostMapping
    public ResponseEntity<Medicamento> cadastrar(@Valid @RequestBody Medicamento medicamento) {
        Medicamento salvo = service.cadastrar(medicamento);
        return ResponseEntity.created(URI.create("/medicamentos/" + salvo.getId())).body(salvo);
    }

    @Operation(summary = "Listar todos os medicamentos cadastrados")
    @ApiResponse(responseCode = "200", description = "Lista de medicamentos")
    @GetMapping
    public ResponseEntity<List<Medicamento>> listarTodos() {
        return ResponseEntity.ok(service.listarTodos());
    }

    @Operation(summary = "Listar os medicamentos de um paciente")
    @ApiResponse(responseCode = "200", description = "Lista de medicamentos do paciente")
    @GetMapping("/paciente/{pacienteId}")
    public ResponseEntity<List<Medicamento>> listarPorPaciente(@PathVariable String pacienteId) {
        return ResponseEntity.ok(service.listarPorPaciente(pacienteId));
    }

    @Operation(summary = "Buscar um medicamento por id")
    @ApiResponse(responseCode = "200", description = "Medicamento encontrado")
    @ApiResponse(responseCode = "404", description = "Medicamento não encontrado")
    @GetMapping("/{id}")
    public ResponseEntity<Medicamento> buscarPorId(@PathVariable String id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @Operation(summary = "Consultar o histórico de doses tomadas de um medicamento")
    @ApiResponse(responseCode = "200", description = "Histórico de doses (lista de subdocumentos)")
    @ApiResponse(responseCode = "404", description = "Medicamento não encontrado")
    @GetMapping("/{id}/historico")
    public ResponseEntity<List<RegistroDose>> historico(@PathVariable String id) {
        return ResponseEntity.ok(service.buscarPorId(id).getHistoricoDoses());
    }

    @Operation(summary = "Atualizar o horário de um medicamento")
    @ApiResponse(responseCode = "200", description = "Horário atualizado")
    @ApiResponse(responseCode = "404", description = "Medicamento não encontrado")
    @ApiResponse(responseCode = "400", description = "Dados inválidos")
    @PatchMapping("/{id}/horario")
    public ResponseEntity<Medicamento> atualizarHorario(@PathVariable String id,
                                                          @Valid @RequestBody AtualizarHorarioRequest request) {
        return ResponseEntity.ok(service.atualizarHorario(id, request.getHorario()));
    }

    @Operation(summary = "Marcar um medicamento como tomado")
    @ApiResponse(responseCode = "200", description = "Medicamento marcado como tomado")
    @ApiResponse(responseCode = "404", description = "Medicamento não encontrado")
    @PatchMapping("/{id}/tomado")
    public ResponseEntity<Medicamento> marcarComoTomado(@PathVariable String id) {
        return ResponseEntity.ok(service.marcarComoTomado(id));
    }

    @Operation(summary = "Remover um medicamento")
    @ApiResponse(responseCode = "204", description = "Medicamento removido")
    @ApiResponse(responseCode = "404", description = "Medicamento não encontrado")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remover(@PathVariable String id) {
        service.remover(id);
        return ResponseEntity.noContent().build();
    }
}
