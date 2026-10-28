package com.aep.monitor;

import com.aep.monitor.model.Paciente;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

class PacienteTest {

    private static ValidatorFactory validatorFactory;
    private static Validator validator;

    @BeforeAll
    static void setUpValidator() {
        validatorFactory = Validation.buildDefaultValidatorFactory();
        validator = validatorFactory.getValidator();
    }

    @AfterAll
    static void tearDownValidator() {
        validatorFactory.close();
    }

    @Test
    void deveCriarPacienteComDadosValidos() {
        Paciente p = new Paciente("Maria", "maria@email.com", LocalDate.of(1950, 5, 20));

        assertEquals("Maria", p.getNome());
        assertEquals("maria@email.com", p.getContato());
        assertEquals(LocalDate.of(1950, 5, 20), p.getDataNascimento());

        Set<ConstraintViolation<Paciente>> violacoes = validator.validate(p);
        assertTrue(violacoes.isEmpty());
    }

    @Test
    void naoDeveAcusarViolacaoQuandoDataNascimentoNula() {
        Paciente p = new Paciente("Maria", "maria@email.com", null);
        assertTrue(validator.validate(p).isEmpty());
    }

    @Test
    void deveAcusarViolacaoQuandoNomeVazio() {
        Paciente p = new Paciente("", "maria@email.com", null);
        assertFalse(validator.validate(p).isEmpty());
    }

    @Test
    void deveAcusarViolacaoQuandoContatoVazio() {
        Paciente p = new Paciente("Maria", "", null);
        assertFalse(validator.validate(p).isEmpty());
    }

    @Test
    void deveAtualizarCamposViaSetters() {
        Paciente p = new Paciente("Maria", "maria@email.com", null);
        p.setId("1");
        p.setNome("Maria Silva");
        p.setContato("11999999999");
        p.setDataNascimento(LocalDate.of(1980, 1, 1));

        assertEquals("1", p.getId());
        assertEquals("Maria Silva", p.getNome());
        assertEquals("11999999999", p.getContato());
        assertEquals(LocalDate.of(1980, 1, 1), p.getDataNascimento());
    }

    @Test
    void toStringDeveConterNome() {
        Paciente p = new Paciente("Maria", "maria@email.com", null);
        assertTrue(p.toString().contains("Maria"));
    }

    @Test
    void doisPacientesComMesmoIdDevemSerIguais() {
        Paciente a = new Paciente("Maria", "a@a.com", null);
        a.setId("1");
        Paciente b = new Paciente("Outra", "b@b.com", null);
        b.setId("1");

        assertEquals(a, b);
        assertEquals(a.hashCode(), b.hashCode());
    }

    @Test
    void doisPacientesComIdDiferenteNaoDevemSerIguais() {
        Paciente a = new Paciente("Maria", "a@a.com", null);
        a.setId("1");
        Paciente b = new Paciente("Maria", "a@a.com", null);
        b.setId("2");

        assertNotEquals(a, b);
    }
}
