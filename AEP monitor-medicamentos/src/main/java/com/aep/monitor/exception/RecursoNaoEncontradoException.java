package com.aep.monitor.exception;

/**
 * Base comum para exceções de "recurso não encontrado" (Medicamento,
 * Paciente, etc.), tratadas de forma centralizada e única pelo
 * GlobalExceptionHandler, evitando um handler duplicado por entidade.
 */
public abstract class RecursoNaoEncontradoException extends RuntimeException {

    protected RecursoNaoEncontradoException(String mensagem) {
        super(mensagem);
    }
}
