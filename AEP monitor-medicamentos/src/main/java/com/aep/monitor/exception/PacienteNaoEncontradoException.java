package com.aep.monitor.exception;

/**
 * Lançada pela camada de serviço quando um paciente não é encontrado
 * pelo id informado (seja consulta direta, seja ao validar o
 * relacionamento no cadastro de um medicamento).
 */
public class PacienteNaoEncontradoException extends RecursoNaoEncontradoException {

    public PacienteNaoEncontradoException(String id) {
        super("Paciente não encontrado com id: " + id);
    }
}
