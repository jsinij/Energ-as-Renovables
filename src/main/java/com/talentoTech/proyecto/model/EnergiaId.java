package com.talentoTech.proyecto.model;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EnergiaId implements Serializable {
    private String country;
    private String year;
}