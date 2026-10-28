package com.aep.monitor.repository;

import com.aep.monitor.model.Medicamento;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface MedicamentoRepository extends MongoRepository<Medicamento, String> {

    List<Medicamento> findByPacienteId(String pacienteId);

    boolean existsByPacienteId(String pacienteId);
}
