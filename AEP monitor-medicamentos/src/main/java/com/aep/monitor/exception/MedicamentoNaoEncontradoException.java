package com.aep.monitor.exception;

/**
 * Lançada pela camada de serviço quando um medicamento não é encontrado
 * pelo id informado. Tratada centralmente pelo GlobalExceptionHandler,
 * que a converte em uma resposta HTTP 404 estruturada.
 */
public class MedicamentoNaoEncontradoException extends RecursoNaoEncontradoException {

    public MedicamentoNaoEncontradoException(String id) {
        super("Medicamento não encontrado com id: " + id);
    }
}
