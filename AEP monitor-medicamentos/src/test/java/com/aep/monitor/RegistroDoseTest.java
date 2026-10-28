package com.aep.monitor;

import com.aep.monitor.model.RegistroDose;
import org.junit.jupiter.api.Test;

import java.time.Instant;

import static org.junit.jupiter.api.Assertions.*;

class RegistroDoseTest {

    @Test
    void deveCriarRegistroComDataHora() {
        Instant agora = Instant.now();
        RegistroDose r = new RegistroDose(agora);
        assertEquals(agora, r.getDataHora());
    }

    @Test
    void deveAtualizarDataHoraViaSetter() {
        RegistroDose r = new RegistroDose();
        Instant agora = Instant.now();
        r.setDataHora(agora);
        assertEquals(agora, r.getDataHora());
    }

    @Test
    void doisRegistrosComMesmaDataHoraDevemSerIguais() {
        Instant agora = Instant.now();
        RegistroDose a = new RegistroDose(agora);
        RegistroDose b = new RegistroDose(agora);
        assertEquals(a, b);
        assertEquals(a.hashCode(), b.hashCode());
    }

    @Test
    void doisRegistrosComDataHoraDiferenteNaoDevemSerIguais() {
        RegistroDose a = new RegistroDose(Instant.ofEpochSecond(1000));
        RegistroDose b = new RegistroDose(Instant.ofEpochSecond(2000));
        assertNotEquals(a, b);
    }

    @Test
    void toStringDeveConterDataHora() {
        Instant agora = Instant.now();
        RegistroDose r = new RegistroDose(agora);
        assertTrue(r.toString().contains(agora.toString()));
    }
}
