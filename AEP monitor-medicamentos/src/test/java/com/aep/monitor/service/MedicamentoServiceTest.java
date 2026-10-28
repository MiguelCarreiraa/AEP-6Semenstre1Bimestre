package com.aep.monitor.service;

import com.aep.monitor.exception.MedicamentoNaoEncontradoException;
import com.aep.monitor.exception.PacienteNaoEncontradoException;
import com.aep.monitor.model.Medicamento;
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
class MedicamentoServiceTest {

    @Mock
    private MedicamentoRepository repository;

    @Mock
    private PacienteRepository pacienteRepository;

    @InjectMocks
    private MedicamentoService service;

    private Medicamento medicamento;

    @BeforeEach
    void setUp() {
        medicamento = new Medicamento("pac-1", "Dipirona", "500mg", "08:00");
        medicamento.setId("1");
    }

    @Test
    void deveCadastrarZerandoIdEDelegandoParaRepositorio() {
        Medicamento novo = new Medicamento("pac-1", "Dipirona", "500mg", "08:00");
        novo.setId("id-que-deve-ser-ignorado");
        when(pacienteRepository.existsById("pac-1")).thenReturn(true);
        when(repository.save(any(Medicamento.class))).thenReturn(medicamento);

        Medicamento resultado = service.cadastrar(novo);

        assertNull(novo.getId());
        assertEquals("1", resultado.getId());
        verify(repository).save(novo);
    }

    @Test
    void deveLancarExcecaoAoCadastrarComPacienteInexistente() {
        Medicamento novo = new Medicamento("pac-x", "Dipirona", "500mg", "08:00");
        when(pacienteRepository.existsById("pac-x")).thenReturn(false);

        assertThrows(PacienteNaoEncontradoException.class, () -> service.cadastrar(novo));
        verify(repository, never()).save(any());
    }

    @Test
    void deveListarTodos() {
        when(repository.findAll()).thenReturn(List.of(medicamento));

        List<Medicamento> resultado = service.listarTodos();

        assertEquals(1, resultado.size());
        verify(repository).findAll();
    }

    @Test
    void deveListarPorPaciente() {
        when(repository.findByPacienteId("pac-1")).thenReturn(List.of(medicamento));

        List<Medicamento> resultado = service.listarPorPaciente("pac-1");

        assertEquals(1, resultado.size());
        assertEquals("pac-1", resultado.get(0).getPacienteId());
    }

    @Test
    void deveBuscarPorIdQuandoExiste() {
        when(repository.findById("1")).thenReturn(Optional.of(medicamento));

        Medicamento resultado = service.buscarPorId("1");

        assertEquals("1", resultado.getId());
    }

    @Test
    void deveLancarExcecaoAoBuscarIdInexistente() {
        when(repository.findById("999")).thenReturn(Optional.empty());

        assertThrows(MedicamentoNaoEncontradoException.class, () -> service.buscarPorId("999"));
    }

    @Test
    void deveAtualizarHorarioQuandoMedicamentoExiste() {
        when(repository.findById("1")).thenReturn(Optional.of(medicamento));
        when(repository.save(any(Medicamento.class))).thenAnswer(inv -> inv.getArgument(0));

        Medicamento resultado = service.atualizarHorario("1", "14:30");

        assertEquals("14:30", resultado.getHorario());
    }

    @Test
    void deveLancarExcecaoAoAtualizarHorarioDeIdInexistente() {
        when(repository.findById("999")).thenReturn(Optional.empty());

        assertThrows(MedicamentoNaoEncontradoException.class,
                () -> service.atualizarHorario("999", "14:30"));
    }

    @Test
    void deveMarcarComoTomado() {
        when(repository.findById("1")).thenReturn(Optional.of(medicamento));
        when(repository.save(any(Medicamento.class))).thenAnswer(inv -> inv.getArgument(0));

        Medicamento resultado = service.marcarComoTomado("1");

        assertTrue(resultado.isTomado());
        assertEquals(1, resultado.getHistoricoDoses().size());
    }

    @Test
    void deveLancarExcecaoAoMarcarComoTomadoIdInexistente() {
        when(repository.findById("999")).thenReturn(Optional.empty());

        assertThrows(MedicamentoNaoEncontradoException.class, () -> service.marcarComoTomado("999"));
    }

    @Test
    void deveRemoverQuandoExiste() {
        when(repository.existsById("1")).thenReturn(true);

        service.remover("1");

        verify(repository).deleteById("1");
    }

    @Test
    void deveLancarExcecaoAoRemoverIdInexistente() {
        when(repository.existsById("999")).thenReturn(false);

        assertThrows(MedicamentoNaoEncontradoException.class, () -> service.remover("999"));
        verify(repository, never()).deleteById(any());
    }
}
