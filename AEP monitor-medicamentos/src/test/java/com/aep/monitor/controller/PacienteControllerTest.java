package com.aep.monitor.controller;

import com.aep.monitor.exception.PacienteComMedicamentosVinculadosException;
import com.aep.monitor.exception.PacienteNaoEncontradoException;
import com.aep.monitor.model.Paciente;
import com.aep.monitor.service.PacienteService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(PacienteController.class)
class PacienteControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private PacienteService service;

    private Paciente pacienteValido() {
        Paciente p = new Paciente("Maria", "maria@email.com", null);
        p.setId("1");
        return p;
    }

    @Test
    void deveCadastrarPacienteComDadosValidos() throws Exception {
        Paciente paciente = new Paciente("Maria", "maria@email.com", null);
        Paciente salvo = pacienteValido();
        when(service.cadastrar(any(Paciente.class))).thenReturn(salvo);

        mockMvc.perform(post("/pacientes")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(paciente)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value("1"))
                .andExpect(jsonPath("$.nome").value("Maria"));
    }

    @Test
    void deveRetornarBadRequestAoCadastrarComDadosInvalidos() throws Exception {
        Paciente invalido = new Paciente("", "", null);

        mockMvc.perform(post("/pacientes")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(invalido)))
                .andExpect(status().isBadRequest());

        verify(service, never()).cadastrar(any());
    }

    @Test
    void deveListarTodosOsPacientes() throws Exception {
        when(service.listarTodos()).thenReturn(List.of(pacienteValido()));

        mockMvc.perform(get("/pacientes"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value("1"));
    }

    @Test
    void deveBuscarPacientePorId() throws Exception {
        when(service.buscarPorId("1")).thenReturn(pacienteValido());

        mockMvc.perform(get("/pacientes/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nome").value("Maria"));
    }

    @Test
    void deveRetornarNotFoundQuandoBuscarIdInexistente() throws Exception {
        when(service.buscarPorId("999")).thenThrow(new PacienteNaoEncontradoException("999"));

        mockMvc.perform(get("/pacientes/999"))
                .andExpect(status().isNotFound());
    }

    @Test
    void deveRemoverPacienteSemMedicamentosVinculados() throws Exception {
        doNothing().when(service).remover("1");

        mockMvc.perform(delete("/pacientes/1"))
                .andExpect(status().isNoContent());

        verify(service).remover("1");
    }

    @Test
    void deveRetornarNotFoundAoRemoverPacienteInexistente() throws Exception {
        doThrow(new PacienteNaoEncontradoException("999")).when(service).remover("999");

        mockMvc.perform(delete("/pacientes/999"))
                .andExpect(status().isNotFound());
    }

    @Test
    void deveRetornarConflitoAoRemoverPacienteComMedicamentosVinculados() throws Exception {
        doThrow(new PacienteComMedicamentosVinculadosException("1")).when(service).remover("1");

        mockMvc.perform(delete("/pacientes/1"))
                .andExpect(status().isConflict());
    }
}
