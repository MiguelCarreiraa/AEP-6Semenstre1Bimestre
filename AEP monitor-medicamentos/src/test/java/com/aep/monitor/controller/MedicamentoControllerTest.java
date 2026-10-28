package com.aep.monitor.controller;

import com.aep.monitor.exception.MedicamentoNaoEncontradoException;
import com.aep.monitor.exception.PacienteNaoEncontradoException;
import com.aep.monitor.model.Medicamento;
import com.aep.monitor.service.MedicamentoService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(MedicamentoController.class)
class MedicamentoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private MedicamentoService service;

    private Medicamento medicamentoValido() {
        Medicamento m = new Medicamento("pac-1", "Dipirona", "500mg", "08:00");
        m.setId("1");
        return m;
    }

    @Test
    void deveCadastrarMedicamentoComDadosValidos() throws Exception {
        Medicamento medicamento = new Medicamento("pac-1", "Dipirona", "500mg", "08:00");
        Medicamento salvo = medicamentoValido();
        when(service.cadastrar(any(Medicamento.class))).thenReturn(salvo);

        mockMvc.perform(post("/medicamentos")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(medicamento)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value("1"))
                .andExpect(jsonPath("$.pacienteId").value("pac-1"));
    }

    @Test
    void deveRetornarBadRequestAoCadastrarComDadosInvalidos() throws Exception {
        Medicamento invalido = new Medicamento("", "", "", "");

        mockMvc.perform(post("/medicamentos")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(invalido)))
                .andExpect(status().isBadRequest());

        verify(service, never()).cadastrar(any());
    }

    @Test
    void deveRetornarBadRequestQuandoHorarioForaDoFormato() throws Exception {
        Medicamento invalido = new Medicamento("pac-1", "Dipirona", "500mg", "25:99");

        mockMvc.perform(post("/medicamentos")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(invalido)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.horario").exists());
    }

    @Test
    void deveRetornarNotFoundAoCadastrarComPacienteInexistente() throws Exception {
        Medicamento medicamento = new Medicamento("pac-x", "Dipirona", "500mg", "08:00");
        when(service.cadastrar(any(Medicamento.class))).thenThrow(new PacienteNaoEncontradoException("pac-x"));

        mockMvc.perform(post("/medicamentos")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(medicamento)))
                .andExpect(status().isNotFound());
    }

    @Test
    void deveListarTodosOsMedicamentos() throws Exception {
        when(service.listarTodos()).thenReturn(List.of(medicamentoValido()));

        mockMvc.perform(get("/medicamentos"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value("1"));
    }

    @Test
    void deveListarMedicamentosDeUmPaciente() throws Exception {
        when(service.listarPorPaciente("pac-1")).thenReturn(List.of(medicamentoValido()));

        mockMvc.perform(get("/medicamentos/paciente/pac-1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].pacienteId").value("pac-1"));
    }

    @Test
    void deveRetornarListaVaziaQuandoPacienteNaoTemMedicamentos() throws Exception {
        when(service.listarPorPaciente("pac-sem-remedio")).thenReturn(List.of());

        mockMvc.perform(get("/medicamentos/paciente/pac-sem-remedio"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$").isEmpty());
    }

    @Test
    void deveBuscarMedicamentoPorId() throws Exception {
        when(service.buscarPorId("1")).thenReturn(medicamentoValido());

        mockMvc.perform(get("/medicamentos/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("1"));
    }

    @Test
    void deveRetornarNotFoundQuandoBuscarIdInexistente() throws Exception {
        when(service.buscarPorId("999")).thenThrow(new MedicamentoNaoEncontradoException("999"));

        mockMvc.perform(get("/medicamentos/999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.mensagem").exists())
                .andExpect(jsonPath("$.status").value(404));
    }

    @Test
    void deveConsultarHistoricoDeDosesDeUmMedicamento() throws Exception {
        Medicamento medicamento = medicamentoValido();
        medicamento.marcarComoTomado();
        when(service.buscarPorId("1")).thenReturn(medicamento);

        mockMvc.perform(get("/medicamentos/1/historico"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].dataHora").exists());
    }

    @Test
    void deveRetornarNotFoundAoConsultarHistoricoDeIdInexistente() throws Exception {
        when(service.buscarPorId("999")).thenThrow(new MedicamentoNaoEncontradoException("999"));

        mockMvc.perform(get("/medicamentos/999/historico"))
                .andExpect(status().isNotFound());
    }

    @Test
    void deveAtualizarHorarioDeMedicamentoExistente() throws Exception {
        Medicamento atualizado = medicamentoValido();
        atualizado.setHorario("12:00");
        when(service.atualizarHorario(eq("1"), eq("12:00"))).thenReturn(atualizado);

        mockMvc.perform(patch("/medicamentos/1/horario")
                        .contentType("application/json")
                        .content("{\"horario\":\"12:00\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.horario").value("12:00"));
    }

    @Test
    void deveRetornarBadRequestAoAtualizarHorarioVazio() throws Exception {
        mockMvc.perform(patch("/medicamentos/1/horario")
                        .contentType("application/json")
                        .content("{\"horario\":\"\"}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void deveRetornarBadRequestAoAtualizarHorarioForaDoFormato() throws Exception {
        mockMvc.perform(patch("/medicamentos/1/horario")
                        .contentType("application/json")
                        .content("{\"horario\":\"vinte horas\"}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void deveRetornarNotFoundAoAtualizarHorarioDeIdInexistente() throws Exception {
        when(service.atualizarHorario(eq("999"), any())).thenThrow(new MedicamentoNaoEncontradoException("999"));

        mockMvc.perform(patch("/medicamentos/999/horario")
                        .contentType("application/json")
                        .content("{\"horario\":\"12:00\"}"))
                .andExpect(status().isNotFound());
    }

    @Test
    void deveMarcarMedicamentoComoTomado() throws Exception {
        Medicamento tomado = medicamentoValido();
        tomado.marcarComoTomado();
        when(service.marcarComoTomado("1")).thenReturn(tomado);

        mockMvc.perform(patch("/medicamentos/1/tomado"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.tomado").value(true));
    }

    @Test
    void deveRetornarNotFoundAoMarcarComoTomadoIdInexistente() throws Exception {
        when(service.marcarComoTomado("999")).thenThrow(new MedicamentoNaoEncontradoException("999"));

        mockMvc.perform(patch("/medicamentos/999/tomado"))
                .andExpect(status().isNotFound());
    }

    @Test
    void deveRemoverMedicamentoExistente() throws Exception {
        doNothing().when(service).remover("1");

        mockMvc.perform(delete("/medicamentos/1"))
                .andExpect(status().isNoContent());

        verify(service).remover("1");
    }

    @Test
    void deveRetornarNotFoundAoRemoverIdInexistente() throws Exception {
        doThrow(new MedicamentoNaoEncontradoException("999")).when(service).remover("999");

        mockMvc.perform(delete("/medicamentos/999"))
                .andExpect(status().isNotFound());
    }
}
