package com.aep.monitor.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

/**
 * Representa um medicamento cadastrado para um paciente.
 * Referencia um Paciente por pacienteId (relacionamento entre as coleções
 * "medicamentos" e "pacientes") e mantém historicoDoses como lista de
 * subdocumentos com o registro de cada vez que a dose foi tomada.
 */
@Document(collection = "medicamentos")
public class Medicamento {

    private static final String FORMATO_HORARIO = "^([01]\\d|2[0-3]):[0-5]\\d$";

    @Id
    private String id;

    @NotBlank(message = "Paciente é obrigatório")
    private String pacienteId;

    @NotBlank(message = "Nome do medicamento é obrigatório")
    private String nomeMedicamento;

    @NotBlank(message = "Dosagem é obrigatória")
    private String dosagem;

    @NotBlank(message = "Horário é obrigatório")
    @Pattern(regexp = FORMATO_HORARIO, message = "Horário deve estar no formato HH:mm (ex: 08:00)")
    private String horario;

    private boolean tomado;

    private List<RegistroDose> historicoDoses = new ArrayList<>();

    public Medicamento() {
    }

    public Medicamento(String pacienteId, String nomeMedicamento, String dosagem, String horario) {
        this.pacienteId = pacienteId;
        this.nomeMedicamento = nomeMedicamento;
        this.dosagem = dosagem;
        this.horario = horario;
        this.tomado = false;
        this.historicoDoses = new ArrayList<>();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getPacienteId() {
        return pacienteId;
    }

    public void setPacienteId(String pacienteId) {
        this.pacienteId = pacienteId;
    }

    public String getNomeMedicamento() {
        return nomeMedicamento;
    }

    public void setNomeMedicamento(String nomeMedicamento) {
        this.nomeMedicamento = nomeMedicamento;
    }

    public String getDosagem() {
        return dosagem;
    }

    public void setDosagem(String dosagem) {
        this.dosagem = dosagem;
    }

    public String getHorario() {
        return horario;
    }

    public void setHorario(String horario) {
        this.horario = horario;
    }

    public boolean isTomado() {
        return tomado;
    }

    public List<RegistroDose> getHistoricoDoses() {
        return historicoDoses;
    }

    public void setHistoricoDoses(List<RegistroDose> historicoDoses) {
        this.historicoDoses = historicoDoses != null ? historicoDoses : new ArrayList<>();
    }

    public void marcarComoTomado() {
        this.tomado = true;
        this.historicoDoses.add(new RegistroDose(Instant.now()));
    }

    public void desmarcarComoTomado() {
        this.tomado = false;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Medicamento)) return false;
        Medicamento that = (Medicamento) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "Medicamento{" +
                "id='" + id + '\'' +
                ", pacienteId='" + pacienteId + '\'' +
                ", nomeMedicamento='" + nomeMedicamento + '\'' +
                ", dosagem='" + dosagem + '\'' +
                ", horario='" + horario + '\'' +
                ", tomado=" + tomado +
                ", historicoDoses=" + historicoDoses +
                '}';
    }
}
