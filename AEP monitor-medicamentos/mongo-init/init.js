// Script de inicialização do MongoDB — roda automaticamente na primeira vez
// que o container sobe (ver docker-compose.yml).
//
// 2ª entrega da AEP: evolui de uma única coleção para duas coleções
// relacionadas ("pacientes" e "medicamentos", ligadas por pacienteId) e
// introduz um objeto complexo (historicoDoses, lista de subdocumentos
// dentro de cada medicamento).

db = db.getSiblingDB("monitor_medicamentos");

db.createCollection("pacientes", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["nome", "contato"],
            properties: {
                nome: {
                    bsonType: "string",
                    description: "Nome do paciente é obrigatório"
                },
                contato: {
                    bsonType: "string",
                    description: "Contato do paciente é obrigatório"
                },
                dataNascimento: {
                    bsonType: ["date", "null"],
                    description: "Data de nascimento do paciente (opcional)"
                }
            }
        }
    },
    validationLevel: "moderate"
});

db.createCollection("medicamentos", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["pacienteId", "nomeMedicamento", "dosagem", "horario", "tomado"],
            properties: {
                pacienteId: {
                    bsonType: "string",
                    description: "Id do paciente vinculado é obrigatório (relacionamento com a coleção 'pacientes')"
                },
                nomeMedicamento: {
                    bsonType: "string",
                    description: "Nome do medicamento é obrigatório"
                },
                dosagem: {
                    bsonType: "string",
                    description: "Dosagem é obrigatória"
                },
                horario: {
                    bsonType: "string",
                    description: "Horário é obrigatório"
                },
                tomado: {
                    bsonType: "bool",
                    description: "Indica se a dose já foi tomada"
                },
                historicoDoses: {
                    bsonType: "array",
                    description: "Objeto complexo: lista de subdocumentos com cada dose tomada",
                    items: {
                        bsonType: "object",
                        required: ["dataHora"],
                        properties: {
                            dataHora: {
                                bsonType: "date",
                                description: "Momento em que a dose foi tomada"
                            }
                        }
                    }
                }
            }
        }
    },
    validationLevel: "moderate"
});

db.medicamentos.createIndex({ pacienteId: 1 });

print("Coleções 'pacientes' e 'medicamentos' criadas: relacionamento por pacienteId, " +
      "validação de schema e índice em pacienteId.");
