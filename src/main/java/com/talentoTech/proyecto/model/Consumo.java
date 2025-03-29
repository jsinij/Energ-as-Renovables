package com.talentoTech.proyecto.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "consumo")
@IdClass(EnergiaId.class)
@Data
public class Consumo {
    @Id
    private String country;

    @Id
    private String year;

    private Double solar;
    private Double wind;
    private Double hydro;
}
