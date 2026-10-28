package com.aep.monitor.service;

import com.aep.monitor.exception.PacienteComMedicamentosVinculadosException;
import com.aep.monitor.exception.PacienteNaoEncontradoException;
import com.aep.monitor.model.Paciente;
import com.aep.monitor.repository.MedicamentoRepository;
import com.aep.monitor.repository.PacienteRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PacienteServiceTest {

    @Mock
    private PacienteRepository repository;

    @Mock
    private MedicamentoRepository medicamentoRepository;

    @InjectMocks
    private PacienteService service;

    private Paciente paciente;

    @BeforeEach
    void setUp() {
        paciente = new Paciente("Maria", "maria@email.com", null);
        paciente.setId("1");
    }

    @Test
    void deveCadastrarZerandoIdEDelegandoParaRepositorio() {
        Paciente novo = new Paciente("Maria", "maria@email.com", null);
        novo.setId("id-que-deve-ser-ignorado");
        when(repository.save(any(Paciente.class))).thenReturn(paciente);

        Paciente resultado = service.cadastrar(novo);

        assertNull(novo.getId());
        assertEquals("1", resultado.getId());
        verify(repository).save(novo);
    }

    @Test
    void deveListarTodos() {
        when(repository.findAll()).thenReturn(List.of(paciente));

        List<Paciente> resultado = service.listarTodos();

        assertEquals(1, resultado.size());
    }

    @Test
    void deveBuscarPorIdQuandoExiste() {
        when(repository.findById("1")).thenReturn(Optional.of(paciente));

        Paciente resultado = service.buscarPorId("1");

        assertEquals("1", resultado.getId());
    }

    @Test
    void deveLancarExcecaoAoBuscarIdInexistente() {
        when(repository.findById("999")).thenReturn(Optional.empty());

        assertThrows(PacienteNaoEncontradoException.class, () -> service.buscarPorId("999"));
    }

    @Test
    void deveRemoverQuandoNaoTemMedicamentosVinculados() {
        when(repository.findById("1")).thenReturn(Optional.of(paciente));
        when(medicamentoRepository.existsByPacienteId("1")).thenReturn(false);

        service.remover("1");

        verify(repository).deleteById("1");
    }

    @Test
    void deveLancarExcecaoAoRemoverPacienteComMedicamentosVinculados() {
        when(repository.findById("1")).thenReturn(Optional.of(paciente));
        when(medicamentoRepository.existsByPacienteId("1")).thenReturn(true);

        assertThrows(PacienteComMedicamentosVinculadosException.class, () -> service.remover("1"));
        verify(repository, never()).deleteById(any());
    }

    @Test
    void deveLancarExcecaoAoRemoverPacienteInexistente() {
        when(repository.findById("999")).thenReturn(Optional.empty());

        assertThrows(PacienteNaoEncontradoException.class, () -> service.remover("999"));
        verify(medicamentoRepository, never()).existsByPacienteId(any());
    }
}
