package com.aep.monitor.model;

import jakarta.validation.constraints.NotBlank;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.util.Objects;

/**
 * Paciente vinculado a medicamentos (relacionamento entre coleções).
 * Vive na coleção própria "pacientes"; um Medicamento referencia um
 * Paciente através de Medicamento.pacienteId.
 */
@Document(collection = "pacientes")
public class Paciente {

    @Id
    private String id;

    @NotBlank(message = "Nome do paciente é obrigatório")
    private String nome;

    @NotBlank(message = "Contato do paciente é obrigatório")
    private String contato;

    private LocalDate dataNascimento;

    public Paciente() {
    }

    public Paciente(String nome, String contato, LocalDate dataNascimento) {
        this.nome = nome;
        this.contato = contato;
        this.dataNascimento = dataNascimento;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getContato() {
        return contato;
    }

    public void setContato(String contato) {
        this.contato = contato;
    }

    public LocalDate getDataNascimento() {
        return dataNascimento;
    }

    public void setDataNascimento(LocalDate dataNascimento) {
        this.dataNascimento = dataNascimento;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Paciente)) return false;
        Paciente paciente = (Paciente) o;
        return Objects.equals(id, paciente.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "Paciente{" +
                "id='" + id + '\'' +
                ", nome='" + nome + '\'' +
                ", contato='" + contato + '\'' +
                ", dataNascimento=" + dataNascimento +
                '}';
    }
}
