package com.aep.monitor.model;

import java.time.Instant;
import java.util.Objects;

/**
 * Subdocumento embutido em Medicamento.historicoDoses. Cada vez que uma
 * dose é marcada como tomada, um novo registro é adicionado à lista,
 * preservando o histórico completo em vez de apenas o último estado
 * (flag "tomado"). É o objeto complexo exigido na 2ª entrega: não é uma
 * coleção própria, vive apenas dentro do documento de Medicamento.
 */
public class RegistroDose {

    private Instant dataHora;

    public RegistroDose() {
    }

    public RegistroDose(Instant dataHora) {
        this.dataHora = dataHora;
    }

    public Instant getDataHora() {
        return dataHora;
    }

    public void setDataHora(Instant dataHora) {
        this.dataHora = dataHora;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof RegistroDose)) return false;
        RegistroDose that = (RegistroDose) o;
        return Objects.equals(dataHora, that.dataHora);
    }

    @Override
    public int hashCode() {
        return Objects.hash(dataHora);
    }

    @Override
    public String toString() {
        return "RegistroDose{" + "dataHora=" + dataHora + '}';
    }
}
