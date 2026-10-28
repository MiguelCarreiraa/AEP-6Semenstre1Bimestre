package com.aep.monitor.service;

import com.aep.monitor.exception.PacienteComMedicamentosVinculadosException;
import com.aep.monitor.exception.PacienteNaoEncontradoException;
import com.aep.monitor.model.Paciente;
import com.aep.monitor.repository.MedicamentoRepository;
import com.aep.monitor.repository.PacienteRepository;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Regras de negócio do domínio "paciente". Ao remover um paciente,
 * verifica no MedicamentoRepository se ainda existem medicamentos
 * vinculados — o relacionamento entre as duas coleções é imposto aqui,
 * já que o MongoDB não garante integridade referencial sozinho.
 */
@Service
public class PacienteService {

    private final PacienteRepository repository;
    private final MedicamentoRepository medicamentoRepository;

    public PacienteService(PacienteRepository repository, MedicamentoRepository medicamentoRepository) {
        this.repository = repository;
        this.medicamentoRepository = medicamentoRepository;
    }

    public Paciente cadastrar(Paciente paciente) {
        paciente.setId(null);
        return repository.save(paciente);
    }

    public List<Paciente> listarTodos() {
        return repository.findAll();
    }

    public Paciente buscarPorId(String id) {
        return repository.findById(id)
                .orElseThrow(() -> new PacienteNaoEncontradoException(id));
    }

    public void remover(String id) {
        Paciente paciente = buscarPorId(id);
        if (medicamentoRepository.existsByPacienteId(paciente.getId())) {
            throw new PacienteComMedicamentosVinculadosException(id);
        }
        repository.deleteById(id);
    }
}
