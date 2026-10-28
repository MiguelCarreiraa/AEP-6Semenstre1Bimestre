package com.aep.monitor;

import com.aep.monitor.model.Medicamento;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

class MedicamentoTest {

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
    void deveCriarMedicamentoComDadosValidos() {
        Medicamento m = new Medicamento("pac-1", "Dipirona", "500mg", "08:00");

        assertEquals("pac-1", m.getPacienteId());
        assertEquals("Dipirona", m.getNomeMedicamento());
        assertEquals("500mg", m.getDosagem());
        assertEquals("08:00", m.getHorario());
        assertFalse(m.isTomado());

        Set<ConstraintViolation<Medicamento>> violacoes = validator.validate(m);
        assertTrue(violacoes.isEmpty());
    }

    @Test
    void deveComecarComHistoricoDeDosesVazio() {
        Medicamento m = new Medicamento("pac-1", "Dipirona", "500mg", "08:00");
        assertNotNull(m.getHistoricoDoses());
        assertTrue(m.getHistoricoDoses().isEmpty());
    }

    @Test
    void deveAcusarViolacaoQuandoPacienteIdVazio() {
        Medicamento m = new Medicamento("", "Dipirona", "500mg", "08:00");
        Set<ConstraintViolation<Medicamento>> violacoes = validator.validate(m);
        assertFalse(violacoes.isEmpty());
    }

    @Test
    void deveAcusarViolacaoQuandoMedicamentoNulo() {
        Medicamento m = new Medicamento("pac-1", null, "500mg", "08:00");
        Set<ConstraintViolation<Medicamento>> violacoes = validator.validate(m);
        assertFalse(violacoes.isEmpty());
    }

    @Test
    void deveAcusarViolacaoQuandoDosagemVazia() {
        Medicamento m = new Medicamento("pac-1", "Dipirona", "  ", "08:00");
        Set<ConstraintViolation<Medicamento>> violacoes = validator.validate(m);
        assertFalse(violacoes.isEmpty());
    }

    @Test
    void deveAcusarViolacaoQuandoHorarioVazio() {
        Medicamento m = new Medicamento("pac-1", "Dipirona", "500mg", "");
        Set<ConstraintViolation<Medicamento>> violacoes = validator.validate(m);
        assertFalse(violacoes.isEmpty());
    }

    @Test
    void deveAcusarViolacaoQuandoHorarioForaDoFormato() {
        Medicamento m = new Medicamento("pac-1", "Dipirona", "500mg", "25:99");
        Set<ConstraintViolation<Medicamento>> violacoes = validator.validate(m);
        assertFalse(violacoes.isEmpty());
    }

    @Test
    void deveAcusarViolacaoQuandoHorarioComTextoLivre() {
        Medicamento m = new Medicamento("pac-1", "Dipirona", "500mg", "de manhã");
        Set<ConstraintViolation<Medicamento>> violacoes = validator.validate(m);
        assertFalse(violacoes.isEmpty());
    }

    @Test
    void naoDeveAcusarViolacaoParaHorarioValidoNoLimiteDoDia() {
        Medicamento m = new Medicamento("pac-1", "Dipirona", "500mg", "23:59");
        Set<ConstraintViolation<Medicamento>> violacoes = validator.validate(m);
        assertTrue(violacoes.isEmpty());
    }

    @Test
    void deveMarcarEDesmarcarComoTomado() {
        Medicamento m = new Medicamento("pac-1", "Dipirona", "500mg", "08:00");

        m.marcarComoTomado();
        assertTrue(m.isTomado());

        m.desmarcarComoTomado();
        assertFalse(m.isTomado());
    }

    @Test
    void deveAdicionarRegistroAoHistoricoQuandoMarcarComoTomado() {
        Medicamento m = new Medicamento("pac-1", "Dipirona", "500mg", "08:00");

        m.marcarComoTomado();

        assertEquals(1, m.getHistoricoDoses().size());
        assertNotNull(m.getHistoricoDoses().get(0).getDataHora());
    }

    @Test
    void devePermitirMultiplosRegistrosNoHistoricoAoMarcarVariasVezes() {
        Medicamento m = new Medicamento("pac-1", "Dipirona", "500mg", "08:00");

        m.marcarComoTomado();
        m.marcarComoTomado();

        assertEquals(2, m.getHistoricoDoses().size());
    }

    @Test
    void desmarcarComoTomadoNaoDeveRemoverHistorico() {
        Medicamento m = new Medicamento("pac-1", "Dipirona", "500mg", "08:00");

        m.marcarComoTomado();
        m.desmarcarComoTomado();

        assertFalse(m.isTomado());
        assertEquals(1, m.getHistoricoDoses().size());
    }

    @Test
    void deveAtualizarHorario() {
        Medicamento m = new Medicamento("pac-1", "Dipirona", "500mg", "08:00");
        m.setHorario("09:30");
        assertEquals("09:30", m.getHorario());
    }

    @Test
    void deveAtualizarIdViaSetter() {
        Medicamento m = new Medicamento("pac-1", "Dipirona", "500mg", "08:00");
        m.setId("abc123");
        assertEquals("abc123", m.getId());
    }

    @Test
    void toStringDeveConterCamposPrincipais() {
        Medicamento m = new Medicamento("pac-1", "Dipirona", "500mg", "08:00");
        String texto = m.toString();
        assertTrue(texto.contains("pac-1"));
        assertTrue(texto.contains("Dipirona"));
    }

    @Test
    void doisMedicamentosComMesmoIdDevemSerIguais() {
        Medicamento a = new Medicamento("pac-1", "Dipirona", "500mg", "08:00");
        a.setId("1");
        Medicamento b = new Medicamento("pac-2", "Outro Remédio", "1g", "20:00");
        b.setId("1");

        assertEquals(a, b);
        assertEquals(a.hashCode(), b.hashCode());
    }

    @Test
    void doisMedicamentosComIdDiferenteNaoDevemSerIguais() {
        Medicamento a = new Medicamento("pac-1", "Dipirona", "500mg", "08:00");
        a.setId("1");
        Medicamento b = new Medicamento("pac-1", "Dipirona", "500mg", "08:00");
        b.setId("2");

        assertNotEquals(a, b);
    }
}
