package com.aep.monitor.exception;

/**
 * Lançada ao tentar remover um paciente que ainda possui medicamentos
 * vinculados — mantém a integridade do relacionamento entre as coleções
 * "pacientes" e "medicamentos", já que o MongoDB não impõe isso sozinho.
 */
public class PacienteComMedicamentosVinculadosException extends RuntimeException {

    public PacienteComMedicamentosVinculadosException(String id) {
        super("Paciente " + id + " possui medicamentos cadastrados e não pode ser removido");
    }
}
